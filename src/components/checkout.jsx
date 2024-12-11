import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

function Checkout() {
  // สถานะสินค้าในตะกร้า
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Product 1',
      price: 50,
      quantity: 2,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 70,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  // สถานะข้อมูลผู้ใช้
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: '',
  });

  // คำนวณยอดรวม
  const totalPrice = cart.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // เรียกใช้งาน SweetAlert เมื่อยืนยันการสั่งซื้อ
    Swal.fire({
      title: 'Order Placed!',
      text: `Your order has been placed successfully. Total amount: $${totalPrice}`,
      icon: 'success',
      confirmButtonText: 'Okay',
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 pt-16">Checkout</h1>

        {/* แสดงรายการสินค้า */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
            {cart.map((product) => (
              <div key={product.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl">{product.name}</h3>
                    <p className="text-gray-400">x{product.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg">${product.price * product.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ข้อมูลผู้ใช้ */}
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
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-white transition duration-200"
                >
                  Back to Cart
                </Link>
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

        {/* สรุปคำสั่งซื้อ */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <div className="mt-4">
            <p className="text-lg">
              <strong>Total Price:</strong> ${totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
