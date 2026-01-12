require('dotenv').config();
const express = require('express');
const app = express();
const mainRouter = require('./routes/routes'); // Points to routes/routes.js

app.use(express.json());
app.use('/', mainRouter); // All routes flow through here now

app.listen(3000, () => console.log("Server running on port 3000"));