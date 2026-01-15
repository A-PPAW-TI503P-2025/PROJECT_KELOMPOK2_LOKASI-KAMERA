const express = require("express");
const app = express();
const sequelize = require('./config/db'); // pakai ini saja

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected & synced');
  })
  .catch((err) => {
    console.error('Database error:', err);
  });

app.use(express.json());

// Routes
app.use("/books", require("./routes/books"));
app.use("/loan", require("./routes/loan"));
app.use("/transaction", require("./routes/borrow"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
  console.log(`Server running at: http://localhost:3000`);
});

app.get('/', (req, res) => {
  res.send('Selamat datang di server Perpustakaan!');
});
