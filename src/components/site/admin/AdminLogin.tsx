"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      onLogin();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#891816]">
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#891816] via-[#6d1311] to-[#3d0a08]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Product images grid */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          <div className="grid grid-cols-3 gap-6 rotate-[-8deg] scale-125">
            {[
              "/brand/products/green-curry1.png",
              "/brand/products/ghee-roast1.png",
              "/brand/products/red-curry1.png",
              "/brand/products/fish-curry1.png",
              "/brand/products/chicken-sukka-masala1.png",
              "/brand/products/palli-curry1.png",
            ].map((src, i) => (
              <div key={i} className="w-32 h-40 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Top */}
          <div>
            <img src="/brand/easymom-logo.png" alt="EasyMom" className="h-14 brightness-0 invert" />
          </div>

          {/* Center */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <ShieldCheck className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/90 tracking-wide uppercase">Secure Admin Access</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight">
              Manage your<br />store with ease
            </h1>
            <p className="mt-4 text-base text-white/70 leading-relaxed max-w-sm">
              Track orders, update inventory, and keep your kitchen running — all from one place.
            </p>
          </div>

          {/* Bottom */}
          <div className="flex items-center gap-3 text-white/40 text-sm">
            <div className="h-px flex-1 bg-white/15" />
            <span>EasyMom Foods</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <img src="/brand/easymom-logo.png" alt="EasyMom" className="h-12 mx-auto mb-3" />
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-stone-500 mt-1.5">Sign in to your admin dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-start gap-2.5">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-stone-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-stone-200 bg-stone-50/50 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/15 focus:border-[#891816]/40 focus:bg-white transition-all"
                placeholder="Enter username"
                autoFocus
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-stone-200 bg-stone-50/50 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/15 focus:border-[#891816]/40 focus:bg-white transition-all"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full h-12 flex items-center justify-center gap-2 bg-[#891816] text-white text-[15px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <p className="text-center text-[13px] text-stone-400">
              Protected admin area.{' '}
              <a href="/" className="text-[#891816] font-medium hover:underline">
                Back to store →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
