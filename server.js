require('dotenv').config();
const express = require('express');
const app = express();
const mainRouter = require('./routes/routes');

app.use(express.json());

// TEST ROUTE
app.get('/test', (req, res) => {
    res.json({ message: "Server is reachable!" });
});

app.use('/api', mainRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`SYSTEM LIVE ON PORT ${PORT}`));