import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilePreviewModal = ({ selectedFile, showPreview, onClose, onDeleteFile, formatFileSize }) => {
    if (!selectedFile) return null;

    return (
        <AnimatePresence>
            {showPreview && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-surface-800 rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                                    {selectedFile.name}
                                </h3>
                                <p className="text-sm text-surface-500 dark:text-surface-400">
                                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={() => window.open(selectedFile.url, '_blank')}
                                    className="p-2 text-surface-600 dark:text-surface-300 hover:text-primary transition-colors"
                                >
                                    <ApperIcon name="Download" size={20} />
                                </Button>
                                <Button
                                    onClick={() => onDeleteFile(selectedFile.id)}
                                    className="p-2 text-surface-600 dark:text-surface-300 hover:text-red-500 transition-colors"
                                >
                                    <ApperIcon name="Trash2" size={20} />
                                </Button>
                                <Button
                                    onClick={onClose}
                                    className="p-2 text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-white transition-colors"
                                >
                                    <ApperIcon name="X" size={20} />
                                </Button>
                            </div>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-auto">
                            {selectedFile.type?.startsWith('image/') ? (
                                <img 
                                    src={selectedFile.url} 
                                    alt={selectedFile.name}
                                    className="w-full h-auto rounded-lg"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <ApperIcon name="File" size={64} className="text-surface-400 mb-4" />
                                    <p className="text-surface-600 dark:text-surface-300 text-center">
                                        Preview not available for this file type
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FilePreviewModal;