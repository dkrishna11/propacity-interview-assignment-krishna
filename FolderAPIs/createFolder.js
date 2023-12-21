const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const s3 = require("../config/AWSConfig");
const { v4: uuidv4 } = require('uuid');

const createFolder = async (req, res) => {
  const userEmail = req.locals.email;
  const { folderName } = req.body;
  let userData, curentfolder;

  try {
    userData = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!userData) {
      return res.status(400).send({
        status: 400,
        message: "User not found",
      });
    }

    

    // Checking if the folder name already exists
    const duplicateFolder = await prisma.folder.findUnique({
      where: {
        // AND: [{ createdBy: userData.email }, { folderName }],
        folderName,
      },
    });

   

    if (duplicateFolder) {
      return res.status(400).send({
        status: 400,
        message:
          "A folder with the same name already exists. Please choose a different name.",
      });
    }

    const bucketName = process.env.AWS_BUCKET;
    const key = `${folderName}/`;
    
    // Create an empty object to simulate the folder
    await s3.putObject(
      {
        Bucket: bucketName,
        Key: key,
        Body: "", // Empty content
      },
      (err, data) => {
        if (err) {
          
          return res.status(400).send({
            status: 400,
            message: "Failed to create folder in AWS",
          });
        } else {
          console.log("Folder created successfully in S3:", data);
          curentfolder=data;
        }
      }
    );

    const folderId = uuidv4(); 

    const folder = await prisma.folder.create({
      data: {
        createdBy: userData.email,
        folderName,
        folderId,
      },
    });

    if (!folder) {
      return res.status(400).send({
        status: 400,
        message: "Failed to create folder in database",
      });
    }

    

    return res.status(201).send({
      status: 201,
      message: "Folder created successfully",
      data: {
        folder,
      },
    });
  } catch (error) {
    

    return res.status(500).send({
      status: 500,
      message: "Failed to create folder!",
      data: error,
    });
  }
};

module.exports = { createFolder };
