import { defineConfig } from "vite"

export default defineConfig({
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
        }
    },
    build: {
        target: "es2022"
    },
    esbuild: {
        target: "es2022"
    },
    optimizeDeps:{
        esbuildOptions: {
        target: "es2022",
        }
    }
      
})