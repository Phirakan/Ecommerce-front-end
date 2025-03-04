import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/v1/orders-history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data); // ✅ Debug API Response
        setOrders(response.data.data);
        setIsAdmin(response.data.isAdmin);
      } catch (err) {
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <div>Loading order history...</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 pt-16">Order History</h1>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
          <table className="min-w-full table-auto border-collapse">
          <thead>
  <tr className="bg-gray-700">
    <th className="py-2 px-4 border-b text-left">Order ID</th>
    {isAdmin && <th className="py-2 px-4 border-b text-left">Ordered By</th>} {/* ✅ เพิ่ม */}
    <th className="py-2 px-4 border-b text-left">Items</th>
    <th className="py-2 px-4 border-b text-left">Image</th>
    <th className="py-2 px-4 border-b text-left">Total Amount</th>
    <th className="py-2 px-4 border-b text-left">Order Date</th>
    <th className="py-2 px-4 border-b text-left">Status</th>
  </tr>
</thead>
<tbody>
  {orders.map(order => (
    <tr key={order.id} className="bg-gray-800">
      <td className="py-2 px-4 border-b">{order.id}</td>
      {isAdmin && (
        <td className="py-2 px-4 border-b">{order.user?.id || 'Unknown'}</td> 
      )}
      <td className="py-2 px-4 border-b">
        <ul>
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map(item => (
              <li key={item.id}>
                <strong>{item.product ? item.product.name : 'Unknown Product'}</strong><br />
                Quantity: {item.quantity} <br />
                Price: ${item.priceAtTime} <br />
              </li>
            ))
          ) : (
            <p>No items in this order.</p>
          )}
        </ul>
      </td>
      <td className="py-2 px-4 border-b">
        <ul>
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map(item => (
              <li key={item.id}>
                {item.product && item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </li>
            ))
          ) : (
            <p>No items in this order.</p>
          )}
        </ul>
      </td>
      <td className="py-2 px-4 border-b">${order.totalAmount}</td>
      <td className="py-2 px-4 border-b">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="py-2 px-4 border-b">{order.orderStatus}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
