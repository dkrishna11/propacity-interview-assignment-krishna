const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const Register = async (req, res) => {
  const { username, email, password } = req.body;

  //checking whether user exists or not:

  try {
    const ExistUerData = await prisma.user.findUnique({
      where: {
        email
      },
    });

    if (ExistUerData) {
      return res.status(400).send({
        status: 400,
        message: "user already exits. Please Login!",
      });
    }

    const SALT_ROUND = Number(process.env.SALT_ROUND);
    //hashing password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    const userObj = {
      username,
      email,
      password: hashedPassword,
    };

    //creating user data;
    await prisma.user.create({data:userObj});

    return res.status(201).send({
      status: 201,
      message: "User Registered successfull!",
    });

  } catch (error) {
    console.log(error)
    return res.status(400).send({
      status: 400,
      message: "Registration failed. Please try again.",
      data: error,
    });
  }
};

// Register()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .

module.exports = { Register };
