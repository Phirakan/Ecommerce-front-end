import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import videoFile from '../../assets/car.mp4';
import Swal from 'sweetalert2'; // Import SweetAlert2

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role is 'customer'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, role }), // Include the 'role' field
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful', data);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAdmin', data.user.role === 'admin');
        localStorage.setItem('isCustomer', data.user.role === 'customer');

        // Show SweetAlert popup for successful registration
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'You have registered successfully.',
        });

        // Redirect based on user role
        if (data.user.role === 'admin') {
          navigate('/admin/manage_products');
        } else {
          navigate('/products');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>Register - My Website</title>
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
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 z-50">
        <h2 className="text-2xl font-bold text-white text-center">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-300">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-gray-300">Role</label>
            <select
              className="w-full px-4 py-2 mt-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
