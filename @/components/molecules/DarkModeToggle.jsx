import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DarkModeToggle = ({ darkMode, onToggle }) => {
    return (
        <Button
            onClick={onToggle}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
        >
            <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={18} />
        </Button>
    );
};

export default DarkModeToggle;