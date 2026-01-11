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







