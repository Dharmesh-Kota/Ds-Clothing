import React from "react";

import './with-spinner.styles.scss'

const WithSpinner = WrappedComponent => ({ isLoading, ...otherProps }) => {
    return isLoading ? (
        <div className="spinner-overlay">
            <div className="spinner-component" />
        </div>
    ) : (
        <WrappedComponent {...otherProps} />
    )
};

export default WithSpinner;