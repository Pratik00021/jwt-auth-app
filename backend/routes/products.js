const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const protect = require("../middleware/protect");

router.get("/", protect, async (req, res) => {
  try {
    const { search, category, lowStock } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (lowStock === "true") query.$expr = { $lte: ["$quantity", "$minQuantity"] };
    const products = await Product.find(query).populate("category", "name color").sort({ createdAt: -1 });
    const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minQuantity).length;
    res.json({ success: true, count: products.length, totalValue, lowStockCount, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name color");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    await product.populate("category", "name color");
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("category", "name color");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;