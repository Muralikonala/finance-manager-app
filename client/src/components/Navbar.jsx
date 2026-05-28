import { NavLink } from 'react-router-dom';
import { IndianRupee, LogOut } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Due Dates', path: '/due-dates' },
    { name: 'Calculator', path: '/calculator' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600 p-2 rounded-full text-white">
              <IndianRupee size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-purple-900 tracking-tight">Finance Manager</span>
          </div>

          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}