class responseHandler {
  static sendSuccessResponse({
    res,
    code = 200,
    message = "successful",
    data = null,
  }) {
    const response = { success: true, code: code, message, data };

    return res.status(code).json(response);
  }

  static sendErrorResponse({
    res,
    code,
    error = "Operation failed",
    custom = false,
  }) {
    const response = { success: false, code: code, message: error };

    return res.status(code).json(response);
  }
}

export default responseHandler;
