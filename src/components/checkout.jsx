import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Swal from 'sweetalert2'; // Import SweetAlert2

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/v1/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
          setCartItems(response.data.cartItems);
        } else {
          throw new Error(response.data.message || 'Failed to fetch cart items');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        totalAmount: totalPrice,
        orderStatus: 'Pending',
        shippingAddress: userInfo.address,
        billingAddress: userInfo.address,  // You can modify this for separate billing/shipping addresses
      };

      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('/api/v1/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // SweetAlert for Success
        Swal.fire({
          title: 'Success!',
          text: 'Order placed successfully!',
          icon: 'success',
          confirmButtonText: 'Go to Order Summary',
        }).then(() => {
          navigate('/order-summary');  // Redirect to the order summary page
        });
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // SweetAlert for Failure
      Swal.fire({
        title: 'Error!',
        text: 'Failed to place order.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 pt-16">Checkout</h1>

        {/* Cart Items */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl">{item.product.name}</h3>
                    <p className="text-gray-400">x{item.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg">${item.product.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Your Information</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
            <form onSubmit={handleCheckout}>
              <div className="mb-4">
                <label className="block text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Address</label>
                <textarea
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={userInfo.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="creditCard">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bankTransfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <div className="mt-4">
            <p className="text-lg">
              <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
