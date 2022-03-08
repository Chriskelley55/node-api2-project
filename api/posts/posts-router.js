// implement your posts router here
const Posts = require('./posts-model');
const express = require('express');
const router = express.Router()

router.get('/', async(req,res)=> {
    try{
        const post = await Posts.find()
        res.json(post)
    }
    catch{
        res.status(500).json({ message: "The post is unavailable" })
    }
})
module.exports = router;