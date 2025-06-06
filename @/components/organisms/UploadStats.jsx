import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const UploadStats = ({ files }) => {
    const totalFiles = files.length;
    const completedFiles = files.filter(f => f.status === 'completed').length;
    const totalSize = (files.reduce((sum, f) => sum + (f.size || 0), 0) / (1024 * 1024)).toFixed(1);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Files" size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-surface-900 dark:text-white">
                            {totalFiles}
                        </p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">
                            Total Files
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-surface-900 dark:text-white">
                            {completedFiles}
                        </p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">
                            Completed
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name="HardDrive" size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-surface-900 dark:text-white">
                            {totalSize}MB
                        </p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">
                            Total Size
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadStats;