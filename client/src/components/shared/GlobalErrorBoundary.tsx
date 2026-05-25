"use client";

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * GlobalErrorBoundary
 * Catches any runtime errors in child components and shows a recovery UI
 * instead of a blank screen. Wrap page-level or layout components with this.
 *
 * Usage:
 *   <GlobalErrorBoundary>
 *     <YourComponent />
 *   </GlobalErrorBoundary>
 */
export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[GlobalErrorBoundary] Caught error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] p-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
              <p className="text-gray-400 text-sm">
                An unexpected error occurred. This has been logged and our team has been notified.
              </p>
              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 font-mono">
                    Developer Details ▶
                  </summary>
                  <pre className="mt-2 p-4 bg-white/5 rounded-xl text-red-400 text-xs overflow-auto max-h-40 border border-red-500/20 whitespace-pre-wrap">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm border border-white/10"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
