const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
let nextConfig = {
    reactStrictMode: true,
};

let removeSettings = removeImports({
    experimental: { esmExternals: true },
});

nextConfig = Object.assign(removeSettings, nextConfig);

module.exports = nextConfig;
