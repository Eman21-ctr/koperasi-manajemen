/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Memindai semua file di dalam src
  ],
  theme: {
    extend: {
      // Menambahkan warna tema seperti di file HTML lama Anda
      colors: {
        primary: '#DC2626', // red-600
        secondary: '#F3F4F6', // gray-100
      }
    },
  },
  plugins: [],
}