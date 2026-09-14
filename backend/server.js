const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const authRoutes = require('./src/routes/authRoute.js');
const teamRoutes = require('./src/routes/teamRoutes');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
connectDB();

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send("AI devflow Api is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});