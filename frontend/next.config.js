/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      // cloudinary
      'res.cloudinary.com',
      // github login
      'avatars.githubusercontent.com',
      // google login
      'lh3.googleusercontent.com',
      // twitter login
      'pbs.twimg.com',
      // ui avatars
      'ui-avatars.com',
      // gravatars
      'gravatar.com',
    ],
  },
};

module.exports = nextConfig;
