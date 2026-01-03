import "dotenv/config";

const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb',
    salt_rounds: 10,
    jwt_secret: process.env.JWT_SECRET

}

export default config;