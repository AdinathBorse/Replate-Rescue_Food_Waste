import React, { useState } from 'react'
import './Order.css'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from "axios"
import { assets } from '../../../../food-app/src/assets/assets';

const Order = ({ url, token }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list", { headers: { token } })
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);

    }
    else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event,orderId) => {
    const response = await axios.post(url + "/api/order/status", { orderId, status: event.target.value }, { headers: { token } })
    if (response.data.success) {
      await fetchAllOrders();
    }
    
  }

  useEffect(() => {
    fetchAllOrders();
  },[])
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 && <p>No orders found</p>}
        {orders.map((order, index) => {
          return (
            <div key={order._id || index} className='order-item'>
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, idx) => {
                    if (idx === order.items.length - 1) {
                      return item.name + " x " + item.quantity
                    }
                    else {
                      return item.name + " x " + item.quantity + ", "
                    }
                  })}
                </p>
                <p className='order-item-name'>{order.address.firstName+" "+order.address.lastName}</p>
                <div className="order-item-address">
                  <p>{order.address.street+","}</p>
                  <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>₹{order.amount}</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status || 'Food Processing'}>
                <option value="Food Processing">Food Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Order
