/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: "mongodb://127.0.0.1:27017/lawconnect",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "ac2e48ef0d42c503a8bb22a85c1b8a5e107e24b72746ef2bfbf4fc4b11be1558",
    
    // Stripe Credentials
    STRIPE_SECRET_KEY: "sk_test_51Og9sISJeZ5hlZQG855ZUG1bXsNiWFCmLlO3kEY11IV0W6sBAxlD8nJTaNJsVQqPCkInuZEkMX9UfWQ0aNhCADUq00djr4vlT3",
    STRIPE_WEBHOOK_SECRET: "whsec_e66c0b243bd208f66346732de0bd696ef25a942f9a09e36f8bec70616faddc7f",
    
    // Client-side environment variables
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_51Og9sISJeZ5hlZQGAuJLdk4xVOHKj6HWbfS3TXbByzZgnNjSCRYjpstIx3okhl3aTt5xNs76BAweLn6ofGMGn0l600JpJBp9dF",
    GOOGLE_API_KEY:"AIzaSyByyi7tkj1KTj7CQ-RU4e8KmNvl40yS-Sg",
  },
};

export default nextConfig;