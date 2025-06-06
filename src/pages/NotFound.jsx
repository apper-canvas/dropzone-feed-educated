import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <div className="mb-8">
          <ApperIcon name="FileX" size={80} className="mx-auto text-surface-400 mb-4" />
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-surface-600 dark:text-surface-300 text-lg">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"
        >
          <ApperIcon name="Home" size={20} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound