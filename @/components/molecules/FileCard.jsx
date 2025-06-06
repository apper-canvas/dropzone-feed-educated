import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const FileCard = ({ file, onClick, formatFileSize }) => {
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
            className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card hover:shadow-soft transition-all duration-200 cursor-pointer group"
            onClick={() => onClick(file)}
        >
            <div className="aspect-square bg-surface-100 dark:bg-surface-700 rounded-lg mb-3 flex items-center justify-center">
                {file.type?.startsWith('image/') ? (
                    <img 
                        src={file.thumbnail || file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <ApperIcon name="File" size={32} className="text-surface-400" />
                )}
            </div>
            <h4 className="font-medium text-surface-900 dark:text-white truncate mb-1">
                {file.name || 'Untitled'}
            </h4>
            <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400">
                <span>{formatFileSize(file.size || 0)}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[file.status] || 'bg-surface-100 dark:bg-surface-700 text-surface-500'}`}>
                    {file.status || 'unknown'}
                </span>
            </div>
        </motion.div>
    );
};

export default FileCard;