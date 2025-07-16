const sweetModel = require('../models/sweetModel');

exports.getAll = async (req, res) => {
  const sweets = await sweetModel.getAllSweets();
  res.json(sweets);
};

exports.search = async (req, res) => {
  const sweets = await sweetModel.searchSweets(req.query);
  res.json(sweets);
};

exports.add = async (req, res) => {
  const sweet = await sweetModel.addSweet(req.body);
  res.status(201).json(sweet);
};

exports.update = async (req, res) => {
  const sweet = await sweetModel.updateSweet(req.params.id, req.body);
  res.json(sweet);
};

exports.remove = async (req, res) => {
  await sweetModel.deleteSweet(req.params.id);
  res.sendStatus(204);
};

exports.purchase = async (req, res) => {
  try {
    const sweet = await sweetModel.purchaseSweet(req.params.id, req.body.quantity);
    res.json(sweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.restock = async (req, res) => {
  const sweet = await sweetModel.restockSweet(req.params.id, req.body.quantity);
  res.json(sweet);
};
