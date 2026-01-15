const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { Sequelize, DataTypes } = require("sequelize");

dotenv.config();
const app = express();

// --- 1. KONEKSI DATABASE ---
const db = new Sequelize('perpustakaandb_paw', 'root', 'SandiMySQL24', {
    host: '127.0.0.1',
    port: 3307,
    dialect: 'mysql'
});

// --- 2. MIDDLEWARE ---
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// --- 3. MODEL USER ---
const User = db.define("users", {
  uuid: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, validate: { notEmpty: true } },
  name: { type: DataTypes.STRING, allowNull: false },
  nim: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "member" }
}, { freezeTableName: true });

// --- 4. MODEL BUKU (BARU!) ---
const Book = db.define("books", {
    uuid: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, validate: { notEmpty: true } },
    judul: { type: DataTypes.STRING, allowNull: false },
    penulis: { type: DataTypes.STRING, allowNull: false },
    penerbit: { type: DataTypes.STRING, allowNull: false },
    tahun: { type: DataTypes.INTEGER, allowNull: false },
    stok: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    kategori: { type: DataTypes.STRING, allowNull: false } // Fiksi, Sains, dll
}, { freezeTableName: true });

// ==========================================
//              ROUTE API
// ==========================================

// A. AUTH (Login & Register)
app.post('/api/auth/register', async (req, res) => {
    /* ... (Kode Register User sama seperti sebelumnya) ... */
    // Biar hemat tempat, logika register admin/user pakai yg tadi ya. 
    // Tapi kalau mau copy-paste full biar aman, kode register ada di langkah sebelumnya.
    // Disini saya persingkat agar fokus ke Buku.
    const { name, nim, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        await User.create({ name, nim, email, password: hashPassword, role: "member" });
        res.status(201).json({msg: "Register Berhasil!"});
    } catch (error) { res.status(500).json({msg: "Error Server"}); }
});

app.post('/api/auth/login', async (req, res) => {
    /* ... (Kode Login sama seperti sebelumnya) ... */
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if(!user) return res.status(404).json({msg: "Email tidak ditemukan"});
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg: "Password Salah!"});
        res.status(200).json({ msg: "Login Berhasil", user: { name: user.name, role: user.role } });
    } catch (error) { res.status(500).json({msg: "Error Server"}); }
});

// B. KELOLA BUKU (CRUD ADMIN)
// 1. Ambil Semua Buku
app.get('/api/books', async (req, res) => {
    try {
        const response = await Book.findAll();
        res.status(200).json(response);
    } catch (error) { res.status(500).json({msg: error.message}); }
});

// 2. Tambah Buku
app.post('/api/books', async (req, res) => {
    try {
        await Book.create(req.body);
        res.status(201).json({msg: "Buku Berhasil Ditambahkan!"});
    } catch (error) { res.status(500).json({msg: error.message}); }
});

// 3. Hapus Buku
app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.destroy({ where: { uuid: req.params.id } });
        res.status(200).json({msg: "Buku Dihapus"});
    } catch (error) { res.status(500).json({msg: error.message}); }
});

// --- JALANKAN SERVER ---
const PORT = 5000;
db.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
});