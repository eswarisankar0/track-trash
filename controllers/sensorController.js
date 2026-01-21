const db = require("../config/db");

exports.updateSensorData = (req, res) => {
  const { bin_id, fill_level } = req.body;

  // Validation
  if (bin_id === undefined || fill_level === undefined) {
    return res.status(400).json({
      message: "bin_id and fill_level required"
    });
  }

  // Decide bin status
  let status = "active";
  if (fill_level >= 80) status = "full";
  else if (fill_level === 0) status = "empty";

  // 1. Insert sensor data
  db.query(
    "INSERT INTO sensor_data (bin_id, fill_level) VALUES (?, ?)",
    [bin_id, fill_level],
    (err) => {
      if (err) {
        console.error("Sensor insert error:", err);
        return res.status(500).json({ error: err.message });
      }

      // 2. Update bins table
      db.query(
        "UPDATE bins SET current_fill = ?, status = ? WHERE id = ?",
        [fill_level, status, bin_id],
        (err2) => {
          if (err2) {
            console.error("Bin update error:", err2);
            return res.status(500).json({ error: err2.message });
          }

          // 3. If bin is FULL → create alert (no duplicates)
          if (status === "full") {
            db.query(
              `SELECT id FROM alerts 
               WHERE bin_id = ? AND alert_type = 'OVERFLOW' AND status = 'active'`,
              [bin_id],
              (err3, results) => {
                if (err3) {
                  console.error("Alert check error:", err3);
                } else if (results.length === 0) {
                  db.query(
                    `INSERT INTO alerts (bin_id, alert_type, message, status)
                     VALUES (?, ?, ?, 'active')`,
                    [bin_id, "OVERFLOW", "Bin is full and needs collection"],
                    (err4) => {
                      if (err4) {
                        console.error("Alert insert error:", err4);
                      } else {
                        console.log("ALERT CREATED FOR BIN:", bin_id);
                      }
                    }
                  );
                }
              }
            );
          }

          // 4. Auto-resolve alert if bin emptied
          if (status === "empty") {
            db.query(
              `UPDATE alerts 
               SET status = 'resolved'
               WHERE bin_id = ? AND alert_type = 'OVERFLOW'`,
              [bin_id]
            );
          }

          // Final response
          res.status(200).json({
            message: "Sensor data updated successfully",
            bin_id,
            fill_level,
            status
          });
        }
      );
    }
  );
};
