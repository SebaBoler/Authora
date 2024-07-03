export interface IConfiguration {
  postgres: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  jwt: {
    secret: string;
    expirationTime: number;
    refreshExpirationTime: string;
  };
  postmark: {
    apiKey: string;
  };
  basic: {
    nodeEnv: string;
    port: number;
  };
}

export const configuration = () => ({
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expirationTime: parseInt(process.env.JWT_EXPIRATION_TIME, 10),
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
  },
  postmark: {
    apiKey: process.env.POSTMARK_API_KEY,
  },
  basic: {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
  },
});
