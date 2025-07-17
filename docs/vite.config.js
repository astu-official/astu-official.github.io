import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Conscious Journey - Roshan Adhikari",
        short_name: "RoshanAdhikari",
        description:
          "Personal portfolio and conscious journey of Roshan Adhikari",
        theme_color: "#8d6e63",
        background_color: "#f8f5f0",
        display: "standalone",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["gsap"],
          utils: ["algoliasearch", "contentful"],
        },
      },
    },
  },
});
