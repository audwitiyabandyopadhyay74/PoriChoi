// next.config.mjs
export default {
    images: {
        domains: ['lh3.googleusercontent.com',
            'firebasestorage.googleapis.com',
            "via.placeholder.com",
            "graph.facebook.com",
            'raw.githubusercontent.com'
        ],
    },
    reactStrictMode: true,
    async redirects() {
        return [{
            source: '/',
            destination: '/index', // replace 'index' with your actual main page file if it's not named 'index.js'
            permanent: true,
        }, ];
    },
}