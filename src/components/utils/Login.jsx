import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProfile } from '../../store/profile-slice';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Import icons
import logo from '../../assets/Log.png';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Add state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/registration.json');
      const data = await response.json();

      const foundUser = Object.values(data || {}).find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        dispatch(setProfile(foundUser));
        login(JSON.stringify(foundUser));
        // navigate('/home'); // navigation will be handled by useEffect
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex rounded-md items-center justify-center px-4">
      <div className="bg-gray-800 text-white flex flex-col justify-center items-center p-8 rounded-lg shadow-lg w-full max-w-md">
        <img
          src={logo}
          alt="Logo"
          className="w-32 animate-pulse hover:animate-ping h-32 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
        />
        <div className="flex justify-center items-center space-x-2 mb-6">
          <h2 className="text-2xl font-bold">Welcome Back to</h2>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            ElectoLion
          </h1>
        </div>

        {error && <div className="text-red-400 text-center mb-2">{error}</div>}
        {loading && <div className="text-blue-400 text-center mb-2">Logging in...</div>}

        <form onSubmit={handleLogin} className="space-y-5 w-full">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-sm text-gray-400 text-center mt-2">
          Forgot Password?{' '}
          <Link to="/forgot" state={{ email }} className="text-blue-400 hover:underline">
            YES
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
