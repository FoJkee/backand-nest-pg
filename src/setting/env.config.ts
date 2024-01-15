import * as process from 'process';

export type ConfigEnvType = ReturnType<typeof getConfig>;
export const getConfig = () => ({
  secrets: {
    secretAccessToken: process.env.SECRET_ACCESS_TOKEN,
    secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
    expirationAccessToken: process.env.TIME_EXPIRATION_ACCESS_TOKEN,
    expirationRefreshToken: process.env.TIME_EXPIRATION_REFRESH_TOKEN,
  },
});
