const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const s3 = require("../config/AWSConfig");

// API endpoint to create a subfolder
const subFolder = async (req, res) => {
  const { currentFolderId } = req.params;
  const { subfolderName } = req.body;
  const userEmail = req.locals.email;

  
  try {
    // Check if the parent folder exists and if the user has permission
    const parentFolder = await prisma.folder.findUnique({
      where: { folderId: String(currentFolderId) },
    });

    
    if (!parentFolder || parentFolder.createdBy !== userEmail) {
      return res.status(403).send({
        status: 403,
        message:
          "You don't have permission to create a subfolder in this folder.",
      });
    }

    // Check if a subfolder with the same name already exists in the parent folder
    const duplicateSubfolder = await prisma.subfolder.findUnique({
      where: {
        folderName: subfolderName,
      },
    });

    
    if (duplicateSubfolder) {
      return res.status(400).send({
        status: 400,
        message:
          "A subfolder with the same name already exists. Please choose a different name.",
      });
    }


    const bucketName = process.env.AWS_BUCKET;
    const key = `${parentFolder.folderName}/${subfolderName}/`;
    
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
          console.log("Sub Folder created successfully in s3 bucket:", data);
        }
      }
    );

    const folderId = uuidv4(); 

    // Create the subfolder
    const subfolder = await prisma.subfolder.create({
      data: {
        createdBy: userEmail,
        folderName: subfolderName,
        folderId,
        parentId:String(currentFolderId)
      },
    });

    return res.status(201).json({
      status: 201,
      message: "Subfolder created successfully",
      data: {
        subfolder,
      },
    });
  } catch (error) {
   
    return res.status(500).json({
      status: 500,
      message: "Failed to create subfolder",
      data: error,
    });
  }
};

module.exports = { subFolder };
