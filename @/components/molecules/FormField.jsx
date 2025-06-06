import React from 'react';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const FormField = ({ value, onChange, placeholder, className, inputClassName }) => {
    return (
        <div className={`relative ${className}`}>
            <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`pl-10 pr-4 py-2 w-64 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${inputClassName}`}
            />
        </div>
    );
};

export default FormField;