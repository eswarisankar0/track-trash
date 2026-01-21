require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const binRoutes = require("./routes/binRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const alertRoutes = require("./routes/alertRoutes");
const collectionRoutes = require("./routes/collectionRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/sensor", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/collections", collectionRoutes);



app.get("/", (req, res) => {
  res.send("Track Trash Backend is running ");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
