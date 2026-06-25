const fs = require("fs");

const transactions = `
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const protect = require("../middleware/protect");

router.get("/", protect, async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) query.type = type;
    const transactions = await Transaction.find(query)
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .limit(100);
    const totalSales = transactions.filter(t => t.type === "sale").reduce((s, t) => s + t.total, 0);
    const totalPurchases = transactions.filter(t => t.type === "purchase").reduce((s, t) => s + t.total, 0);
    res.json({ success: true, transactions, totalSales, totalPurchases, profit: totalSales - totalPurchases });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { type, product, quantity, price, party, note } = req.body;
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    if (type === "sale" && prod.quantity < quantity)
      return res.status(400).json({ message: "Insufficient stock. Available: " + prod.quantity });
    const total = quantity * price;
    const transaction = await Transaction.create({ type, product, quantity, price, total, party, note, createdBy: req.user._id });
    if (type === "purchase") {
      await Product.findByIdAndUpdate(product, { $inc: { quantity: quantity } });
    } else {
      await Product.findByIdAndUpdate(product, { $inc: { quantity: -quantity } });
    }
    await transaction.populate("product", "name sku");
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Not found" });
    if (transaction.type === "purchase") {
      await Product.findByIdAndUpdate(transaction.product, { $inc: { quantity: -transaction.quantity } });
    } else {
      await Product.findByIdAndUpdate(transaction.product, { $inc: { quantity: transaction.quantity } });
    }
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
`;

fs.writeFileSync("routes/transactions.js", transactions);
console.log("transactions.js created successfully!");