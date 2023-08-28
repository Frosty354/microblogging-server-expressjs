const express=require('express');
const pool = require('../db');

const router=express.Router();


// get all posts for the user
router.get('/getPosts',async(req,res)=>{
    try {
        const{user_id}=req.body;
        const checkQuery=`SELECT EXISTS(SELECT 1 FROM POSTDB WHERE USER_ID=$1);`
        const checkres = await pool.query(checkQuery,[user_id]);
        if(checkres.rows[0].exists){
            const getQuery=`
            SELECT * FROM POSTDB WHERE USER_ID=$1;
            `
            const result=await pool.query(getQuery,[user_id]);
            console.log(result.rows);
            res.status(200).json({message:"Posts retrieved successfully"});
        }else{
            res.status(404).json({error:"User does not exist"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Something went wrong"});
    }
});


//make a post
router.post('/createPost',async(req,res)=>{
    try {
        const { user_id, made_by, post_content, reactions, isparentpost, replies, time_created } = req.body;

        const queryPostDB = `
            INSERT INTO POSTDB (user_id, made_by, post_content, reactions, isparentpost, replies ,time_created)
            VALUES ($1, $2, $3, $4, $5, $6, $7) returning post_id;
        `;

        const values = [user_id, made_by,post_content, reactions, isparentpost, replies, time_created];

        const result = await pool.query(queryPostDB, values);
        const {post_id}=result.rows[0];
        const queryUserDB= `
            UPDATE USERDB SET post_ids = array_append(post_ids, $1) WHERE user_id = $2;
        `
        const resultUpdate=await pool.query(queryUserDB,[post_id,user_id])
        console.log(resultUpdate);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'An error occurred' });
    }
});



router.delete('/deletePost',async(req,res)=>{
    try {
        const { user_id, made_by,post_id } = req.body;
        const checkQuery=`SELECT EXISTS(SELECT 1 FROM POSTDB WHERE POST_ID=$1);`
        const checkRes = await pool.query(checkQuery,[post_id]);
       
        if(checkRes.rows[0].exists){
            const queryPostDB = `
            DELETE FROM POSTDB WHERE POST_ID=$1;
            `;

            await pool.query(queryPostDB, [post_id]);
        
            const queryUserDB= `
                UPDATE USERDB SET post_ids = array_remove(post_ids, $1) WHERE user_id = $2;
            `
            await pool.query(queryUserDB,[post_id,user_id]);
            
            res.status(202).json({ message: 'Post deleted successfully' });
        }else{
            res.status(404).json({error:"Post does not exist"});
        }
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'An error occurred' });
    }
})



router.put('/updatePost',async(req,res)=>{
    try {
        const {post_id,post_content}=req.body;
        const checkQuery=`SELECT EXISTS(SELECT 1 FROM POSTDB WHERE POST_ID=$1);`
        const checkRes = await pool.query(checkQuery,[post_id]);
        if(checkRes.rows[0].exists){
            const query=`
            UPDATE POSTDB SET POST_CONTENT=$1 WHERE POST_ID=$2;
            `
            await pool.query(query,[post_content,post_id]);
            
            res.status(202).json({message:"Post updated successfully"});
        }else{
            res.status(404).json({error:"Post does not exist"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"An error has occured"});
    }
})


module.exports=router