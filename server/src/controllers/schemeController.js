const Scheme = require('../models/Scheme');
const { sendServerError } = require('../utils/http');

exports.getSchemes = async (req, res) => {
  try {
    const { category, state } = req.query;
    const query = { active: true };
    if (category) query.category = category;
    if (state) query.state = state;

    const schemes = await Scheme.find(query);
    res.json(schemes);
  } catch (err) {
    return sendServerError(res, err);
  }
};

exports.createScheme = async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (err) {
    return sendServerError(res, err);
  }
};
