const jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  const token = req.headers["x-token"];

  let verified;

  try {
    verified =  jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "JWT not provided. Please login",
      data: error,
    });
  }
//   store data in express locals
  if(verified){
    // console.log(req.locals);
    req.locals=verified;
    next();
  }
  else{
    return res.status(401).send({
        status: 401,
        message: "User not authenticated. Please login",
        data: error,
      });
  }
};

module.exports={Auth};
