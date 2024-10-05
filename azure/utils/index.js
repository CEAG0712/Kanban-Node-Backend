import config from "../configuration/env.config.js";
import jwt from "jsonwebtoken";

class UtilFunctions {
  /** Generate and sign a user Token */
  static async generateToken(data) {
    const appConfig = config;

    return new Promise((resolve, _reject) => {
      const signOptions = {
        issuer: `${appConfig.server_token_issuer}`,
        subject: `${appConfig.app_name}. [Author: fsb]`,
        algorithm: "HS256",
        audience: ["North America"],
      };

      signOptions.expiresIn = appConfig.token_expiry_time;

      jwt.sign(
        data,
        `${appConfig.server_token_secret}`,
        signOptions,
        (err, token) => {
          if (err) {
            logger.error(err.message);
          }

          resolve(token);
        }
      );
    });
  }

  /** Generate and sign a user Token */
  static async verifyToken(token) {
    const appConfig = config;

    return new Promise((resolve, reject) => {
      jwt.verify(token, `${appConfig.server_token_secret}`, (err, decoded) => {
        if (err) {
          logger.error(err.message);
          reject({ status: false, error: err.message });
        }

        resolve({ status: true, decoded });
      });
    });
  }
}

export default UtilFunctions;
