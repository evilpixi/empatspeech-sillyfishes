import { build } from 'esbuild';
import dotenv from 'dotenv';
import clean from 'esbuild-plugin-clean';
import copy from 'esbuild-plugin-copy';
import inlineImage from 'esbuild-plugin-inline-image';

dotenv.config();
console.log('SOCKET_IO_URL build:', process.env.SOCKET_IO_URL);

let msgPhaser = {
    name: 'msg-phaser',
    setup (build)
    {
        build.onEnd(() =>
        {
            const line = "---------------------------------------------------------";
            const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
            process.stdout.write(`${line}\n${msg}\n${line}\n`);

            process.stdout.write(`✨ Done ✨\n`);
        });
    },
}

const builder = async () =>
{
    await build({
        entryPoints: ['./src/main.ts'],
        tsconfig: './tsconfig.json',
        bundle: true,
        minify: true,
        sourcemap: false,
        target: ['es2020', 'chrome80', 'firefox70', 'safari13', 'edge18'],
        outfile: './dist/bundle.min.js',
        define: {
            "SOCKET_IO_URL": JSON.stringify(process.env.SOCKET_IO_URL || "http://localhost:3000")
        },
        plugins: [
            clean({
                patterns: ['./dist/*', './public/bundle.min.js'],
            }),
            inlineImage({
                namespace: 'assets',
            }),
            copy({
                assets: [
                    { from: './public/index.html', to: './' },
                    { from: './public/style.css', to: './' },
                    { from: './public/favicon.ico', to: './' },
                    { from: './public/favicon.png', to: './' },
                    { from: './public/assets/**/*', to: './assets/' }
                ],
            }),
            msgPhaser
        ]
    });
};
builder();
