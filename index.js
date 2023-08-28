const express = require('express');
const bodyParser = require('body-parser');
const pool =require("./db");

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


const userRoutes=require('./routes/User');
const postRoutes=require('./routes/Posts');

app.use('/users',userRoutes);
app.use('/post',postRoutes)






// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
