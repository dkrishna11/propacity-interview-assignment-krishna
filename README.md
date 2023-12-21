# Propacity Backend Interview Assignment:

## dependencies used:
1. aws-sdk
2. bcrypt
3. dotenv
4. jsonwebtoken
5. multer
6. uuid
7. @prisma/client

## devDependencies used:
1. express
2. nodemon
3. prisma



## ENV FILE DATA:

PORT=3001

SALT_ROUND=8

JWT_SECRET_KEY=krishna
DATABASE_URL="postgresql://postgres:password@localhost:5432/filemanager?schema=public"



AWS_SECRET_KEY=
AWS_ACCESS_KEY=
AWS_BUCKET=filemanager-interview
AWS_REGION=ap-south-1

### To run the code use
    npx nodemon index

## use postmon to test the apis

## Prisma is used to make schema for user, folder subfolder and file

## Middleware:
    Auth middleware is created to securely acess the all the api except the register and login api. Only if token is generated only then user is allowed to access the apis.


### 1. Register API

## requires:  req.boby
        username, email, password

## api call 

POST menthod

http://localhost:3001/user/register

desc: Verifies the email whether the user exist are not, if no user found in that email id.. then password is hashed using bcrypt and hassed passed is stored in postgresql along with email username. Later new user is created.

## 2. Login API:

### api call:
    POST method
http://localhost:3001/user/login

    inside req.body:
        email, password
    
    des: verifies the user is registered or not by checking it in postgresql database... if no user is registered then throws error by saying users not exists. Please register.

    if user exists... verifies the password by dehashing using bycrypt and token is generated using jsonwebtoken and it takes payload and secreat key to generate toekn.. which can be used to authorize for logining the user



## Note: pass the token in headers to access the below apis. In header pass key as x-token: value


## In the below all api call.. first user is check whether the login user is creating the folder or not


## 3. creating folder:

    apicall: POST method
http://localhost:3001/createFolder

  # req.body:
    folderName

    des: if folder name is exist in the database.. then it wil throw an error.. if no folder name is found in database then it will create the folder with id, createdby, folderName, folderid abd createdDateTime. Parallely the folder is screated in S3 Bucket

![Alt text](image.png)

folder in S3 bucket
![Alt text](image-1.png)

folder in Database
![Alt text](image-2.png)


## 4. SubFolder API:

API call: 
    POST menthod;

http://localhost:3001/subfolder/:currentFolderId

pass the "currentFolderId" in params
and in req.body pass the "subFolderName"


    des: initially currentFolderid is passed in params of "Test-Folder" then subFolderName is taken from req.body.

    First it verifies the currrentFolderId is exist or not in Folder Model.. if it exist only then it will allow to further. Later checks the same name subfolder is exist or not. If subFolder name is unique then it will create a subfolder in S3 Bucket and in the database  id, createdBy, folderName, folderId, createdateTime, parentId is store in database using the subFolder model.
    Here parentId is taken from params only if the folder exist and unique.
subfolder 
![Alt text](image-3.png)

subfolder in folder S3 Bucket
![Alt text](image-4.png)

subfolder in database
![Alt text](image-5.png)


## 5. upload the file in subfolder API:

API call: POST menthod
http://localhost:3001/upload/:subFolderid

    pass the subFolderId in params that is folderId in database of subFolder

    File is taken as shown in the image.


![Alt text](image-6.png)


file in database
   
    in Database id, fileName, fileSize, fileType, fileIf, key, uploadDate, userName, folderId, is store of every file
![Alt text](image-7.png)

    file store in S3 Bucket 
![Alt text](image-8.png)


## 6. Renaming File API:

    api call: PUT Method
http://localhost:3001/rename/:fileId

    fileId is passed through params
    req.body: newFileName is taken to rename the file


    first checks the owners of the file and only then it will allow to rename the file
file renamed:
![Alt text](image-9.png)

renamed file in database
![Alt text](image-10.png)

renamed file in s3 bucket
![Alt text](image-11.png)

## 7. Moving the file to diffrent folder API:

api call: PUT Menthod

http://localhost:3001/moveFile/:movingFolderId/:fileId

    first folderid of different folder is taken as movingFolderId and the file which we what to move is taken as fileId in params.

here new folder that is Test-Sub-Folder-2, folderId: "85e349ed-dea7-4b91-abda-9bb1206573a3" is created to move the file from Test-Sub-Folder.. 
![Alt text](image-12.png)

![Alt text](image-13.png)

file has been moved from test-subfolder to test-subfolder-2.. and folderId of File updated to test-sub-folder-2 id.

![Alt text](image-14.png)

successfully moveed file in S3 database.
![Alt text](image-15.png)


## 8. Deleting the file from database and s3 bucket API:

api call: DELETE method

http://localhost:3001/delete/:fileId

    fileId is passed from params to delete the file 

    Before deleting the file it check whether is exits and belong to the logged in user.. only then it will delete the file from database and s3 bucket.

deleting file from database and s3 bucket
![Alt text](image-16.png)

## 9. Searching the fodler API:

api call: GET Method

http://localhost:3001/searchFolder

    req.body: folderName

    First check the folder is exist in the folderName. If the fodler exist it return an arrray of the folder.
    used pagination to display the list of array

search result
![Alt text](image-18.png)