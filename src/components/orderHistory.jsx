import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token'); // ดึง token จาก sessionStorage
        const response = await axios.get('/api/v1/orders-history', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);  // ดูข้อมูลที่ส่งกลับจาก API
        setOrders(response.data.data); // ตั้งค่า orders ที่ได้จาก API
      } catch (err) {
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <div>Loading order history...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 pt-16">Order History</h1>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
          {orders.map(order => (
            <div key={order.id} className="mb-6">
              <h2 className="text-2xl font-semibold">Order #{order.id}</h2>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <p><strong>Billing Address:</strong> {order.billingAddress}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

              {/* แสดงรายการสินค้าที่อยู่ในคำสั่งซื้อ */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Ordered Items</h3>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center mb-4">
                      <div>
                        {/* ตรวจสอบว่า product มีค่าหรือไม่ */}
                        {item.product ? (
                          <>
                            <h4>{item.product.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.priceAtTime}</p>
                          </>
                        ) : (
                          <p>Product information is missing.</p>  // ถ้าไม่มี product ให้แสดงข้อความนี้
                        )}
                      </div>
                      <div>
                        <p>Total: ${item.quantity * item.priceAtTime}</p>
                        
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items in this order.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
