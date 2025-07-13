/** @type {import('next').NextConfig} */
const nextConfig = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
        },
    },
};

export default nextConfig;
