import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function OrderSummary() {
  const { orderId } = useParams();  // Assuming orderId is passed as a URL param
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        setLoading(true);

        // Fetch the order details (order)
        const orderResponse = await axios.get(`/api/v1/order/${orderId}`);
        setOrder(orderResponse.data);

        // Fetch order items for the orderId
        const itemsResponse = await axios.get(`/api/v1/order-items/${orderId}`);
        setOrderItems(itemsResponse.data.data);
        
      } catch (error) {
        console.error("Error fetching order summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSummary();
  }, [orderId]);

  if (loading) {
    return <div>Loading order summary...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 pt-16">Order Summary</h1>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <p><strong>Order ID:</strong> {order.data.id}</p>
          <p><strong>Status:</strong> {order.data.status}</p>
          <p><strong>Total Amount:</strong> ${order.data.totalAmount}</p>
        </div>

        {/* Display ordered items */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Ordered Items</h3>
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <h4>{item.product.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.priceAtTime}</p>
                </div>
                <div>
                  <p>Total: ${item.quantity * item.priceAtTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
