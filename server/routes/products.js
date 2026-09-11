// Creating a product
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

// Retrieving a product
router.get('/', verifyToken, async (req, res) => {
  const { search } = req.query;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    let query = 'SELECT * FROM Products';
    if (search) {
      request.input('search', sql.NVarChar, `%${search}%`);
      query += ' WHERE Name LIKE @search OR SKU LIKE @search';
    }
    query += ' ORDER BY UpdatedAt DESC';
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Products WHERE Id = @id');
    if (!result.recordset[0]) return res.status(404).json({ message: 'Not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Updating a product
router.put('/:id', verifyToken, async (req, res) => {
  const { sku, name, category, quantity, reorderLevel, unitPrice } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('sku', sql.NVarChar, sku)
      .input('name', sql.NVarChar, name)
      .input('category', sql.NVarChar, category)
      .input('quantity', sql.Int, quantity)
      .input('reorderLevel', sql.Int, reorderLevel)
      .input('unitPrice', sql.Decimal(10, 2), unitPrice)
      .query(`UPDATE Products SET SKU=@sku, Name=@name, Category=@category,
              Quantity=@quantity, ReorderLevel=@reorderLevel, UnitPrice=@unitPrice,
              UpdatedAt=SYSUTCDATETIME()
              OUTPUT INSERTED.*
              WHERE Id=@id`);
    if (!result.recordset[0]) return res.status(404).json({ message: 'Not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;