const app = require("./app");
const fs = require("fs");
const https = require("https");
const mongoose = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const privateKey = fs.readFileSync(`${process.env.PRIVATE_KEY}`, "utf8");
const certificate = fs.readFileSync(`${process.env.CERTIFICATE}`, "utf8");
const ca = fs.readFileSync(`${process.env.CA}`, "utf8");

const env = process.env.NODE_ENV || "";

const credentials = { key: privateKey, cert: certificate, ca: ca };

// Conexión a MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000,
  })
  .then(() => {
    console.log("MongoDB connected...");
    switch (env) {
      case "production":
        https.createServer(credentials, app).listen(PORT, () => {
          console.log(`Secure server running on port ${PORT}`);
        });
        break;
      case "development":
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      break;
    }
    
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
