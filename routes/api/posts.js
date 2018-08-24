const express=require('express');
const router=express.Router();
const mongoose= require('mongoose');
const passport= require('passport');


//Import Post model
const Post= require('../../models/Post');
//Import Profile model
const Profile=require('../../models/Profile');
//Import ValidatePost
const validatePostInput=require('../../validation/post');

router.get('/test', (req,res)=>res.json({msg: "My posts"}));

//@route        POST api/posts
//description   Create a post
//access        Private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid} = validatePostInput(req.body);

    //Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    const newPost= new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    });
    newPost.save().then(post=> res.json(post));

});


//@route        GET api/posts
//description   Get posts
//access        Public


router.get('/',(req,res)=>{
    const errors={};
    Post.find()
        .sort({date: 'desc'})
        .then(posts=>{
            if(!posts){
                errors.posts = 'No posts found'
                return res.status(404).json(errors)

            }
            res.json(posts)
        })
        .catch(err => {
           errors.posts = 'No posts found'
            return res.status(404).json(errors)
        });

});


//@route        GET api/post/:id
//description   Get post by id
//access        Public
router.get('/:id',(req,res)=>{
    const errors={};
    Post.findById(req.params.id)
        .then(post=>{
            if(!post){
                errors.post = 'No posts found'
                return res.status(404).json(errors)

            }
            res.json(post)
        })
        .catch(err => {
            errors.post = 'No post found with that id'
            return res.status(404).json(errors)
        });

});


//@route        DELETE api/posts/:id
//description   DELETE post by id
//access        Private

router.delete('/:id', passport.authenticate('jwt', { session:false}), (req,res)=>
{
    const errors= { };
    Profile.findOne({user: req.user.id})
    .then(profile=> {
        Post.findById(req.params.id)
            .then(post=> {
                //Check if the owner is the owner of post or not
                if(post.user.toString() !== req.user.id){
                    errors.notAuthorizad= 'User not authorized to delete this post'
                    errors.anotherId =post.user.toString();
                    errors.myId=req.user.id;
                    return res.status(401).json(errors);
                }
                else{
                    post.remove().then(()=>res.json({success: 'True'}))

                }
            } ).catch(err=>{
            errors.postNotFound='No post found'
            res.status(404).json(errors)
        });
    })
});



//@route        POST api/posts/like/:id
//description   Likepost by id
//access        Private

router.post('/like/:id', passport.authenticate('jwt', { session:false}), (req,res)=>
{
    const errors= { };
    Profile.findOne({user: req.user.id})
        .then(profile=> {
            Post.findById(req.params.id)
                .then(post=> {
                    //If the current user has already liked
                    if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
                        errors.alreadyLiked='You already liked this post';
                        return res.status(400).json(errors);
                    }

                    //Add user id to likes array
                    post.likes.unshift({user: req.user.id});
                    post.save().then(post=>res.json(post));

                } ).catch(err=>{
                errors.postNotFound='No post found'
                res.status(404).json(errors)
            });
        })
});

//@route        POST api/posts/unlike/:id
//description   Unlike by id
//access        Private

router.post('/unlike/:id', passport.authenticate('jwt', { session:false}), (req,res)=>
{
    const errors= { };
    Profile.findOne({user: req.user.id})
        .then(profile=> {
            Post.findById(req.params.id)
                .then(post=> {
                    //Check if the current user has already liked
                    if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
                        errors.notLiked='You have not liked this post';
                        return res.status(400).json(errors);
                    }

                    //Get remove index
                    const removeIndex=post.likes.map(item=>item.user.toString()).indexOf(req.user.id);
                    post.likes.splice(removeIndex,1);
                    //Save
                    post.save.then(post=>res.json(post));

                } ).catch(err=>{
                errors.params=req.params.id;
                errors.postNotFound='No post found'
                res.status(404).json(errors)
            });
        })
});

router.post('/comment/:id', passport.authenticate('jwt', {session:false}), (req,res)=>{

    const {errors, isValid} = validatePostInput(req.body);

    //Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post=>{
             const newComment= {
                 text: req.body.text,
                 name: req.body.name,
                 avatar: req.body.avatar,
                 user: req.user.id,
             }
            //Add to comments
            post.comments.unshift(newComment);
            //Save
            post.save().then(post=> res.json(post));
        }).catch(err=>{
        errors.postNotFound='No post found'
        res.status(404).json(errors);
    })


});


//@route        DELETE api/posts/comment/:id/:comment_id
//description   DELETE comment of the Post
//access        Private


router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session:false}), (req,res)=>{

    const errors={};

    Post.findById(req.params.id)

        .then(post=>{
            //Check if the comment that we are trying to delete exist or not
            if(post.comments.filter(comment=>comment._id.toString()===req.params.comment_id)
                    .length===0){
                errors.commentNotFound='No comment found'
                res.status(404).json(errors);
            }
            else{
                const removeIndex=post.comments.map(item=>item._id.toString()).indexOf(req.params.comment_id);
                //Splice it from the array
                post.comments.splice(removeIndex,1 );
                post.save.then(post=>res.json(post));

            }

        }).catch(err=>{
        errors.commentsNotFountd='No comment found'
        res.status(404).json(errors);
    })


});



module.exports=router;
