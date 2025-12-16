import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/table-tales',
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    INGEST_SIGNING_KEY: process.env.INGEST_SIGNING_KEY,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
}


const requiredInProduction = ['CLERK_SECRET_KEY', 'CLERK_PUBLISHABLE_KEY'];
if (ENV.NODE_ENV === 'production') {
    for (const key of requiredInProduction) {
        if (!ENV[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
}