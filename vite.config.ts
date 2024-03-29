// https://vitejs.dev/config/
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import dns from 'dns';
import react from '@vitejs/plugin-react';
import htmlPlugin from 'vite-plugin-html-config';
import openGraphConfig from './openGraphConfig.js';
import { renameLocales } from './scripts/renameLocales';

dns.setDefaultResultOrder('verbatim');

const htmlPluginOpt = {
    metas: Object.keys(openGraphConfig).map((key) => {
        return ({
            name: key,
            content: openGraphConfig[key]
        });
    })
};


export default defineConfig({
    resolve: {
        alias: {
            uikit: '/src/uikit/',
        }
    },
    plugins: [
        {
            name: 'prepare',
            buildStart() {
                renameLocales();
            }
        },
        react(),
        htmlPlugin(htmlPluginOpt),
        basicSsl(),
    ],
    server: {
        port: 3002,
        https: true
    },
});
