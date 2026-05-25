const Partner = require('../models/Partner');
const { sendServerError } = require('../utils/http');

exports.getNearbyPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ active: true });
    res.json(partners);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.createPartner = async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (err) {
    return sendServerError(res, err);
  }
};
