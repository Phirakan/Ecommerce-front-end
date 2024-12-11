import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true); // เพิ่ม loading state
  const [error, setError] = useState(null); // เพิ่ม error state
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // navigate('/login');// ถ้าไม่มี user ให้ redirect ไปหน้า login
      console.log("No user data found"); 
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      setUserName(user.fullName);
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.removeItem('user'); // ลบข้อมูลที่ไม่ถูกต้อง
      navigate('api/v1/login');
    }
  }, [navigate]);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // เช็คทั้ง sessionStorage และ localStorage
      const token = sessionStorage.getItem('token')
      
      // ดีบัก token
      console.log('Using token:', token);

      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await axios.get('/api/v1/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      console.log('Cart response:', response.data); // ดีบัก response
  
      if (response.data.success) {
        setCartItems(response.data.cartItems);
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart items');
      }
  
    } catch (err) {
      console.error('Cart error:', err); // ดีบัก error
      setError(err.message);
      if (err.response?.status === 401) {
        // sessionStorage.removeItem('token');
        localStorage.removeItem('token');
        navigate('/api/v1/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [navigate]);

  const removeItem = async (id) => {
    try {
      const token = sessionStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await axios.delete(`/api/v1/cart/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      if (response.data.success) {
        await fetchCart();
      } else {
        throw new Error(response.data.message || 'Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('token');
        navigate('/api/v1/login');
      }
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const goToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 pt-16">{userName} Cart</h1>
        
        {userName && (
          <p className="text-center text-gray-400 mb-4">Welcome, {userName}!</p>
        )}

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-700">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-4 border-b border-gray-700">Product</th>
                    <th className="p-4 border-b border-gray-700">Price</th>
                    <th className="p-4 border-b border-gray-700">Quantity</th>
                    <th className="p-4 border-b border-gray-700">Subtotal</th>
                    <th className="p-4 border-b border-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="bg-gray-800">
                      <td className="p-4 border-b border-gray-700">{item.product?.name}</td>
                      <td className="p-4 border-b border-gray-700">${item.product?.price}</td>
                      <td className="p-4 border-b border-gray-700">{item.quantity}</td>
                      <td className="p-4 border-b border-gray-700">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-4 border-b border-gray-700">
                        <button
                          className="bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded-md"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</p>
              <button
                onClick={goToCheckout}
                className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;