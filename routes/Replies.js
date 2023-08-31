const express=require('express');
const pool = require('../db');

const router=express.Router();


//get all replies for a particular post
router.get('/getReply/:post_id',async(req,res)=>{
    const {post_id}=req.params;
    console.log(post_id);
    try {
        const getQuery=`
            select * from replydb where post_id=$1;
        `;
        const result=await pool.query(getQuery,[post_id]);
        console.log(result);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:'Something went wrong'})
    }

});


router.post('/postReply',async(req,res)=>{
    try {
        console.log(req)
        const { user_id, post_id, made_by, reply_content,time_created } = req.body;

        const queryReply = `
            INSERT INTO replydb (user_id, post_id, made_by, reply_content,time_created)
            VALUES ($1, $2, $3, $4, $5) returning reply_id;
        `;

        const values = [user_id,post_id, made_by,reply_content, time_created];

        const result = await pool.query(queryReply, values);
        const {reply_id}=result.rows[0];
        
        
        res.status(201).json(reply_id);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'An error occurred' });
    }
});

module.exports=router;
