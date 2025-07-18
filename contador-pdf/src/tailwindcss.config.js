/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"  
  ],
  theme: {
    extend: {
      colors: {
        principal: "#1D1E18",
        secundario: "#F4E3B8",
        acento: "#129490"
      }
    }
  },
  plugins: []
}
