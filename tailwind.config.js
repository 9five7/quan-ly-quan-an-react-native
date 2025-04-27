// tailwind.config.js
module.exports = {
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        // Thêm customizations tại đây
        colors: {
          primary: "#3B82F6",   // blue-500
          secondary: "#10B981", // emerald-500
          danger: "#EF4444"     // red-500
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"] // Ví dụ custom font
        }
      },
    },
    plugins: [],
  }