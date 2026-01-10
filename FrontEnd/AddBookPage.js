import React, { useState } from "react";

const BookForm = () => {
  const [category, setCategory] = useState("");

  // Daftar Kategori DDC (Dewey Decimal Classification)
  const categories = [
    { code: "000", name: "Karya Umum & Komputer" },
    { code: "100", name: "Filsafat & Psikologi" },
    { code: "200", name: "Agama" },
    { code: "300", name: "Ilmu Sosial" },
    { code: "400", name: "Bahasa" },
    { code: "500", name: "Sains & Matematika" },
    { code: "600", name: "Teknologi" },
    { code: "700", name: "Kesenian & Rekreasi" },
    { code: "800", name: "Kesusastraan" },
    { code: "900", name: "Sejarah & Geografi" },
  ];

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Kategori Buku (DDC)
      </label>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
        required
      >
        <option value="">-- Pilih Kategori --</option>

        {categories.map((cat) => (
          <option key={cat.code} value={`${cat.code} - ${cat.name}`}>
            {cat.code} - {cat.name}
          </option>
        ))}
      </select>

      {/* Validasi visual simpel */}
      {!category && (
        <p className="text-red-500 text-xs italic mt-1">
          *Wajib pilih salah satu kategori.
        </p>
      )}
    </div>
  );
};

export default BookForm;
