"use client";

import Link from "next/link";

import { useState } from "react";

import { ArrowRight, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
export default function ForgotPassword() {
  const [isSent, setIsSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--theme-bg)]">
      <div className="glass-card p-10 max-w-md w-full space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-500 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In{" "}
        </Link>
        <div className="text-center relative z-10">
          {" "}
          {!isSent ? (
            <>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-500">
                No worries! Enter your email and we&apos;ll send you a reset
                link.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6 border border-primary/20">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-500 mb-2">
                Check your email
              </h1>
              <p className="text-gray-500">
                We&apos;ve sent a password reset link to your email address.
              </p>
            </>
          )}
        </div>{" "}
        {!isSent ? (
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-gray-500"
                />
              </div>
            </div>
            <button className="glass-button w-full py-4 text-lg flex items-center justify-center gap-2 group">
              {" "}
              Send Reset Link{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              {" "}
              Didn&apos;t receive the email?{" "}
              <button
                onClick={() => setIsSent(false)}
                className="text-primary hover:text-primary-light font-bold transition-colors"
              >
                {" "}
                Try again{" "}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
