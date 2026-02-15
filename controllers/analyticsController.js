const db = require("../config/db");


// =====================================
// 1️⃣ Collection Performance
// GET /api/analytics/collections
// =====================================
exports.getCollectionStats = (req, res) => {

  const queries = {
    completed: "SELECT COUNT(*) AS total_completed FROM collections WHERE status='collected'",
    pending: "SELECT COUNT(*) AS total_pending FROM collections WHERE status='pending'",
    avgTime: `
      SELECT AVG(TIMESTAMPDIFF(MINUTE, assigned_at, collected_at)) AS avg_collection_time
      FROM collections
      WHERE status='collected'`
  };

  db.query(queries.completed, (err1, completed) => {
    if (err1) return res.status(500).json(err1);

    db.query(queries.pending, (err2, pending) => {
      if (err2) return res.status(500).json(err2);

      db.query(queries.avgTime, (err3, avgTime) => {
        if (err3) return res.status(500).json(err3);

        res.json({
          total_completed: completed[0].total_completed,
          total_pending: pending[0].total_pending,
          average_collection_time_minutes: avgTime[0].avg_collection_time
        });
      });
    });
  });
};


// =====================================
// 2️⃣ Collector Performance
// GET /api/analytics/collector/:id
// =====================================
exports.getCollectorStats = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT COUNT(*) AS total_collected
     FROM collections
     WHERE collector_id = ? AND status='collected'`,
    [id],
    (err1, collected) => {
      if (err1) return res.status(500).json(err1);

      db.query(
        `SELECT AVG(TIMESTAMPDIFF(MINUTE, assigned_at, collected_at)) AS avg_time
         FROM collections
         WHERE collector_id = ? AND status='collected'`,
        [id],
        (err2, avgTime) => {
          if (err2) return res.status(500).json(err2);

          res.json({
            collector_id: id,
            total_collected: collected[0].total_collected,
            average_collection_time_minutes: avgTime[0].avg_time
          });
        }
      );
    }
  );
};


// =====================================
// 3️⃣ Issue Statistics
// GET /api/analytics/issues
// =====================================
exports.getIssueStats = (req, res) => {

  db.query("SELECT COUNT(*) AS total_issues FROM issues", (err1, total) => {
    if (err1) return res.status(500).json(err1);

    db.query("SELECT COUNT(*) AS open_issues FROM issues WHERE status='open'", (err2, open) => {
      if (err2) return res.status(500).json(err2);

      db.query("SELECT COUNT(*) AS resolved_issues FROM issues WHERE status='resolved'", (err3, resolved) => {
        if (err3) return res.status(500).json(err3);

        db.query(
          `SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, resolved_at)) AS avg_resolution_time
           FROM issues WHERE status='resolved'`,
          (err4, avgTime) => {
            if (err4) return res.status(500).json(err4);

            res.json({
              total_issues: total[0].total_issues,
              open_issues: open[0].open_issues,
              resolved_issues: resolved[0].resolved_issues,
              average_resolution_time_minutes: avgTime[0].avg_resolution_time
            });
          }
        );
      });
    });
  });
};


// =====================================
// 4️⃣ Bin Status Summary
// GET /api/analytics/bins
// =====================================
exports.getBinStats = (req, res) => {

  db.query("SELECT COUNT(*) AS total_bins FROM bins", (err1, total) => {
    if (err1) return res.status(500).json(err1);

    db.query("SELECT COUNT(*) AS full_bins FROM bins WHERE status='full'", (err2, full) => {
      if (err2) return res.status(500).json(err2);

      db.query("SELECT COUNT(*) AS active_bins FROM bins WHERE status='active'", (err3, active) => {
        if (err3) return res.status(500).json(err3);

        db.query("SELECT COUNT(*) AS empty_bins FROM bins WHERE status='empty'", (err4, empty) => {
          if (err4) return res.status(500).json(err4);

          res.json({
            total_bins: total[0].total_bins,
            full_bins: full[0].full_bins,
            active_bins: active[0].active_bins,
            empty_bins: empty[0].empty_bins
          });
        });
      });
    });
  });
};
