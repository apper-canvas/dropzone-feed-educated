import React from 'react';

const Button = ({ onClick, children, className, type = 'button', disabled = false, ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;