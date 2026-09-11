const express = require('express');
const { sql, poolPromise } = require('../db');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const { sku, name, category, quantity, reorderLevel, unitPrice } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('sku', sql.NVarChar, sku)
      .input('name', sql.NVarChar, name)
      .input('category', sql.NVarChar, category)
      .input('quantity', sql.Int, quantity)
      .input('reorderLevel', sql.Int, reorderLevel)
      .input('unitPrice', sql.Decimal(10, 2), unitPrice)
      .query(`INSERT INTO Products (SKU, Name, Category, Quantity, ReorderLevel, UnitPrice)
              OUTPUT INSERTED.*
              VALUES (@sku, @name, @category, @quantity, @reorderLevel, @unitPrice)`);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;