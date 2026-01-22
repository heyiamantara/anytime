-- Anytime Database Schema for Supabase
-- This file contains all the SQL commands to set up the database structure

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    time_blocks JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of time slots like ["09:00", "10:00", "11:00"]
    is_24_7 BOOLEAN DEFAULT false, -- Whether this event has 24/7 availability
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'locked')),
    locked_time VARCHAR(10), -- Time slot that was selected (e.g., "14:00")
    locked_by UUID REFERENCES auth.users(id),
    locked_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PARTICIPANTS TABLE
-- =============================================
CREATE TABLE participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255), -- Optional email for notifications
    color VARCHAR(7) DEFAULT '#8b5cf6', -- Hex color for UI display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AVAILABILITY TABLE
-- =============================================
CREATE TABLE availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    time_block VARCHAR(10) NOT NULL, -- Time slot like "09:00", "14:30"
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one availability record per participant per date/time combination
    UNIQUE(participant_id, event_id, date, time_block)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_participants_event_id ON participants(event_id);
CREATE INDEX idx_availability_event_id ON availability(event_id);
CREATE INDEX idx_availability_participant_id ON availability(participant_id);
CREATE INDEX idx_availability_date_time ON availability(date, time_block);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Events policies
-- Event creators can do everything with their events
CREATE POLICY "Event creators can manage their events" ON events
    FOR ALL USING (auth.uid() = created_by);

-- Anyone can view events (for sharing links)
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

-- Participants policies
-- Anyone can view participants (needed for event sharing)
CREATE POLICY "Anyone can view participants" ON participants
    FOR SELECT USING (true);

-- Anyone can insert participants (for joining events)
CREATE POLICY "Anyone can create participants" ON participants
    FOR INSERT WITH CHECK (true);

-- Event creators can manage participants in their events
CREATE POLICY "Event creators can manage participants" ON participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = participants.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Availability policies
-- Anyone can view availability (needed for displaying the grid)
CREATE POLICY "Anyone can view availability" ON availability
    FOR SELECT USING (true);

-- Anyone can insert availability (for marking times)
CREATE POLICY "Anyone can insert availability" ON availability
    FOR INSERT WITH CHECK (true);

-- Participants can update their own availability
CREATE POLICY "Participants can update their availability" ON availability
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM participants 
            WHERE participants.id = availability.participant_id
        )
    );

-- Event creators can manage all availability in their events
CREATE POLICY "Event creators can manage availability" ON availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = availability.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- =============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at 
    BEFORE UPDATE ON availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get availability summary for an event
CREATE OR REPLACE FUNCTION get_availability_summary(event_uuid UUID)
RETURNS TABLE (
    date DATE,
    time_block VARCHAR(10),
    available_count BIGINT,
    participant_names TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.date,
        a.time_block,
        COUNT(*) as available_count,
        ARRAY_AGG(p.name) as participant_names
    FROM availability a
    JOIN participants p ON a.participant_id = p.id
    WHERE a.event_id = event_uuid 
    AND a.available = true
    GROUP BY a.date, a.time_block
    ORDER BY a.date, a.time_block;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find optimal time slots (most participants available)
CREATE OR REPLACE FUNCTION get_optimal_times(event_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    date DATE,
    time_block VARCHAR(10),
    available_count BIGINT,
    total_participants BIGINT,
    percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH event_participants AS (
        SELECT COUNT(*) as total_count
        FROM participants 
        WHERE event_id = event_uuid
    ),
    availability_counts AS (
        SELECT 
            a.date,
            a.time_block,
            COUNT(*) as available_count
        FROM availability a
        WHERE a.event_id = event_uuid 
        AND a.available = true
        GROUP BY a.date, a.time_block
    )
    SELECT 
        ac.date,
        ac.time_block,
        ac.available_count,
        ep.total_count as total_participants,
        ROUND((ac.available_count::NUMERIC / ep.total_count::NUMERIC) * 100, 1) as percentage
    FROM availability_counts ac
    CROSS JOIN event_participants ep
    ORDER BY ac.available_count DESC, ac.date, ac.time_block
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Uncomment the following lines if you want to insert sample data for testing

/*
-- Insert a sample event (you'll need to replace the UUID with a real user ID)
INSERT INTO events (name, description, start_date, end_date, time_blocks, created_by) VALUES
('Team Planning Session', 'Weekly team sync to plan upcoming projects', '2024-01-23', '2024-01-27', 
 '["09:00", "10:00", "14:00", "15:00", "16:00"]'::jsonb, 
 '00000000-0000-0000-0000-000000000000'); -- Replace with actual user UUID

-- Insert sample participants
INSERT INTO participants (event_id, name, email, color) VALUES
((SELECT id FROM events WHERE name = 'Team Planning Session'), 'Alex Chen', 'alex@example.com', '#3b82f6'),
((SELECT id FROM events WHERE name = 'Team Planning Session'), 'Sam Johnson', 'sam@example.com', '#10b981'),
((SELECT id FROM events WHERE name = 'Team Planning Session'), 'Jordan Lee', 'jordan@example.com', '#8b5cf6');
*/