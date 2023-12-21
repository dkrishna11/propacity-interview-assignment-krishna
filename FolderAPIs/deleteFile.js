const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/AWSConfig");

const deleteFile = async (req, res) => {
  const { fileId } = req.params;
  const userEmail = req.locals.email;

  try {
    const fileData = await prisma.file.findUnique({
      where: { fileId: String(fileId) },
    });

    if (!fileData) {
      return res.status(404).send({
        status: 404,
        message: "File not found",
      });
    }

    const subFolderData = await prisma.subfolder.findUnique({
      where: { folderId: String(fileData.folderId) },
    });

    if (!subFolderData || subFolderData.createdBy !== userEmail) {
      return res.status(403).send({
        status: 403,
        message: "You do not have permission to rename this file.",
      });
    }

    // Deleting the file in AWS S3

    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: fileData.key,
      })
      .promise();

    const deletedFile = await prisma.file.delete({
      where: { fileId: String(fileId) },
    });

    return res.status(200).send({
      status: 200,
      message: "File Deleted Successfully",
      data: {
        deletedFile,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Failed to Delete the file",
      data: {
        error,
      },
    });
  }
};

module.exports = { deleteFile };
