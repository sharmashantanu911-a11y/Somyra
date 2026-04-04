import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 bg-[#0D0D0D] rounded-3xl border border-white/5">
          <div className="w-16 h-16 bg-teal-accent/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-teal-accent" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Something went wrong loading this page</h2>
            <p className="text-sm text-muted">Please refresh and try again</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-teal-accent text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
