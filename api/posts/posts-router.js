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
router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({ message: "The post with the specified ID does not exist" })
    }
})

router.post('/', (req, res) => {
    const { title, contents } = req.body
        if(!title || !contents) {
            res.status(400).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            Posts.insert({ title, contents })
                .then(({id}) => {
                    return Posts.findById(id)
                })
                .then(post => {
                    res.status(201).json(post)
                })
                .catch(err => {
                    res.status(500).json({ 
                        message: 'The post with the specified ID does not exist',
                        err: err.message,
                        stack: err.stack
                    })
                })
        }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Posts.remove(req.params.id)
            res.json(post)
        }
    } catch(err) {
            res.status(500).json({ 
                message: "The post with the specified ID does not exist",
                err: err.message,
                stack: err.stack
            })
    }
})

router.put('/:id', (req, res) => {
    const {title, contents} = req.body
    if(!title || !contents) {
        res.status(400).json({
            message: '"Please provide title and contents for the post"'
        })
    } else {
        Posts.findById(req.params.id)
            .then(postID => {
                if(!postID) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else { 
                    return Posts.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if(data) {
                    return Posts.findById(req.params.id)
                }
            })
            .then(post => {
                res.status(200).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    err: err.message,
                })
            })
    }
})


router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const messages = await Posts.findPostComments(req.params.id)
            res.json(messages)
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack
        })
    }
})
module.exports = router;