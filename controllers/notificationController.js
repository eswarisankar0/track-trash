const db = require("../config/db");


// ==============================
// Get My Notifications
// ==============================
exports.getMyNotifications = (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT * FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};


// ==============================
// Mark Notification as Read
// ==============================
exports.markAsRead = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  db.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = ? AND user_id = ?`,
    [id, user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Notification not found"
        });
      }

      res.json({ message: "Notification marked as read" });
    }
  );
};


// ==============================
// Delete Notification
// ==============================
exports.deleteNotification = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  db.query(
    `DELETE FROM notifications
     WHERE id = ? AND user_id = ?`,
    [id, user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Notification not found"
        });
      }

      res.json({ message: "Notification deleted" });
    }
  );
};
