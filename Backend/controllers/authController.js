const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // REGISTER
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // cek email
      const exist = await User.findOne({ where: { email } });
      if (exist) return res.status(400).json({ message: "Email sudah dipakai!" });

      // hash password
      const hashed = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashed,
      });

      res.json({
        message: "Registrasi berhasil",
        user: newUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  },

  // LOGIN
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // cek user ada atau tidak
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(400).json({ message: "Email atau password salah" });

      // cek password
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ message: "Email atau password salah" });

      // generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        "SECRET_KEY_JANGAN_LUPA_GANTI",
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login berhasil",
        token,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  },
};
