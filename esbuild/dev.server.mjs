import esbuildServe from "esbuild-serve";
import inlineImage from "esbuild-plugin-inline-image";
import dotenv from "dotenv";

dotenv.config();

esbuildServe(
    {
        logLevel: "info",
        entryPoints: ["src/main.ts"],
        bundle: true,
        outfile: "public/bundle.min.js",
        define: {
            SOCKET_IO_URL: JSON.stringify(process.env.SOCKET_IO_URL || "http://localhost:3000"),
        },
        plugins: [inlineImage()]
    },
    { root: "public", port: 8080 },
);