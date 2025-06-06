import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
    return (
        <div className="flex items-center bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
            <Button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-surface-600 text-primary shadow-sm' 
                      : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
            >
                <ApperIcon name="Grid3x3" size={16} />
            </Button>
            <Button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-surface-600 text-primary shadow-sm' 
                      : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
            >
                <ApperIcon name="List" size={16} />
            </Button>
        </div>
    );
};

export default ViewModeToggle;