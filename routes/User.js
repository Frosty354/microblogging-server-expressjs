const express=require('express');
const pool = require('../db');

const router=express.Router();



// Define a route to handle the GET request
router.get('/getAllusers', async(req,res)=>{
    try {
        const query = `select user_name from userdb;`;
        const result =await pool.query(query);
        const users=result.rows;
        console.log("users->",users)
        res.status(200).json({message:'Received all users successfully'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'An error has occured'});
    }
});



// Define a route to handle the POST request
router.post('/createUser', async (req, res) => {
    try {
        const { user_name, auth_measure,first_name, user_email, password, created_on, last_login,following,followers,post_ids } = req.body;

        const query = `
            INSERT INTO USERDB (user_name, auth_measure, first_name,user_email, password, created_on, last_login ,following,followers,post_ids)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING USER_ID;
        `;

        const values = [user_name, auth_measure,first_name ,user_email, password, created_on, last_login,following,followers,post_ids];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'An error occurred' });
    }
});




// Define a route to handle the DELETE request
router.delete('/deleteUser/:user_id', async (req, res) => {
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
        const {user_name,password} = req.body;

            
        const query = `
            select user_id,user_name,auth_measure,user_email,created_on,
            last_login,first_name,following,followers,post_ids from userdb 
            where user_name= $1 and password= $2;
        `;

        const result = await pool.query(query, [user_name,password]);
        console.log(result.rows[0])
        
            res.status(200).json( result.rows[0] );
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'An error occurred' });
    }
})



module.exports=router;