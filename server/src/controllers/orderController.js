const Order = require('../models/Order');
const { sendServerError } = require('../utils/http');

exports.createOrder = async (req, res) => {
  try {
    const { customerName, crop, quantity, pricePerQtl, deliveryLocation, deliveryDate } = req.body;
    const order = new Order({
      salesman: req.user.id,
      customerName,
      crop,
      quantity,
      pricePerQtl,
      deliveryLocation,
      deliveryDate: deliveryDate || undefined,
    });

    await order.save();
    res.status(201).json({ success: true, message: 'Order created successfully', order });
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders = [];
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('salesman', 'name').lean();
    } else if (req.user.role === 'salesman') {
      orders = await Order.find({ salesman: req.user.id }).lean();
    } else if (req.user.role === 'farmer') {
      orders = await Order.find({ 'assignedFarmers.farmer': req.user.id }).lean();
    }
    // Always return an array
    res.json(Array.isArray(orders) ? orders : []);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, rejectionReason, adminNotes } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (status) order.status = status;
    if (rejectionReason) order.rejectionReason = rejectionReason;
    if (adminNotes) order.adminNotes = adminNotes;

    order.updatedAt = Date.now();
    await order.save();

    res.json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.assignFarmers = async (req, res) => {
  try {
    const { orderId, farmerIds } = req.body;
    if (!Array.isArray(farmerIds) || farmerIds.length === 0) {
      return res.status(400).json({ success: false, message: 'farmerIds must be a non-empty array' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const newAssignments = farmerIds.map((id) => ({
      farmer: id,
      status: 'Notified',
    }));

    order.assignedFarmers = [...(order.assignedFarmers || []), ...newAssignments];
    order.status = 'Assigned';
    await order.save();

    res.json({ success: true, message: 'Farmers assigned to order', order });
  } catch (err) {
    return sendServerError(res, err);
  }
};
