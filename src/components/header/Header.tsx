import { memo } from "react";

const Header: React.FC<{ darkMode: boolean; setDarkMode: (mode: boolean) => void; }> = memo(
    ({ darkMode, setDarkMode }) => {
      console.log("header rendered")
      return (
        <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <button onClick={() => setDarkMode(!darkMode)} className="ml-8 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
      )
    }
  )


  export default Header