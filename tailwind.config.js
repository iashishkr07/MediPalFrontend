/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "420px",
        sm_custom: "540px",
      },
      colors: {
        primary: "#4F46E5", // Indigo 600
        secondary: "#F59E42", // Orange 400
        accent: "#10B981", // Emerald 500
        background: "#F3F4F6", // Gray 100
        surface: "#FFFFFF", // White
        error: "#EF4444", // Red 500
        text: "#1F2937", // Gray 800
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill,minmax(200px,1fr)) ",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
