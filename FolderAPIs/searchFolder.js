const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const searchFolder=async(req, res)=>{
    const {folderName}=req.body;
    const userEmail=req.locals.email;


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
    
        
    
        // Fetchingg all th folders
        const usersFolder = await prisma.folder.findMany({
          where: {
            folderName,
          },
          take:5
        });

        if (usersFolder.length==0) {
          return res.status(400).send({
            status: 400,
            message: "No folder found",
          });
        }
    
        
    
        return res.status(201).send({
          status: 201,
          message: "Folder Fetched successfully",
          data: {
            usersFolder,
          },
        });
      } catch (error) {
        
    
        return res.status(500).send({
          status: 500,
          message: "Failed to fetch folder!",
          data: error,
        });
      }

}

module.exports={searchFolder}