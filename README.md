# SarazinNode

## Step 1: Initialize the Project

### 1. Initialize npm
`npm init -y`

### 2. Install dependencies
`npm install express sequelize pg pg-hstore`

### 3. Install development tools (Sequelize CLI)
`npm install --save-dev sequelize-cli`

### 4. Initialize Sequelize structure
`npx sequelize-cli init`


## Step 2: Configure the Database

Open the file config/config.json and add "postgres" in developement section.


## Step 3: Create the  Models & Migration

### 1. Update the package list
`sudo apt-get update`

### 2. Install PostgreSQL
`sudo apt-get install -y postgresql postgresql-contrib`

### 3. Start the service
`sudo service postgresql start`

### 4. Start Postgres using Docker 
`docker run --name my-postgres -e POSTGRES_PASSWORD=azerty -e POSTGRES_DB=SarazinNode_dev -p 5432:5432 -d postgres 2ca0072c0a1224de3e7446c620abb7b9dc0ebe5ec842bdd75f09e4c47112801f`


### 5. Models Generation
- User Model: `npx sequelize-cli model:generate --name User --attributes "firstname:string,lastname:string,email:string"`

- Device Model: `npx sequelize-cli model:generate --name Device --attributes "name:string,serialNumber:string,userId:integer"`

- Group Model: `npx sequelize-cli model:generate --name Group --attributes "name:string"`

- UserGroups (manyTomany) : `npx sequelize-cli model:generate --name UserGroup --attributes "userId:integer,groupId:integer"`
- Session

### 6. Run the Migration
`npx sequelize-cli db:migrate`


### 7. Test

- Connect to the Database : 
`docker exec -it my-postgres psql -U postgres -d SarazinNode_dev`
 & then test with "SELECT * FROM "Users";"


## Step 4: Define Associations (The "Links")

- inside  models/user.js  --static associate(models)-- : define associations between user-> grp & user-> device
- inside  models/device.js : define the mapping with user


## Step 5: Create the Architecture 
To add the missing directories as the professor said `mkdir controllers routes middlewares services utils`

## Step 6: Create the Logic (Controller)
File user.js inside controller is created with CRUD functions

## Step 7: Create the Routes
File users.js is created inside routes 

## Step 8: Start the Server & TEST
- start server : `node server.js`
- restart DB : `docker start my-postgres`
- Test "CREATE USER" (POST) : `curl -X POST http://localhost:3000/users \ -H "Content-Type: application/json" \ -d '{"firstname": "Hajar", "lastname": "Aloua", "email": "alouahajar20@gmail.com"}'`

- Test "GET ALL USERS" (GET) : `curl http://localhost:3000/users`
- Test "UPDATE USER" (PUT) : `curl -X PUT http://localhost:3000/users/1 \ -H "Content-Type: application/json" \ -d '{"firstname": "Hajar Updated"}'`
- Test "DELETE USER" (DELETE) : `curl -X DELETE http://localhost:3000/users/1`

- Test "Groups" : (CREATE)-> `curl -X POST http://localhost:3000/groups \ -H "Content-Type: application/json" \ -d '{"name": "Admin Team"}'` & (GET List ALL) -> `curl http://localhost:3000/groups` 

- Test "Devices" (CREATE) -> `curl -X POST http://localhost:3000/devices \ -H "Content-Type: application/json" \ -d '{"name": "iPhone 15", "serialNumber": "SN-998877", "userId": 1}'`  & (GET List ALL) -> `curl http://localhost:3000/devices` 

- LINK USER to GRP : `curl -X POST http://localhost:3000/users/1/groups/1`



## Step 9: Adding Session Model & Test
 in this step 

- Database Layer: created a Sessions table linked to Users
- Auth Controller:  built a login function that generates a secure token and saves it to the DB.
- Middleware: built CheckAuth, which intercepts requests, verifies the token against the database, and attaches the user to the request.
- Route Protection: protected/users endpoints.

- To generate model session : `npx sequelize-cli migration:generate --name create-session`

-----------------TESTS-------------------------------- 

- to check tables exist : `docker exec -it my-postgres psql -U postgres -d SarazinNode_dev -c "\dt"`

- Toregister no token needed `curl -X POST http://localhost:3000/register \ -H "Content-Type: application/json" \ -d '{"firstname": "Zoral", "lastname": "Dev", "email": "zoral@test.com"}'`

- To login to genrate token `curl -X POST http://localhost:3000/login \-H "Content-Type: application/json" \ -d '{"email": "zoral@test.com"}'`

- To acces users   `curl -X GET http://localhost:3000/users \ -H "Authorization: Bearer <THE_TOKEN>`



## Step 10: JWT

- install the JWT Library : `npm install jsonwebtoken`
- for env file : `npm install dotenv`
- Create services/jwt.js  : This service will handle the signing and verification of the tokens.
- Update middlwears/auth.js : Now, the middleware doesn't need to talk to the database Session table to verify a token ( but still save tk to session to verify wich active session)
- Update controllers/auth.js :  to use new jwt service

----------------------------------TESTS-------------------------------------------------------

- Login to get the JWT : `curl -X POST http://localhost:3000/login \ -H "Content-Type: application/json" \ -d '{"email": "zoral@test.com"}'` 

- Use the Token to Access Users : `curl -X GET http://localhost:3000/users \-H "Authorization: Bearer JWT_HERE"`


## Step 11: Permission Model

- First, we create the Permission model and the join table for Groups : ` npx sequelize-cli model:generate --name Permission --attributes scope:string` + `npx sequelize-cli model:generate --name GroupPermission --attributes groupId:integer,permissionId:integer` (ManytoMany)

- models/permission.js : fill the associations

- models/group.js : add association with permission

- services/permission.js : Since permissions are now stored in the database, we need a service to fetch all unique scopes a user has across all their group , looks at their groups, and collects all the unique scopes.

- middlewares/perm.js : This middleware will check if the user's JWT contains the required scope for that route.

- routes/users.js : Applying RBAC to Routes to controle endpoints


- Permission Mapping Table : 

Group,Scopes (Permissions)
* Admin,* (All permissions listed below)
* UserManager,"user:read, user:write, user:delete, group:read"
* DeviceManager,"device:read, device:write, device:delete"
* UserStandard,"self:read, me:write, device:read, session:read"
* Guest,"self:read, device:read"


- Generate the Seeder File : ` npx sequelize-cli seed:generate --name rbac-setup`
- Add the RBAC Logic : mapping the groups to the specific permissions you to the previus file generated
- Run the Seeder : `npx sequelize-cli db:seed:all`
- Verify in Database : `docker exec -it my-postgres psql -U postgres -d SarazinNode_dev -c "SELECT \"Groups\".name, \"Permissions\".scope FROM \"Groups\" JOIN \"GroupPermissions\" ON \"Groups\".id = \"GroupPermissions\".\"groupId\" JOIN \"Permissions\" ON \"Permissions\".id = \"GroupPermissions\".\"permissionId\" WHERE \"Groups\".name = 'Guest';"`



-----------------------------------------TEST ---------------------------------------------------

- Register user : `curl -X POST http://localhost:3000/register -H "Content-Type: application/json" \-d '{"firstname": "Sarah", "lastname": "Worker", "email": "sarah@company.com"}'` & `curl -X POST http://localhost:3000/register -H "Content-Type: application/json" \-d '{"firstname": "Tom", "lastname": "Guest", "email": "tom@external.com"}'`


- Assign Groups in the Database : ``

