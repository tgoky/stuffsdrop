"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@refinedev/core";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Package, 
  Sparkles 
} from "lucide-react";

// --- 3D CUBE COMPONENT ---
const FloatingDropCube = () => {
  return (
    <div className="cube-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] pointer-events-none z-0">
      <div className="cube">
        {/* Front Face */}
        <div className="face front flex items-center justify-center border border-indigo-500/30 bg-indigo-600/10 backdrop-blur-md">
          <Package className="w-16 h-16 text-white/50" strokeWidth={1} />
        </div>
        {/* Back Face */}
        <div className="face back border border-indigo-500/30 bg-indigo-600/10 backdrop-blur-md" />
        {/* Right Face */}
        <div className="face right border border-indigo-500/30 bg-indigo-600/10 backdrop-blur-md" />
        {/* Left Face */}
        <div className="face left border border-indigo-500/30 bg-indigo-600/10 backdrop-blur-md" />
        {/* Top Face */}
        <div className="face top border border-white/20 bg-indigo-400/20 backdrop-blur-md" />
        {/* Bottom Face */}
        <div className="face bottom border border-indigo-500/30 bg-indigo-600/10 backdrop-blur-md shadow-[0_0_50px_rgba(99,102,241,0.4)]" />
      </div>
    </div>
  );
};

export default function LoginClient() {
  const router = useRouter();
  const { mutate: login, isLoading } = useLogin();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      login({
        email: formData.username,
        password: formData.password,
        remember: formData.rememberMe,
      });
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex w-full bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden font-sans">
      
      {/* --- INJECTED STYLES FOR ANIMATIONS --- */}
      <style jsx global>{`
        /* Cube 3D Logic */
        .cube-container { perspective: 1000px; }
        .cube {
          width: 100%; height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: floatRotate 12s infinite linear;
        }
        .face {
          position: absolute; width: 200px; height: 200px;
        }
        .front  { transform: rotateY(0deg) translateZ(100px); }
        .back   { transform: rotateY(180deg) translateZ(100px); }
        .right  { transform: rotateY(90deg) translateZ(100px); }
        .left   { transform: rotateY(-90deg) translateZ(100px); }
        .top    { transform: rotateX(90deg) translateZ(100px); }
        .bottom { transform: rotateX(-90deg) translateZ(100px); }

        /* Animations */
        @keyframes floatRotate {
          0% { transform: rotateX(-15deg) rotateY(0deg) translateY(0px); }
          50% { transform: rotateX(-15deg) rotateY(180deg) translateY(-20px); }
          100% { transform: rotateX(-15deg) rotateY(360deg) translateY(0px); }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.3; filter: blur(80px); }
          50% { transform: scale(1.3); opacity: 0.6; filter: blur(60px); }
        }

        /* Perspective Grid Floor */
        .perspective-grid {
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          transform: perspective(500px) rotateX(60deg);
          transform-origin: top;
        }
      `}</style>

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Left Subtle Orb */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        
        {/* THE BREATHING GLOW (Bottom Right) */}
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-violet-600 rounded-full animate-[breathe_6s_ease-in-out_infinite]" />
        
        {/* Grid Floor Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] perspective-grid mask-image-gradient" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }}></div>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 relative z-10 h-screen">
        
        {/* --- LEFT COLUMN: Brand Experience & 3D Object --- */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative">
          
          {/* Logo */}
          <div className="relative z-20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              StuffsDrop
            </span>
          </div>

          {/* THE 3D FLOATING CUBE */}
          <div className="absolute inset-0 flex items-center justify-center z-0 opacity-80 scale-125 translate-x-20">
            <FloatingDropCube />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 space-y-8 max-w-lg mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium tracking-wide">
              <Sparkles className="w-3 h-3" />
              <span>The drop is live</span>
            </div>
            
            <h1 className="text-6xl font-semibold tracking-tight leading-[1] drop-shadow-2xl">
               The marketplace for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white animate-pulse">
                free hidden gems.
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 leading-relaxed max-w-md backdrop-blur-sm">
                Join the community redefining ownership. Give away what you don't need, find what you love, and keep the cycle moving all for free! 
            </p>

            <div className="flex gap-4 pt-2">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                     <Package className="w-4 h-4" />
                   </div>
                 ))}
               </div>
               <div className="flex flex-col justify-center">
                 <span className="text-sm font-bold text-white">5k+ free stuffs</span>
                 <span className="text-xs text-zinc-500">claimed this week</span>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-20 flex items-center gap-6 text-xs text-zinc-600 font-medium tracking-wide uppercase">
            <span>© 2026 StuffsDrop Inc.</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>Privacy Policy</span>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Login Form --- */}
        <div className="flex items-center justify-center p-6 lg:p-12 w-full relative">
          
          {/* Subtle glow behind form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-[420px] space-y-8 relative z-10">
            
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">StuffsDrop</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="text-sm text-zinc-400">
                Enter your credentials to access the drop
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    className={`
                      block w-full pl-11 pr-4 py-3.5 bg-black/40 border backdrop-blur-sm
                      rounded-xl text-sm placeholder:text-zinc-600 text-white
                      transition-all duration-200 outline-none
                      focus:bg-zinc-900/80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50
                      ${errors.username ? "border-red-500/50 focus:border-red-500" : "border-zinc-800"}
                    `}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.username && <p className="text-xs text-red-400 ml-1">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={`
                      block w-full pl-11 pr-12 py-3.5 bg-black/40 border backdrop-blur-sm
                      rounded-xl text-sm placeholder:text-zinc-600 text-white
                      transition-all duration-200 outline-none
                      focus:bg-zinc-900/80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50
                      ${errors.password ? "border-red-500/50 focus:border-red-500" : "border-zinc-800"}
                    `}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => updateField('rememberMe', e.target.checked)}
                      className="peer h-4 w-4 appearance-none rounded border border-zinc-700 bg-black/50 checked:bg-indigo-500 checked:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <svg
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* FIX: Use backticks for multi-line className */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  group w-full py-3.5 px-4 bg-white text-black text-sm font-bold rounded-xl 
                  hover:bg-indigo-50 transition-all duration-300 
                  disabled:opacity-70 disabled:cursor-not-allowed
                  shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]
                  hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.6)]
                  active:scale-[0.98]
                  flex items-center justify-center gap-2
                `}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-zinc-800/50 text-center">
              <p className="text-xs text-zinc-500">
                New to StuffsDrop?{' '}
                <button
                  onClick={() => router.push('/register')}
                  className="font-medium text-white hover:text-indigo-400 transition-colors"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}