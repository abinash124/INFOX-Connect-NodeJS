//Load express and routes
const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const keys= require('../../config/keys');
const passport= require('passport');

//Load input validatons
const validateRegisterInput=require('../../validation/register')
const validateLoginInput=require('../../validation/login')


//Load user models
const User= require('../../models/User');

//router.get('/test', (req,res)=>res.json({msg: "My users "}));


//@Route        GET api/users/register
//@Description  Register user
//@access       Public
 router.post('/register',(req,res)=>{

     const {errors, isValid}= validateRegisterInput(req.body);



     //Check first validation
     if(!isValid){
         return res.status(400).json(errors);
     }
     User.findOne({email: req.body.email})
         .then(user=>{
             if(user){
                 errors.email='Email already exists';

                  return res.status(400).json({errors})
             }
             else{

                 //Create a new user creating avatar
                     const avatar=gravatar.url(req.body.email, {
                         s: '200' , // Gravatar size
                         r : 'pg', //Gravatar rating
                         d: 'mm' //Default gravatar
                     })
                     const newUser=new User({
                     name: req.body.name,
                     email:req.body.email,
                     password:req.body.password,
                     avatar

             });

             //Generate encrypted password of length 10
             bcrypt.genSalt(10, (err,salt)=>{
                 bcrypt.hash(newUser.password, salt, (err,hash)=>{
                     if(err)
                         throw err;
                     else {
                         newUser.password = hash;
                         newUser.save()
                             .then(user => res.json(user))
                             .catch(err => console.log(err));
                     }
                 })
             })
             }
         })

 });


//@Route        Post api/users/login
//@Description  Register user/ Return jwt token
//@access       Public

router.post('/login', (req,res)=>{


    const {errors, isValid}= validateLoginInput(req.body);

    //Check first validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email=req.body.email;
    const password= req.body.password;

    //Retrieve the user by email
    //If the user exists in the database check the password using bcrypt

    User.findOne({email})
        .then(user=>{
            errors.email='User not found';
            //Check if user exists
            if(!user){
                return res.status(404).json(errors);
            }

            //Compare passwords of the retrieved user
            bcrypt.compare(password, user.password)
                .then(isMatch=>
                {
                    if(isMatch){
                        //Sign the token and log in the user
                        const payload={
                            id: user.id,
                            name:user.name,
                            avatar: user.avatar
                        }

                        //Sign the token using JWT token
                        jwt.sign(payload, keys.secret, {expiresIn: 36000},
                            (err,token)=> {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token

                            });


                        });
                    }
                    else{
                        errors.password= 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                });

        });

});



//@Route        GET api/users/currentUser
//@Description  Register current user
//@access       Private

router.get('/current', passport.authenticate('jwt',{session:false}), (req,res)=>{
    res.json({
        id: req.user.id,
        name:req.user.name,
        email: req.user.password
    });

}
);
module.exports=router;
