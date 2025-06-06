import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FileListItem = ({ file, onClick, onDelete, formatFileSize }) => {
    const statusClasses = {
        completed: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
        uploading: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
        failed: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-surface-800 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-card transition-all duration-200 cursor-pointer"
            onClick={() => onClick(file)}
        >
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center justify-center">
                    <ApperIcon name="File" size={20} className="text-surface-400" />
                </div>
                <div>
                    <h4 className="font-medium text-surface-900 dark:text-white">
                        {file.name || 'Untitled'}
                    </h4>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        {formatFileSize(file.size || 0)} • {file.type || 'Unknown type'}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[file.status] || 'bg-surface-100 dark:bg-surface-700 text-surface-500'}`}>
                    {file.status || 'unknown'}
                </span>
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file.id);
                    }}
                    className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                >
                    <ApperIcon name="Trash2" size={16} />
                </Button>
            </div>
        </motion.div>
    );
};

export default FileListItem;