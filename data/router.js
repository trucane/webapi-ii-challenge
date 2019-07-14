const express = require('express')
const router = require('express').Router()
const db = require('./db')

router.use(express.json());


router.get('/', (req, res) =>{
    db.find()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error =>{
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

router.get('/:id', (req, res) =>{
    const {id} = req.params
    if(!id){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }else{

        db.findById(id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error =>{
            res.status(500).json({error: "The post information could not be retrieved."})
        })
    }
});

router.get('/:id/comments', (req, res) =>{
    const {id} = req.params;
    if(!id){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }else{
        db.findPostComments(id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(error =>{
            res.status(500).json({error: "The comments information could not be retrieved."})
        })
    }
});

router.get('/:id/comments/:comment_id', (req, res) =>{
    const {comment_id} = req.params;
    db.findCommentById(comment_id)
    .then(comment =>{
        res.status(200).json(comment)
    })
    .catch(error =>{
        res.status(500).json(error)
    })
});

router.post('/', (req, res) =>{
    const {title, contents} =  req.body;
    if(!title || !contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post." })
    }else{
        db.insert( req.body)
        .then( post =>{
            res.status(201).json(post)
        })
        .catch(error =>{
            res.status(500).json({error: "There was an error while saving the post to the database"})
        })
    }

});

router.post('/:id/comments', (req, res) =>{
    const {id} = req.params;
    if(!id){
        res.status(400).json({ message: "The post with the specified ID does not exist."})
    }else{
        const newComment = {
            text:req.body.text,
            post_id: id
        }
        if(!req.body.text){
            res.status(400).json({errorMessage: "Please provide text for the comment."})
        }else{

            db.insertComment(newComment)
            .then( comment =>{
                if(comment){
                    res.status(201).json(comment)
                }else{
                    res.status(404).json({"message":'trouble adding comment'})
                }
            })
            .catch(error =>{
                res.status(500).json({error: "There was an error while saving the comment to the database"})
            })
        }
    }

})



router.put('/:id', (req, res) =>{
    //const {title, contents} =  req.body;
    const {id} =  req.params;
    if(!id){
        req.status(404).json({ message: "The post with the specified ID does not exist."})
    }else{
        const {title, contents} = req.body

        if(!title || !contents){
            res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        }else{

            db.update(id, req.body)
            .then(updated =>{
                if(updated){
                    res.status(200).json(updated)
                }else{
                    res.status(404).json({"message":'could not find to update'}) 
                }
            })
            .catch(error =>{
                res.status(500).json({error: "The post information could not be modified."})
            })
        }
    }
});

router.delete('/:id', (req, res) =>{
    const {id} =  req.params;
    if(!id){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }else{
        db.remove(id)
        .then( gone =>{
                res.status(204)
        })
        .catch(error =>{
            res.status(500).json({error: "The post could not be removed"})
        })
    }
});

module.exports = router;












