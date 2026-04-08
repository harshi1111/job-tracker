import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '../services/auth.service';

export default function Login() {
  const navigate = useNavigate();
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
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const floatingOrbs = [
    { size: 320, x: -80, y: -80, color: 'from-violet-200/40 to-indigo-200/30', delay: 0 },
    { size: 240, x: '70%', y: '60%', color: 'from-sky-200/30 to-cyan-100/20', delay: 1.5 },
    { size: 180, x: '80%', y: -40, color: 'from-rose-200/25 to-pink-100/20', delay: 0.8 },
    { size: 140, x: '10%', y: '75%', color: 'from-amber-200/20 to-yellow-100/15', delay: 2 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center overflow-hidden relative font-sans">

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Animated orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`fixed rounded-full bg-gradient-radial ${orb.color} blur-3xl pointer-events-none`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 8 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}

      {/* Grid lines */}
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

      {/* Decorative left panel */}
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

        {/* Big cinematic headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] text-violet-500 uppercase mb-4">Your Career Command Center</p>
            <h1 className="text-5xl font-black text-gray-900 leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Every<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">application</span><br />
              tracked.
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              AI parses job descriptions in seconds. Your Kanban board stays organized. You focus on landing the offer.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex gap-8 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
          >
            {[['500+', 'Jobs tracked'], ['95%', 'AI accuracy'], ['100%', 'Free forever']].map(([val, label], i) => (
              <div key={i}>
                <div className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{val}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom testimonial */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            ))}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed italic">"The AI parsing saved me hours. I went from chaos to 3 interviews in two weeks."</p>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">S</div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Sarah Chen</p>
              <p className="text-xs text-gray-400">Software Engineer @ Vercel</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right: Login Card */}
      <div className="relative z-10 w-full flex items-center justify-center lg:justify-end lg:pr-24 px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1000 }}
        >
          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-2xl shadow-gray-200/60 p-8 relative overflow-hidden">

            {/* Card inner glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>JobTrack<span className="text-violet-600">AI</span></span>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Welcome back</h2>
              <p className="text-gray-400 text-sm mb-7">Sign in to continue your job search journey</p>
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
              {/* Email field */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
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

              {/* Password field */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.38 }}>
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
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-300 text-sm focus:outline-none rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}>
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
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                  {/* shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="/register" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                Create one free →
              </a>
            </p>
          </div>

          {/* Floating badge below card */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400">Secure JWT authentication</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}