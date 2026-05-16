import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Could send to logging endpoint here
    // console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07111E', color: '#fff' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>3D preview failed to load</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{this.state.error?.message || 'An unknown error occurred.'}</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
