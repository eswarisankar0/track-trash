const db = require("../config/db");

// Assign bin to collector (ADMIN)
exports.assignBin = (req, res) => {
  const { bin_id, collector_id } = req.body;

  if (!bin_id || !collector_id) {
    return res.status(400).json({ 
      message: "bin_id and collector_id required" 
    });
  }

  // Validate collector from users table
  db.query(
    "SELECT id FROM users WHERE id = ? AND role = 'collector'",
    [collector_id],
    (err, users) => {
      if (err) {
        console.error("Collector validation error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (users.length === 0) {
        return res.status(400).json({
          message: "Invalid collector. User is not a collector."
        });
      }

      // Assign bin
      db.query(
        "INSERT INTO collections (bin_id, collector_id, status) VALUES (?, ?, 'pending')",
        [bin_id, collector_id],
        (err2) => {
          if (err2) {
            console.error("Assignment error:", err2);
            return res.status(500).json({ error: err2.message });
          }

          res.json({ message: "Bin assigned to collector" });
        }
      );
    }
  );
};

// View all collections (ADMIN)
exports.getAllCollections = (req, res) => {
  db.query("SELECT * FROM collections ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// View my collections (COLLECTOR - from token)
exports.getMyCollections = (req, res) => {
  const collectorId = req.user.id; // from JWT

  db.query(
    "SELECT * FROM collections WHERE collector_id = ? AND status = 'pending'",
    [collectorId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Mark collection complete
exports.completeCollection = (req, res) => {
  const { id } = req.params;

  // 1. Get bin_id first
  db.query(
    "SELECT bin_id FROM collections WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Collection not found" });
      }

      const bin_id = rows[0].bin_id;

      // 2. Mark collection as collected
      db.query(
        "UPDATE collections SET status='collected', collected_at=NOW() WHERE id=?",
        [id],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          // 3. Reset bin
          db.query(
            "UPDATE bins SET current_fill=0, status='empty' WHERE id=?",
            [bin_id],
            (err3) => {
              if (err3) return res.status(500).json(err3);

              res.json({
                message: "Collection completed and bin reset"
              });
            }
          );
        }
      );
    }
  );
};
