export interface EnvironmentVariables {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: number;
  POSTMARK_API_KEY: string;
}
