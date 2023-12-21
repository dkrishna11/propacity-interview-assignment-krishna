const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  const { email, password } = req.body;

  // Checking whether the user exists or not:
  try {
    const existingUserData = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUserData) {
      return res.status(400).send({
        status: 400,
        message: "User not exists. Please register!",
      });
    }

    // Dehashing password
    const isPasswordCorrect = await bcrypt.compare(password, existingUserData.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({
        status: 400,
        message: "Wrong password!",
      });
    }

    const payload = {
      userId: existingUserData.id,
      username: existingUserData.username,
      email: existingUserData.email,
    };

    // Generating token
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return res.status(200).send({
      status: 200,
      message: "User logged in successfully!",
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      status: 400,
      message: "Login failed. Please try again.",
      data: error,
    });
  }
};

module.exports = { Login };
