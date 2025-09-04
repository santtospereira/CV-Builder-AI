import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-red-50 text-red-700">
          <h1 className="text-2xl font-bold">Algo deu errado.</h1>
          <p>Por favor, atualize a página e tente novamente.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
