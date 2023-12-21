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

### To run the code use
    npx nodemon index

## use postmon to test the api

## Prisma is used to make schema for user, folder subfolder and file


### 1. Register API

## requires:  req.boby
        username, email, password

## api call 

post menthod

http://localhost:3001/user/register

desc: Verifies the email whether the user exist are not, if no user found in that email id.. then password is hashed using bcrypt and hassed passed is stored in postgresql along with email username. Later new user is created.

## 2. Login API:

### api call:
    post menthod
http://localhost:3001/user/login

    inside req.body:
        email, password
    
    des: verifies the user is registered or not by checking it in postgresql database... if no user is registered then throws error by saying users not exists. Please register.

    if user exists... verifies the password by dehashing using bycrypt and token is generated using jsonwebtoken and it takes payload and secreat key to generate toekn.. which can be used to authorize for login the user

## Note: pass the token in headers to access the below apis. In header pass key as x-token: value


## 3. creating folder:

