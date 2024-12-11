import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import videoFile from '../../assets/car.mp4';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ตรวจสอบว่า user มีการล็อกอินอยู่แล้ว
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.fullName);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [ ]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("====================================");
      console.log(data);

        // console.log(response.ok, data.token);
      if (response) {
        // console.log("Login successful", data);
        // // setIsAuthenticated(true);
        // localStorage.setItem('user', JSON.stringify(data.user)); // เก็บข้อมูลผู้ใช้
        // localStorage.setItem('isAdmin', data.user.role === 'admin');
        // localStorage.setItem('isCustomer', data.user.role === 'customer');
        // localStorage.setItem('token', data.user.token.token);  // เก็บ token

        // บันทึกข้อมูลผู้ใช้ลง localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', data.user.token.token); // เก็บข้อมูลผู้ใช้

        // console.log(data.token);
        // Redirect based on role
        
        if (data.isAdmin) {
          navigate('/admin/manage_products');
        } else if (data.isCustomer) {
          navigate('/products');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred while logging in');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Helmet>
        <title>Login - My Website</title>
      </Helmet>
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="w-full max-w-md bg-gray-800 bg-opacity-75 rounded-lg shadow-lg p-8 z-50">
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
