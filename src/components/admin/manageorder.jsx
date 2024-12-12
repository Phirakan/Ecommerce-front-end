import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');

  // ดึงข้อมูลคำสั่งซื้อจาก Order API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/orders'); // ดึงข้อมูลคำสั่งซื้อจาก API
        setOrders(response.data.data); // กำหนดคำสั่งซื้อที่ได้จาก API
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async () => {
    if (selectedOrder && status) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.put(
          `/api/v1/orders/${selectedOrder.id}`, // อัพเดตคำสั่งซื้อจาก ID
          {
            orderStatus: status,
            trackingNumber,
            courierName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Order status updated successfully!');
        setTrackingNumber('');
        setCourierName('');
        setStatus('');
        setSelectedOrder(null);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 pt-16">Manage Order Status</h1>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
          <h2 className="text-2xl font-semibold mb-4">Select an Order</h2>
          <select
            onChange={(e) => {
              const order = orders.find(
                (order) => order.id === parseInt(e.target.value)
              );
              setSelectedOrder(order);
              setStatus(order?.orderStatus || ''); // กำหนดสถานะปัจจุบัน
            }}
            className="bg-gray-700 text-white p-2 rounded-lg mb-4 w-full"
          >
            <option value="">-- Select Order --</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                Order #{order.id} - {order.orderStatus}
              </option>
            ))}
          </select>

          {selectedOrder && (
            <>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">
                  Current Status: {selectedOrder.orderStatus}
                </h3>
                <label className="block mt-4">Update Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded-lg w-full"
                >
                <option value="pending">กำลังรอชำระ</option>
                <option value="processing">กำลังเตรียมจัดส่ง</option>
                <option value="shipped">กำลังจัดส่ง</option>
                <option value="delivered">พัสดุจัดส่งสำเร็จ</option>

                </select>
              </div>

              {status === 'shipped' && (
                <div className="mb-4">
                  <label className="block mt-4">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-lg w-full"
                    placeholder="Enter tracking number"
                  />
                  <label className="block mt-4">Courier Name</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-lg w-full"
                    placeholder="Enter courier name"
                  />
                </div>
              )}

              <button
                onClick={handleStatusChange}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
              >
                Update Order Status
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
