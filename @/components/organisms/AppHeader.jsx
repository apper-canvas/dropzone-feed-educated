import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import ViewModeToggle from '@/components/molecules/ViewModeToggle';
import DarkModeToggle from '@/components/molecules/DarkModeToggle';

const AppHeader = ({ searchTerm, onSearchChange, viewMode, onViewModeChange, darkMode, onDarkModeToggle }) => {
    return (
        <header className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <ApperIcon name="Upload" size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-heading font-semibold text-surface-900 dark:text-white">
                            DropZone
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative hidden sm:block">
                            <FormField 
                                placeholder="Search files..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>

                        {/* View Toggle */}
                        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

                        {/* Dark Mode Toggle */}
                        <DarkModeToggle darkMode={darkMode} onToggle={onDarkModeToggle} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;