import { OrderDTO } from '../dtos/order.dto.js';

export const getOrders = async (userId) => {
  const orders = await findOrdersByUser(userId);
  return orders.map(order => new OrderDTO(order));
};

export const getOrderDetails = async (orderId) => {
  const order = await findOrderById(orderId);
  const items = await findOrderItems(orderId);
  return new OrderDTO({ ...order, items });
};