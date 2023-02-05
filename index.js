const express = require("express");
const port = 3000;
const app = express();

require("./db");
require("./Model/User");
//
const authRoutes = require("./Route/AuthRoute");
const requireToken = require("./Middleware/AuthToken");

app.use(express.json());
app.use(authRoutes);

app.get("/", requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
