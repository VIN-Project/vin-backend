const express = require("express");
const mongoose = require("mongoose");
const router = require("./router");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./model/users");  // Make sure to import the User model

const app = express();
const port = 3020;

const mongoURI = "mongodb://localhost:27017/vin-db";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/", router);

app.post('/api/signup/check', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
