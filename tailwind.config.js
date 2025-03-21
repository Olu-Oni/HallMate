/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "550px",
        md: "850px",
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  
};
