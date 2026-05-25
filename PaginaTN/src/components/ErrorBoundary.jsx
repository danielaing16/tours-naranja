import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary-fallback">
          <h1>Algo falló al cargar la página</h1>
          <pre>{this.state.error.message}</pre>
          <p className="hint">Recarga con Ctrl+F5. Si sigue, reinicia: en PaginaTN ejecuta npm run dev</p>
        </div>
      );
    }
    return this.props.children;
  }
}
