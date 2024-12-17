import React from "react";

import "./error-boundary.styles.scss";
import ErrorImage from "../../assets/error.png"

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false,
    };
  }

  static getDerivedStateFromError(error) {
    // process the error
    return { hasErrored: true };
  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  render() {
    if (this.state.hasErrored) {
      return (
        <div className="error-image-overlay">
          <div
            className="error-image-container"
            style={{ backgroundImage: `url(${ErrorImage})` }}
          ></div>
          <h2 className="error-image-text">Something went wrong!</h2>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
