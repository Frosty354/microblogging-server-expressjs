const express = require('express');
const bodyParser = require('body-parser');
const pool =require("./db");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secret="Red#$Dead@&Redemoto67";

const app = express();
const cors = require('cors');
// Allow requests from localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

const port = process.env.PORT || 3654; // Change to your desired port
app.use(express.json());
app.use(cookieParser());

const userRoutes=require('./routes/User');
const postRoutes=require('./routes/Posts');
const replyRoutes=require('./routes/Replies');

app.use('/users',userRoutes);
app.use('/post',postRoutes)
app.use('/reply',replyRoutes);






// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
