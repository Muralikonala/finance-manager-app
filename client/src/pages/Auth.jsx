import { useState } from 'react';
import { IndianRupee } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`https://finance-manager-api-x4hh.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        
        <div className="bg-gradient-to-b from-purple-50/50 to-transparent p-8 text-center border-b border-gray-50">
          <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-purple-200">
            <IndianRupee size={32} strokeWidth={2.5} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-purple-900 mb-1">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-gray-500">
            {isLogin ? 'Login to your automated finance system' : 'Start tracking your loans securely'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                placeholder="rajesh@example.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-lg transition-colors shadow-sm mt-2 flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'Login' : 'Sign Up'}</span>
              <span className="text-purple-300">→</span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 font-bold hover:text-purple-800 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}