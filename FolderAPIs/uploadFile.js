const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/AWSConfig");

const uploadFile = async (req, res) => {
  const { file } = req;
  const { subFolderid } = req.params;
  const userEmail = req.locals.email;

  try {
    // Validate folder ownership
    //subfolder data
    const subFolderData = await prisma.subfolder.findUnique({
      where: { folderId: String(subFolderid) },
    });

    //folder data
    const folderData = await prisma.folder.findUnique({
      where: { folderId: String(subFolderData.parentId) },
    });

    if (
      !subFolderData ||
      !folderData ||
      subFolderData.createdBy !== userEmail
    ) {
      return res.status(403).send({
        status: 403,
        message: "You do not have permission to upload to this folder.",
      });
    }

    // Upload file to S3
    const key = `${folderData.folderName}/${subFolderData.folderName}/${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ACL: "private",
    };

    const s3Response = await s3.upload(params).promise();

    // Record file metadata in the database
    const uploadedFile = await prisma.file.create({
      data: {
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        fileId: uuidv4(),
        key: key,
        uploadDate: new Date(),
        folderId: subFolderid,
        user: { connect: { email: userEmail } },
      },
    });

    return res.status(201).send({
      status: 201,
      message: "File uploaded successfully",
      data: {
        file: uploadedFile,
        s3Response,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Failed to upload file",
      data: error,
    });
  }
};

module.exports = { uploadFile };
