import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '../services/auth.service';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: '✦', text: 'Paste job description' },
    { icon: '⚡', text: 'AI auto-fills details' },
    { icon: '🎯', text: 'Track & land the offer' },
  ];

  const floatingOrbs = [
    { size: 360, x: '-10%', y: '-10%', color: 'from-indigo-200/35 to-violet-100/25', delay: 0 },
    { size: 260, x: '75%', y: '65%', color: 'from-cyan-200/25 to-sky-100/20', delay: 2 },
    { size: 160, x: '85%', y: '-5%', color: 'from-pink-200/20 to-rose-100/15', delay: 1 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center overflow-hidden relative">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`fixed rounded-full bg-gradient-radial ${orb.color} blur-3xl pointer-events-none`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ y: [0, -25, 0], x: [0, 12, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 9 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}

      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Left panel - how it works */}
      <motion.div
        className="hidden lg:flex fixed left-0 top-0 h-full w-[42%] flex-col justify-between p-12 z-10"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            JobTrack<span className="text-violet-600">AI</span>
          </span>
        </div>

        {/* Headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] text-violet-500 uppercase mb-4">Join thousands of job seekers</p>
            <h1 className="text-5xl font-black text-gray-900 leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your dream<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">job starts</span><br />
              here.
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              Stop losing track of applications in spreadsheets. Let AI do the heavy lifting while you focus on acing interviews.
            </p>
          </motion.div>

          {/* How it works steps */}
          <motion.div
            className="mt-10 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">How it works</p>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.6 }}
              >
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-base shadow-sm group-hover:border-violet-300 group-hover:shadow-md group-hover:shadow-violet-100 transition-all duration-300">
                  {step.icon}
                </div>
                <span className="text-gray-600 text-sm font-medium">{step.text}</span>
                <div className="ml-auto w-5 h-5 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
                  <svg className="w-3 h-3 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom security badge */}
        <motion.div
          className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Secure & private</p>
            <p className="text-xs text-gray-400">JWT auth · bcrypt · no data sharing</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right: Register card */}
      <div className="relative z-10 w-full flex items-center justify-center lg:justify-end lg:pr-24 px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1000 }}
        >
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-2xl shadow-gray-200/60 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>JobTrack<span className="text-violet-600">AI</span></span>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Create your account</h2>
              <p className="text-gray-400 text-sm mb-7">Start tracking smarter in 30 seconds</p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className={`relative rounded-xl border-2 transition-all duration-200 ${focused === 'name' ? 'border-violet-500 shadow-lg shadow-violet-500/10' : 'border-gray-200'} bg-gray-50/50`}>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    placeholder="Alex Johnson"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-300 text-sm focus:outline-none rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.36 }}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <div className={`relative rounded-xl border-2 transition-all duration-200 ${focused === 'email' ? 'border-violet-500 shadow-lg shadow-violet-500/10' : 'border-gray-200'} bg-gray-50/50`}>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-300 text-sm focus:outline-none rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.44 }}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <div className={`relative rounded-xl border-2 transition-all duration-200 ${focused === 'password' ? 'border-violet-500 shadow-lg shadow-violet-500/10' : 'border-gray-200'} bg-gray-50/50`}>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="Min 8 characters"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-300 text-sm focus:outline-none rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200 disabled:opacity-60 relative overflow-hidden"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create Free Account
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              </motion.div>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                Sign in →
              </a>
            </p>
          </div>

          <motion.div
            className="flex items-center justify-center gap-2 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-xs text-gray-400">🔒 No credit card · Free forever</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}