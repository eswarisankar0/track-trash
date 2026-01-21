const db = require("../config/db");

// Get all alerts (admin)
exports.getAllAlerts = (req, res) => {
  db.query("SELECT * FROM alerts ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get alerts for one bin
exports.getAlertsByBin = (req, res) => {
  const { binId } = req.params;

  db.query(
    "SELECT * FROM alerts WHERE bin_id = ?",
    [binId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};
