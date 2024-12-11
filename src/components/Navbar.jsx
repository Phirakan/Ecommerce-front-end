import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'; // นำเข้า Menu จาก headlessui
import axios from 'axios';

function Navbar() {
  const [cartCount, setCartCount] = useState(0); // state สำหรับจำนวนสินค้าในตะกร้า

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          return;
        }

        const response = await axios.get('/api/v1/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (response.data.success) {
          const totalItems = response.data.cartItems.reduce(
            (total, item) => total + item.quantity,
            0
          );
          setCartCount(totalItems); // อัปเดตจำนวนสินค้าทั้งหมดในตะกร้า
        } else {
          console.error('Failed to fetch cart count:', response.data.message);
        }
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };

    fetchCartCount();
  }, []); // ดึงข้อมูลเมื่อโหลด Navbar ครั้งแรก

  return (
    <nav className="bg-black bg-opacity-90 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-3xl font-bold">
          <Link to="/">RazeCars</Link>
        </div>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/products"
            className="text-white font-semibold text-xl hover:text-green-500 transition duration-200"
          >
            Products
          </Link>
          <Link
            to="/about"
            className="text-white font-semibold text-xl hover:text-green-500 transition duration-200"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-white font-semibold text-xl hover:text-green-500 transition duration-200"
          >
            Contact
          </Link>
        </div>

        {/* Profile Dropdown instead of Login */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Profile Dropdown */}
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt="User Avatar"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="h-10 w-10 rounded-full"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none"
            >
              <MenuItem>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
              </MenuItem>
              <MenuItem>
                <a
                  href=""
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <img
              src="../../src/assets/cart.png"
              alt="Cart"
              className="h-8 w-8 text-white"
            />
            {/* จำนวนสินค้าบน Cart */}
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
