import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in dev — in production this could go to a monitoring service
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          dir="rtl"
          className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-slate-950"
        >
          <div className="max-w-md rounded-[2rem] border border-gray-100 bg-white p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 text-5xl">⚠️</div>
            <h1 className="mb-3 text-2xl font-black text-blue-900 dark:text-white">
              حدث خطأ غير متوقع
            </h1>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              نعتذر عن هذا الخلل. يرجى تحديث الصفحة أو التواصل معنا إذا استمرت المشكلة.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700"
              >
                تحديث الصفحة
              </button>
              <a
                href="/"
                className="rounded-2xl border border-gray-200 bg-white px-6 py-3 font-black text-blue-900 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                العودة للرئيسية
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
