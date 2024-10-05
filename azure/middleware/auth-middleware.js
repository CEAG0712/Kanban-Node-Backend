import jwt from "jsonwebtoken";
import responseHandler from "../utils/response-handlers.js";
import config from "../configuration/env.config.js";
import { HTTP_STATUS_CODES } from "../constants/app-defaults.js";

const auth = async (req, res, next) => {
  const appConfig = config;
  const token = req.cookies["access-token"];

  if (!token) {
    //cannot pass undefined token or else the backend will crash
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.UNAUTHORIZED,
      error: "Unauthorized Auth Middleware",
    });
  }

  jwt.verify(
    token,
    `${appConfig.server_token_secret}`,
    async (error, decoded) => {
      try {
        if (error) {
          console.log("login the error here", error);

          return responseHandler.sendErrorResponse({
            res,
            code: HTTP_STATUS_CODES.UNAUTHORIZED,
            error: error.message + " Inside try catch",
          });
        } else {
          const data = decoded;
          req["user"] = data;
          return next();
        }
      } catch (error) {
        console.log(error);
        return responseHandler.sendErrorResponse({
          res,
          code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
          error: "Something went wrong",
        });
      }
    }
  );
};

export default auth;
  //force test to authorize / comment when not using
  //   return responseHandler.sendErrorResponse({
  //     res,
  //     code: HTTP_STATUS_CODES.UNAUTHORIZED,
  //     error: "Unauthorized",
  //   });