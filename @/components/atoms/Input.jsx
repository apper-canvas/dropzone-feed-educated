import React, { forwardRef } from 'react';

const Input = forwardRef(({ type = 'text', className, ...props }, ref) => {
    return (
        <input
            type={type}
            className={className}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;