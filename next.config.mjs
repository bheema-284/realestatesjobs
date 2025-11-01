import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*'
            },
        ],
        deviceSizes: [340, 640, 768, 1024, 1200, 1920],
        formats: ['image/webp'],
    },
};

// Much simpler - the package handles the ANALYZE env automatically
export default withBundleAnalyzer()(nextConfig);