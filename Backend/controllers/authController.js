const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // REGISTER
  async register(req, res) {
    try {
      const { nama, email, password, nim } = req.body; // Sesuaikan inputanmu

      const [rows] = await db.execute("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      if (rows.length > 0)
        return res.status(400).json({ message: "Email sudah dipakai!" });

      const hashed = await bcrypt.hash(password, 10);

      await db.execute(
        "INSERT INTO Users (nama, email, password, nim, role) VALUES (?, ?, ?, ?, ?)",
        [nama, email, hashed, nim, "mahasiswa"]
      );

      res.json({ message: "Registrasi berhasil" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const [users] = await db.execute("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      const user = users[0];

      if (!user)
        return res.status(400).json({ message: "Email tidak ditemukan" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Password salah" });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        "SECRET_KEY_GANTI",
        { expiresIn: "1d" }
      );

      res.json({ message: "Login berhasil", token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
};