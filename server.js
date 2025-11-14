const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GET all campaigns
app.get('/api/campaigns', (req, res) => {
  db.query('SELECT * FROM campaigns', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET one campaign
app.get('/api/campaigns/:id', (req, res) => {
  db.query('SELECT * FROM campaigns WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

// POST new campaign
app.post('/api/campaigns', (req, res) => {
  const { campaign_name } = req.body;
  db.query('INSERT INTO campaigns (campaign_name) VALUES (?)', [campaign_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, campaign_name });
  });
});

// PUT update campaign
app.put('/api/campaigns/:id', (req, res) => {
  const { id } = req.params;
  const { campaign_name } = req.body;

  const sql = 'UPDATE campaigns SET campaign_name = ? WHERE id = ?';
  db.query(sql, [campaign_name, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '❌ Campaign not found' });
    }

    // 👇 After updating, fetch the updated record and send it back
    const fetchSql = 'SELECT * FROM campaigns WHERE id = ?';
    db.query(fetchSql, [id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: '✅ Campaign updated successfully',
        updated: rows[0]
      });
    });
  });
});

// DELETE campaign
app.delete('/api/campaigns/:id', (req, res) => {
  db.query('DELETE FROM campaigns WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Campaign deleted' });
  });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
