import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-xl font-bold text-stone-900">
            Something went wrong.
          </h1>
          <p className="text-stone-600">
            Try reloading the page. If it keeps happening, some saved data may
            be corrupted.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-amber-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-amber-600"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
