module.exports = {
    images: {
      formats: ["image/avif", "image/webp"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "assets.vercel.com",
          port: "",
          pathname: "/image/upload/**",
        },
      ],
      domains: ['storage.googleapis.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
  };

