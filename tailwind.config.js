import konstaConfig from "konsta/config";

/** @type {import('tailwindcss').Config} */
module.exports = konstaConfig({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  
  konsta: {
    colors: {
      primary: "#388E3C",
      secondary: "#616161",
      background: "#FFFFFF",
      card: "#F4F4F4",
    },
  },
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Light mode HorusAlert palette
        background: "#FFFFFF", // Fondo principal
        card: "#F4F4F4", // Fondo secundario (tarjetas/paneles)
        /*primary: {
          DEFAULT: "#388E3C", // Color de énfasis/acento (USAL verde claro/moderno)
          foreground: "#FFFFFF", // White text on primary
        },
        secondary: {
          DEFAULT: "#616161", // Texto secundario/iconos secundarios
          foreground: "#FFFFFF",
        },
        */
        foreground: "#212121", // Texto principal
        accent: {
          DEFAULT: "#FF9800", // Color de alertas/notificaciones
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F4F4F4", 
          foreground: "#616161", // Texto secundario
        },
        destructive: {
          DEFAULT: "#FF9800", // Using accent color for destructive actions
          foreground: "#FFFFFF",
        },
        border: "#E0E0E0",
        input: "#F4F4F4",
        ring: "#388E3C",
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#212121",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
});
