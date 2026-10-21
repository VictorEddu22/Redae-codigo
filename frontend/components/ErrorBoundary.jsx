import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page">
          <div className="container error-state surface">
            <span className="eyebrow">Algo saiu do esperado</span>
            <h1>Nao foi possivel carregar esta tela.</h1>
            <p>Atualize a pagina. Se o problema continuar, verifique se o backend esta em execucao.</p>
            <button className="button button--primary" type="button" onClick={() => window.location.reload()}>
              Recarregar pagina
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
