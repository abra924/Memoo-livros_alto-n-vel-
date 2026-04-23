import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-container-low rounded-[2.5rem] p-10 border border-white/5 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-headline font-extrabold text-white">Algo correu mal</h1>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Ocorreu um erro inesperado na aplicação. Por favor, tenta recarregar a página.
              </p>
            </div>
            {this.state.error && (
              <div className="p-4 bg-surface-container-high rounded-2xl text-left overflow-auto max-h-32">
                <code className="text-xs text-error font-mono whitespace-pre-wrap">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-white text-surface py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
            >
              <RefreshCcw size={20} />
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
