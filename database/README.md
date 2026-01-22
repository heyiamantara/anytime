# Anytime Database Setup Guide

This guide will help you set up the database schema for Anytime using Supabase.

## Prerequisites

1. Supabase project created
2. Email authentication enabled in Supabase Auth settings

## Database Setup Steps

### 1. Run the Schema SQL

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `schema.sql` and paste it into a new query
4. Click **Run** to execute the schema

### 2. Verify Tables Created

After running the schema, you should see these tables in your **Table Editor**:

- `events` - Stores event information
- `participants` - Stores participant details  
- `availability` - Stores availability data

### 3. Environment Variables

Create a `.env.local` file in your project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema Overview

### Tables

#### `events`
- Stores event details (name, dates, time slots)
- Links to the user who created it
- Can be locked with a selected time
- Uses JSONB for flexible time block storage

#### `participants` 
- Stores participant information
- No authentication required for participants
- Includes optional email and display color

#### `availability`
- Junction table linking participants to time slots
- Stores date + time + availability boolean
- Unique constraint prevents duplicate entries

### Security

- **Row Level Security (RLS)** enabled on all tables
- Event creators can manage their events
- Public read access for sharing (participants don't need accounts)
- Participants can only modify their own availability

### Helper Functions

- `get_availability_summary()` - Get availability counts per time slot
- `get_optimal_times()` - Find time slots with most participants available
- Auto-updating timestamps with triggers

## Next Steps

1. Install Supabase client library: `npm install @supabase/supabase-js`
2. Set up Supabase client configuration
3. Create API routes for event management
4. Implement authentication for event creators

## Testing the Schema

You can test the schema by:

1. Creating a test user through Supabase Auth
2. Uncommenting the sample data in `schema.sql`
3. Replacing the UUID with your test user's ID
4. Running queries to verify data relationships

## Common Queries

```sql
-- Get all events for a user
SELECT * FROM events WHERE created_by = auth.uid();

-- Get availability summary for an event
SELECT * FROM get_availability_summary('event-uuid-here');

-- Find optimal meeting times
SELECT * FROM get_optimal_times('event-uuid-here');
```