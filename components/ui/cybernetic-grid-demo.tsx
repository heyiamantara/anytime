import CyberneticGridShader from "@/components/ui/cybernetic-grid-shader";

export default function CyberneticGridDemo() {
  return (
    <div className="relative w-full h-screen bg-black">
      <CyberneticGridShader />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">Cybernetic Grid</h1>
          <p className="text-xl text-gray-300">An Interactive WebGL Shader</p>
        </div>
      </div>
    </div>
  );
}