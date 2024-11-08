import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import cert from 'vite-plugin-mkcert';
import { fileURLToPath, URL } from 'node:url';

const publicEnvVarPrefix = ['PUBLIC_'];
const envPrefix = [...publicEnvVarPrefix, 'VITE_'];
const publicEnvVars = ['API_URL'].map(str => `${publicEnvVarPrefix}${str}`);

export default defineConfig(({ mode }) => {
    const envDir = fileURLToPath(new URL('.', import.meta.url));
    const env = loadEnv(mode, envDir, envPrefix);

    publicEnvVars.forEach(key => {
        if (!env[key]) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    });

    return {
        plugins: [react(), cert(), svgr()],
        server: {
            host: true,
            port: parseInt(env.VITE_APP_PORT, 10),
        },
        resolve: {
            alias: {
                src: resolve(__dirname, 'src'),
            },
        },
        build: {
            outDir: resolve(__dirname, 'build'),
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/entries/[name].js',
                    assetFileNames: 'assets/[ext]/[name][extname]',
                    chunkFileNames: 'chunks/[name].js',
                    manualChunks: {
                        api: [
                            '@telegram-apps/sdk-react',
                            '@tg-gift-app/api-sdk',
                        ],
                        react: [
                            'react',
                            'react-dom',
                            'react-router-dom',
                            'react-error-boundary',
                        ],
                        i18n: ['i18next', 'react-i18next'],
                        animation: ['lottie-react'],
                    },
                },
            },
            cssCodeSplit: true,
        },

        css: {
            devSourcemap: true,
            preprocessorOptions: {
                sass: {
                    quietDeps: true, // there are somme deprecation warning in bootstrap scss files, see: https://sass-lang.com/d/mixed-decls
                },
            },
        },

        define: {
            __DEV__: mode === 'development',
        },

        envPrefix,
    };
});
