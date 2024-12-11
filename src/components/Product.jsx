import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartQuantity, setCartQuantity] = useState({});  // เก็บจำนวนสินค้าแต่ละตัว

  useEffect(() => {
    // ดึงข้อมูลสินค้าจาก API
    axios
      .get("/api/v1/products")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Unable to fetch products.");
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันสำหรับการเพิ่มจำนวนสินค้า
  const handleQuantityChange = (productId, change) => {
    setCartQuantity(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);  // ป้องกันการลดเหลือ 0 หรือลบลบ
      return { ...prev, [productId]: newQuantity };
    });
  };

  // ฟังก์ชันสำหรับเพิ่มสินค้าลงในตะกร้า
  const addToCart = async (productId) => {
    const quantity = cartQuantity[productId] || 1;  // กำหนดจำนวน 1 หากยังไม่ได้เลือก
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.post(
        "/api/v1/cart",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Product added to cart successfully.");
      } else {
        throw new Error(response.data.message || "Failed to add product to cart.");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-16">
      <Helmet>
        <title>Products - My Website</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-400 text-sm mt-2">{product.description}</p>
                <p className="text-green-500 font-semibold text-lg mt-4">
                  ${product.price}
                </p>
                
                {/* แสดงตัวเลือกจำนวนสินค้า */}
                <div className="flex items-center mt-4">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}  // ลดจำนวน
                    className="bg-gray-700 text-white p-2 rounded-l-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={cartQuantity[product.id] || 1}  // แสดงจำนวนที่เลือก
                    onChange={(e) => setCartQuantity({ ...cartQuantity, [product.id]: e.target.value })}
                    className="w-16 text-center bg-gray-700 text-white"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}  // เพิ่มจำนวน
                    className="bg-gray-700 text-white p-2 rounded-r-md"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => addToCart(product.id)}  // เรียกฟังก์ชันเมื่อคลิกปุ่ม
                  className="bg-green-700 hover:bg-green-600 text-white w-full mt-4 py-2 rounded-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
