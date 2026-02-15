const db = require("../config/db");

exports.createNotification = (user_id, title, message, type) => {
  db.query(
    `INSERT INTO notifications (user_id, title, message, type)
     VALUES (?, ?, ?, ?)`,
    [user_id, title, message, type],
    (err) => {
      if (err) {
        console.error("Notification insert error:", err);
      }
    }
  );
};
