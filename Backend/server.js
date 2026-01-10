const express = require("express");
const app = express();
const { sequelize } = require("./models");

app.use(express.json());

app.use("/books", require("./routes/books"));
app.use("/loan", require("./routes/loan"));

sequelize.sync();

app.listen(3000, () => console.log("Server running on port 3000"));
app.use("/auth", require("./routes/auth"));
