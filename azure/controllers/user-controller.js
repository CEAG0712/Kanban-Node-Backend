import bcrypt from "bcrypt";
import UserRepository from "../repository/user-repository.js";
import responseHandler from "../utils/response-handlers.js";
import { HTTP_STATUS_CODES } from "../constants/app-defaults.js";
import userRepository from "../repository/user-repository.js";
import UtilFunctions from "../utils/index.js";

export const createUser = async (req, res) => {
  let { name, email, password, confirmPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  if (await UserRepository.getSingleUser({ email })) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      error: "User email already exists",
    });
  }

  try {
    const newUser = (
      await userRepository.createUser({ ...req.body, password })
    ).toObject(); //transform to object

    delete newUser.password; //delete password from response object

    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.CREATED,
      message: "user created",
      data: newUser,
    });
  } catch (error) {
    console.log(error);

    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      error: "Unable to create the user",
    });
  }
};

export const getAuthUser = async (req, res) => {};

export const updateUser = async (req, res) => {};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user exists

    const user = await UserRepository.getSingleUser({ email });
    if (!user) {
      //give no clue what the issue with the creds is
      return responseHandler.sendErrorResponse({
        res,
        code: HTTP_STATUS_CODES.UNAUTHORIZED,
        error: "Invalid credentials, please try again.",
      });
    }

    //check if password is correct
    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      //give no clue what the issue with the creds is
      return responseHandler.sendErrorResponse({
        res,
        code: HTTP_STATUS_CODES.UNAUTHORIZED,
        error: "Invalid credentials, please try again",
      });
    }

    //Generate the token
    const jwtToken = await UtilFunctions.generateToken({
      _id: user._id,
      email: user.email,
    });

    delete user.password; //delete password from response object

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7000);

    res.cookie("access-token", jwtToken, {
      httpOnly: true,
      secure: true,
      expires: expirationDate,
      sameSite: "None",
    });
    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.OK,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    console.log(error);

    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Something went wrong",
    });
  }
};
