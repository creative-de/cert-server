import jwt from "jsonwebtoken";
const middleware = (req, res, next) => {
  // if loggedin there should be cookie in the request s req.cookie, that should be parsed with some code or cookie-parser npm
  const token = req.cookies.token;
  try {
    //if there isnt any token (yani), you are not allowed to proceed
    if (!token) return res.status(401).json({ errorMessage: "unauthorized" });

    // check if the token is valid to the sender-user

    const verified = jwt.verify(token, process.env.JWT_KEY);
    // returns { userId: '6079c7a1b817263234df822f', iat: 1618665020 }

    // add the user to the request body
    req.userId = verified.userId;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      errorMessage: "Unauthorized",
    });
  }
};

export default middleware;
