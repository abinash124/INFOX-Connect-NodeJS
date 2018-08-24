//Load express and routes
const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const keys= require('../../config/keys');
const passport= require('passport');


const validateLoginInput=require('../../validation/login')
const validateEventPost=require('../../validation/eventpost');

const EventPost= require('../../models/EventPost');



//Load user models
const User= require('../../models/User');


//@Route POST api/users/admin
//@Description Register Admin
//@access Public

router.post('/login`', (req,res)=>{
    const {errors,isValid}= validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
        const email=req.body.email;
        const password=req.body.password;
    }
    User.find({email})
        .then(user=>{
            if(!user){
                errors.email="Email not registered at all";
                res.status(400).json(errors);
            }
            else if(user.isAdmin!=ture){
                errors.email="Not authorized";
                res.status(401).json(errors);
            }
            else {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            //Sign the token and log in the user
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            }

                            //Sign the token using JWT token
                            jwt.sign(payload, keys.secret, {expiresIn: 36000},
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token

                                    });


                                });
                        }
                        else {
                            errors.password = 'Password incorrect';
                            return res.status(400).json(errors);
                        }
                    });
            }

        });

});

//@Route POST api/admin/post-event
//@Description post-event
//@access Private
router.post('/post-event',passport.authenticate('jwt',{session:false}), (req,res)=>{
    const {errors,isValid} = validateEventPost(req.body);
    if(!isValid){
        return res.status(404).json(errors);
    }
    if(!req.user.isAdmin){
        errors.user="Not authorized";
        res.status(401).json(errors);

    }
    else{
        const newEventPost= new EventPost({
            user:req.user.id,
            eventName: req.body.eventName,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            date: req.body.date

        });
        newEventPost.save().then(eventpost=> res.json(eventpost));
    }

});

//@Route POST api/admin/update-event
//@Description delete-event
//@access Private

router.post('/delete-event/:id',passport.authenticate('jwt',{session: false}, (req,res)=>{
    if(req.user.isAdmin){
        EventPost.findById(req.params.id)
            .then(eventpost=>{
                eventpost.remove()

            })
    }

}))

