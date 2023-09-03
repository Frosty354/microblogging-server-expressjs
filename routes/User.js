const express=require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const router=express.Router();
const {jwtMiddleware}=require('../middleware/jwtMiddleware');

const secret="Red#$Dead@&Redemoto67";

// Define a route to handle the GET request
router.get('/getAllusers/:user_id',jwtMiddleware, async(req,res)=>{
    try {
        const{user_id}=req.params;
        const query = `select user_name,first_name from userdb where user_id!=$1;`;
        const result =await pool.query(query,[user_id]);
        const users=result.rows;
        // console.log("users->",users)
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'An error has occured'});
    }
});



// Define a route to handle the POST request
router.post('/createUser',jwtMiddleware, async (req, res) => {
    try {
        const { user_name, auth_measure,first_name, user_email, password, created_on, last_login } = req.body;

        const query = `
            INSERT INTO USERDB (user_name, auth_measure, first_name,user_email, password, created_on, last_login )
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING USER_ID;
        `;

        const values = [user_name, auth_measure,first_name ,user_email, password, created_on, last_login];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'An error occurred' });
    }
});




// Define a route to handle the DELETE request
router.delete('/deleteUser/:user_id',jwtMiddleware, async (req, res) => {
    try {
        const userId = req.params.user_id;
        console.log(userId)
        const query = `
            DELETE FROM USERDB
            WHERE user_id = $1
        `;

        await pool.query(query, [userId]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'An error occurred' });
    }
});




// Define a route to handle the verify user request(login)
router.post('/verifyUser/', async (req, res) => {
    try {
        const { user_name, password } = req.body;

        const checkQuery = `SELECT EXISTS(SELECT 1 FROM userdb WHERE user_name=$1);`
        const checkres = await pool.query(checkQuery, [user_name]);
        
        if (checkres.rows[0].exists) {
            const query = `
                select user_id, user_name, auth_measure, user_email, created_on,
                last_login, first_name from userdb 
                where user_name = $1 and password = $2;
            `;

            const result = await pool.query(query, [user_name, password]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                const token = jwt.sign(user, secret);
                res.cookie('authToken', token, {
                    httpOnly: true,
                    // secure: true, // Set to true for HTTPS
                    sameSite: 'None', // Set to "None" for cross-site access
                    maxAge: 2 * 60 * 60 * 1000, // Token expires in 2 hours (adjust as needed)
                    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // Expires 2 hours from now
                    });
                console.log(token)
                res.status(200).json(user);
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } else {
            res.status(404).json({ error: "User not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});



module.exports=router;