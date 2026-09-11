const express = require('express');
const { sql, poolPromise } = require('../db');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/summary', verifyToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const totals = await pool.request().query(`
      SELECT
        COUNT(*) AS totalItems,
        SUM(Quantity) AS totalUnits,
        SUM(Quantity * UnitPrice) AS totalValue,
        SUM(CASE WHEN Quantity <= ReorderLevel THEN 1 ELSE 0 END) AS lowStockCount
      FROM Products`);

    const byCategory = await pool.request().query(`
      SELECT Category, COUNT(*) AS items, SUM(Quantity) AS units
      FROM Products
      GROUP BY Category`);

    res.json({ ...totals.recordset[0], byCategory: byCategory.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;