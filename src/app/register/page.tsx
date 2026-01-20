"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@refinedev/core";
import {
  PackagePlus,
  PackageSearch,
  Users,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Inbox,
  RefreshCw,
  Package,
  Instagram,
  Twitter,
  Sparkles,
  Zap,
  HeartHandshake,
  ChevronRight
} from "lucide-react";

// --- Types & Config ---

type UserRole = 'giver' | 'receiver' | 'both';
type Category = 'Clothing' | 'Accessories' | 'Shoes' | 'Bags' | 'Other';

const categories: Category[] = ['Clothing', 'Accessories', 'Shoes', 'Bags', 'Other'];

const roleConfig = {
  giver: {
    icon: PackagePlus,
    displayIcon: <Zap className="w-6 h-6" />,
    title: "The Supplier",
    subtitle: "Giver",
    description: "Clear your closet. Drop heat for the community.",
    fields: ['preferredCategories', 'aboutGiving'],
    dbRole: 'GIVER',
    canListItems: true,
    canRequestItems: false,
    gradient: "from-amber-500 to-orange-600"
  },
  receiver: {
    icon: PackageSearch,
    displayIcon: <Sparkles className="w-6 h-6" />,
    title: "The Collector",
    subtitle: "Receiver",
    description: "Hunt for hidden gems and secure the drops.",
    fields: ['preferredCategories', 'aboutReceiving'],
    dbRole: 'RECEIVER',
    canListItems: false,
    canRequestItems: true,
    gradient: "from-cyan-500 to-blue-600"
  },
  both: {
    icon: Users,
    displayIcon: <HeartHandshake className="w-6 h-6" />,
    title: "All Access",
    subtitle: "Both",
    description: "Full ecosystem access. Give back and get back.",
    fields: ['preferredCategories', 'aboutGiving', 'aboutReceiving'],
    dbRole: 'BOTH',
    canListItems: true,
    canRequestItems: true,
    gradient: "from-violet-500 to-fuchsia-600"
  }
};

export default function SignUp() {
  const router = useRouter();
  const { mutate: register, isLoading } = useRegister();
  const [currentStep, setCurrentStep] = useState(1);
  const [showVerification, setShowVerification] = useState(false);
  
  const [formData, setFormData] = useState({
    role: '' as UserRole,
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    location: '',
    bio: '',
    avatar: '',
    preferredCategories: [] as Category[],
    aboutGiving: '',
    aboutReceiving: '',
    socialLinks: { instagram: '', twitter: '' }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Validation Logic ---
  
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.role) newErrors.role = 'Select a specialized role';
    if (!formData.email) newErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.username) newErrors.username = 'Username required';
    else if (formData.username.length < 3) newErrors.username = 'Min 3 chars';
    if (!formData.password) newErrors.password = 'Password required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'No match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Name required';
    if (!formData.location) newErrors.location = 'Location required';
    const role = formData.role as UserRole;
    if (roleConfig[role].fields.includes('preferredCategories') && formData.preferredCategories.length === 0) {
      newErrors.preferredCategories = 'Select at least one tag';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) handleSubmit();
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const role = formData.role as UserRole;
    const config = roleConfig[role];
    const payload = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
      role: config.dbRole,
      subscriptionTier: 'FREE',
      fullName: formData.fullName,
      location: formData.location,
      bio: formData.bio,
      avatar: formData.avatar,
      preferredCategories: formData.preferredCategories,
      aboutGiving: formData.aboutGiving,
      aboutReceiving: formData.aboutReceiving,
      socialLinks: formData.socialLinks,
      canListItems: config.canListItems,
      canRequestItems: config.canRequestItems
    };

    register(payload, {
      onSuccess: () => setShowVerification(true),
      onError: (error: any) => setErrors({ submit: error?.message || 'Registration failed.' })
    });
  };

  const toggleCategory = (category: Category) => {
    setFormData(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  // --- Sub-Components ---

  const StepIndicator = () => (
    <div className="space-y-8 relative">
       {/* Vertical Line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-zinc-900 z-0" />
      
      {[1, 2].map((step) => {
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;
        
        return (
          <div key={step} className="relative z-10 flex items-center gap-4">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all duration-300 shadow-lg
              ${isActive || isCompleted 
                ? "bg-indigo-600 border-indigo-500 text-white shadow-indigo-500/20" 
                : "bg-black border-zinc-800 text-zinc-600"
              }
            `}>
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-semibold tracking-wide ${isActive || isCompleted ? "text-white" : "text-zinc-600"}`}>
                {step === 1 ? "Identity & Access" : "Profile Details"}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                {step === 1 ? "Choose your path" : "Tell us about you"}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  );

  if (showVerification) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        
        <div className="w-full max-w-lg bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 relative z-10 text-center space-y-8">
           <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
             <Inbox className="w-10 h-10 text-white" />
           </div>
           
           <div className="space-y-2">
             <h2 className="text-3xl font-bold tracking-tight">Check your inbox</h2>
             <p className="text-zinc-400">We've sent a magic link to <span className="text-white font-medium">{formData.email}</span></p>
           </div>

           <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50 text-sm text-zinc-400">
             Click the link in the email to activate your <strong>{roleConfig[formData.role as UserRole]?.title}</strong> account.
           </div>

           <div className="space-y-3">
             <button onClick={() => window.open('https://mail.google.com', '_blank')} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
               Open Email App
             </button>
             <button onClick={() => router.push('/login')} className="w-full py-4 text-zinc-400 hover:text-white font-medium transition-colors">
               Skip for now
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 flex relative overflow-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 relative z-10 min-h-screen">
        
        {/* --- LEFT: Brand & Progress --- */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between p-12 border-r border-zinc-900/50 bg-black/20 backdrop-blur-sm sticky top-0 h-screen">
          <div className="space-y-12">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight">StuffsDrop</span>
            </div>
            
            <StepIndicator />
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
              <p className="text-sm text-zinc-400 italic leading-relaxed">
                "StuffsDrop completely changed how I find vintage gear. The community is unreal."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                <div className="text-xs">
                  <div className="text-white font-medium">Alex Chen</div>
                  <div className="text-zinc-500">Verified Collector</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Form Area --- */}
        <div className="lg:col-span-8 p-6 md:p-12 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto w-full space-y-8">
            
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-8">
               <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Package className="w-4 h-4"/></div>
                <span className="font-bold text-lg">StuffsDrop</span>
               </div>
               <div className="text-xs font-medium text-zinc-500">Step {currentStep} of 2</div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {currentStep === 1 ? "Claim your handle" : "Build your profile"}
              </h1>
              <p className="text-zinc-400 text-lg">
                {currentStep === 1 ? "Start by choosing how you want to contribute." : "Help the community get to know you."}
              </p>
            </div>

            {/* ERROR BANNER */}
            {errors.submit && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {errors.submit}
              </div>
            )}

            {/* --- STEP 1 FORM --- */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Role Selection Cards */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Select Your Archetype</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.entries(roleConfig) as [UserRole, typeof roleConfig.giver][]).map(([key, config]) => {
                      const isSelected = formData.role === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateField('role', key)}
                          className={`
                            relative p-5 rounded-2xl border text-left transition-all duration-300 group overflow-hidden
                            ${isSelected 
                              ? "bg-zinc-900 border-zinc-700 ring-2 ring-indigo-500 ring-offset-2 ring-offset-black" 
                              : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700"
                            }
                          `}
                        >
                          {isSelected && (
                             <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-10 pointer-events-none`} />
                          )}
                          <div className={`mb-3 ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                            {config.displayIcon}
                          </div>
                          <h3 className="font-bold text-sm text-white mb-1">{config.title}</h3>
                          <p className="text-xs text-zinc-500 leading-relaxed">{config.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  {errors.role && <p className="text-xs text-red-400 ml-1">{errors.role}</p>}
                </div>

                {/* Auth Inputs */}
                <div className="grid gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-400 ml-1">Email</label>
                      <div className="relative group">
                         <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                         <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                            placeholder="you@example.com"
                         />
                      </div>
                      {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email}</p>}
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-400 ml-1">Username</label>
                      <div className="relative group">
                         <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                         <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => updateField('username', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                            placeholder="Unique handle"
                         />
                      </div>
                      {errors.username && <p className="text-xs text-red-400 ml-1">{errors.username}</p>}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                           <input 
                              type="password" 
                              value={formData.password}
                              onChange={(e) => updateField('password', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                              placeholder="••••••••"
                           />
                        </div>
                        {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Confirm Password</label>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                           <input 
                              type="password" 
                              value={formData.confirmPassword}
                              onChange={(e) => updateField('confirmPassword', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                              placeholder="••••••••"
                           />
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-400 ml-1">{errors.confirmPassword}</p>}
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* --- STEP 2 FORM --- */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Avatar & Basic Info */}
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex-shrink-0 group cursor-pointer">
                      <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-zinc-500 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-wide">Upload</span>
                      </div>
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          value={formData.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">City & State</label>
                        <div className="relative group">
                           <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                           <input 
                              type="text" 
                              value={formData.location}
                              onChange={(e) => updateField('location', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                              placeholder="New York, NY"
                           />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Role Specific Config */}
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 space-y-6">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      {roleConfig[formData.role as UserRole]?.displayIcon}
                      {roleConfig[formData.role as UserRole]?.title} Preferences
                   </h3>

                   {/* Tags */}
                   {roleConfig[formData.role as UserRole].fields.includes('preferredCategories') && (
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-zinc-400">Interested In</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              className={`
                                px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all
                                ${formData.preferredCategories.includes(cat)
                                  ? "bg-white text-black border-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)]"
                                  : "bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                }
                              `}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        {errors.preferredCategories && <p className="text-xs text-red-400">{errors.preferredCategories}</p>}
                      </div>
                   )}

                   {/* Dynamic Bio Fields based on role */}
                   {roleConfig[formData.role as UserRole].fields.includes('aboutGiving') && (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400">Supplier Manifesto (About your drops)</label>
                        <textarea
                          rows={2}
                          value={formData.aboutGiving}
                          onChange={(e) => updateField('aboutGiving', e.target.value)}
                          className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm resize-none"
                          placeholder="I usually drop vintage tees and denim..."
                        />
                      </div>
                   )}

                   {roleConfig[formData.role as UserRole].fields.includes('aboutReceiving') && (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400">Collector's Focus (What you need)</label>
                        <textarea
                          rows={2}
                          value={formData.aboutReceiving}
                          onChange={(e) => updateField('aboutReceiving', e.target.value)}
                          className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm resize-none"
                          placeholder="Looking for jackets, size M-L..."
                        />
                      </div>
                   )}
                </div>

                {/* Socials */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5"><Instagram className="w-4 h-4 text-zinc-500 group-focus-within:text-pink-500 transition-colors"/></div>
                    <input 
                      type="text" 
                      placeholder="Instagram"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => updateSocialLink('instagram', e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5"><Twitter className="w-4 h-4 text-zinc-500 group-focus-within:text-sky-500 transition-colors"/></div>
                    <input 
                      type="text" 
                      placeholder="Twitter / X"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => updateSocialLink('twitter', e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- ACTION BUTTONS --- */}
            <div className="flex items-center gap-4 pt-4 border-t border-zinc-900">
               {currentStep > 1 && (
                 <button
                   onClick={handleBack}
                   disabled={isLoading}
                   className="px-6 py-4 rounded-xl border border-zinc-800 text-zinc-400 font-medium hover:bg-zinc-900 hover:text-white transition-colors"
                 >
                   <ArrowLeft className="w-5 h-5" />
                 </button>
               )}
               <button
                 onClick={handleNext}
                 disabled={isLoading}
                 className={`
                   flex-1 py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2
                   bg-white hover:bg-zinc-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]
                   hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] active:scale-[0.98]
                   disabled:opacity-70 disabled:cursor-not-allowed
                 `}
               >
                 {isLoading ? (
                   <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                 ) : (
                   <>
                     {currentStep === 2 ? "Mint Profile" : "Continue"}
                     <ArrowRight className="w-5 h-5" />
                   </>
                 )}
               </button>
            </div>

            <div className="text-center">
              <p className="text-zinc-500 text-xs">
                Already have an account?{' '}
                <button onClick={() => router.push('/login')} className="text-white hover:underline decoration-zinc-500 underline-offset-4">
                  Sign In
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}