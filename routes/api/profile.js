const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport= require('passport');


//Load profile models
const Profile= require('../../models/Profile');

//Load users profile
const user= require('../../models/User');

//Load profile validator
const validateProfileData= require('../../validation/profile');

//Load  Experience validator
const validateExperienceInput=require('../../validation/experience');

//Load  Education validator
const validateEducationInput=require('../../validation/education');

//Test route
router.get('/test', (req,res)=>res.json({msg: "My profile"}));





//@Route        GET api/users/profile
//@Description  GET current user profile
//@access       Private

router.get('/',
    passport.authenticate('jwt', {session:false}),
    (req,res)=>
{
    const errors={};
    Profile.findOne({user: req.user.id})
        .populate('user',['name','avatar'])
        .then(profile=>
        {
            if(!profile){
                errors.profileNotFound='Profile not found for user'
                return res.status(404).json(errors);
            }
            return res.json(profile);
        })
        .catch(err=>{
        console.log("Error"+ err)
        return res.status(404).json(err)});
});




//@Route        GET api/users/profile/all
//@Description  GET all the users profile
//@access       Public
router.get('/all',(req,res)=> {
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.profilesNotFound = 'No profile could be found';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        }).catch(error => {
        errors.profilesNotFound = 'There are no profiles'
        res.status(404).json(errors)
    });
});


//@Route        GET api/users/profile/handle/:handle
//@Description  GET the users profile by handle
//@access       Public

router.get('/handle/:handle',(req,res)=>{
    const errors={};
    Profile.findOne({handle: req.params.handle})
    .populate('user',['avatar','name'])
        .then(profile=>{
            if(!profile){
                errors.profileNotFound='Profile with this handle does not exist'
                res.status(404).json(errors)
            }
            else{
                res.json(profile);

            }
        })
        .catch(error=>res.status(404).json(error));


});



//@Route        Get api/users/profile/user/:user_id
//@Description  Get the users profile by user id
//@access       Public

router.get('/user/:user_id',(req,res)=>{
    const errors={};
    Profile.findOne({user: req.params.user_id})
        .populate('user',['avatar','name'])
        .then(profile=>{
            if(!profile){
                errors.profileNotFound='Profile with this user name could not be found'
                res.status(404).json(errors);
            }
            else{
                res.json(profile);
            }
        }).catch(error=>{
            errors.profileNotFound='There is no profile for this user'
            res.status(404).json(errors)});
});


//@Route        POST api/users/profile
//@Description  Create or Update user profile
//@access       Private


router.post('/',
    passport.authenticate('jwt', {session: false}), (req,res)=>

    {

        //Profile validation
        const {errors, isValid}= validateProfileData(req.body);
        //Check validation, if there are errors return errors
        if(!isValid){
            return res.status(400).json(errors);
        }
        //Get all the profile fields

        const profileFields= {};
        profileFields.user=req.user.id;

        if(req.body.handle) profileFields.handle= req.body.handle;
        if(req.body.company) profileFields.company= req.body.company;
        if(req.body.website) profileFields.website= req.body.website;
        if(req.body.location) profileFields.location= req.body.location;
        if(req.body.status) profileFields.status= req.body.status;
        if(req.body.bio) profileFields.bio= req.body.bio;
        if(req.body.githubusername) profileFields.githubusername= req.body.githubusername;

        //For skills, check if the input is defined or not
        //If it is, then split it with ',' and store it in the array
        if(typeof req.body.skills!== 'undefined'){
            profileFields.skills=req.body.skills.split(',');
         }

        //Initialize profileFields.social to empty object. Because social is object that is the collection of social fields

        profileFields.social={};
        if(req.body.youtube) profileFields.social.youtube= req.body.youtube;
        if(req.body.instagram) profileFields.social.instagram= req.body.instagram;
        if(req.body.facebook) profileFields.social.facebook= req.body.facebook;
        if(req.body.linkedin) profileFields.social.linkedin= req.body.linkedin;
        if(req.body.twitter) profileFields.social.twitter= req.body.twitter;


        Profile.findOne({user: req.user.id})
            .then(profile=>{
                if(profile){
                    //Update profile
                    Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new:true})
                        .then(profile=>res.json(profile));
                }
                else{

                    //Since profile does not exist
                    //Create a new profile

                    //Check if handle exists
                    Profile.findOne({ handle : profileFields.handle})
                        .then(profile=>{
                            if(profile){;
                                errors.handle='This handle already exists'
                                res.status(400).json(errors);// Validation error is 400 error
                            }
                            else{
                                new Profile(profileFields).save()
                                    .then(profile=>res.json(profile));

                            }
                        }).catch(errors=> console.log(errors));
                }
            });


    });




//@Route        POST api/profile/experience
//@Description  Add experience of the user in the profile
//@access       Private
router.post('/experience',
            passport.authenticate('jwt', { session: false}),
            (req,res)=>
            {
                const {errors, isValid}= validateExperienceInput(req.body);
                if(!isValid)
                {
                    return res.status(400).json(errors);
                }
                Profile.findOne({user: req.user.id})
                .then(profile=>
                {
                    const errors={}
                    if(!profile)
                    {
                        errors.noProfile='Profile not found';
                        return res.status(404).json(errors);

                    }
                    else {
                        const newExp = {
                            title: req.body.title,
                            company: req.body.company,
                            location: req.body.location,
                            from: req.body.from,
                            to: req.body.to,
                            current: req.body.current,
                            description: req.body.description
                        }
                        //Add to profile
                        profile.experience.unshift(newExp);
                        profile.save().then(profile=>res.json(profile));
                        }

                })


        });


//@Route        POST api/profile/education
//@Description  Add education of the user in the profile
//@access       Private

router.post('/education',
            passport.authenticate('jwt', { session: false}),
            (req,res)=>
            {
                const {errors, isValid}= validateEducationInput(req.body);
                if(!isValid)
                {
                    return res.status(400).json(errors);
                }
                Profile.findOne({user: req.user.id})
                    .then(profile=>
                    {
                        const errors={}
                        if(!profile)
                        {
                            errors.noProfile='Profile not found';
                            return res.status(404).json(errors);

                        }
                        else {
                            const newEdu = {
                                school: req.body.school,
                                degree: req.body.degree,
                                fieldOfStudy: req.body.fieldOfStudy,
                                from: req.body.from,
                                to: req.body.to,
                                current: req.body.current,
                                description: req.body.description
                            }
                            //Add to profile
                            profile.education.unshift(newEdu);
                            profile.save().then(profile=>res.json(profile));
                        }

                    })


            });


      //@Route       DELETE api/profile/experience/:exp_id
//@description DELETE experience from profile
//@access private

router.delete('/experience/:exp_id', passport.authenticate('jwt',{session: false}),
    (req,res)=>{
        Profile.findOne({user: req.user.id}).then(profile=> {

            //Get remove index
            const removeItemIndex=  profile.experience.map(item=>item.id)
                .indexOf(req.params.exp_id);

            //Splice out the array
            profile.experience.splice(removeItemIndex,1);

            //Done removing. Save the pr.ofile
            profile.save().then(profile=> res.json(profile));

        }).catch(err=> res.status(404).json(err));


    });


//@Route       DELETE api/profile/education/:edu_id
//@description DELETE experience from profile
//@access private

router.delete('/education/:edu_id', passport.authenticate('jwt',{session: false}),
    (req,res)=>{
        Profile.findOne({user: req.user.id}).then(profile=> {

            //Get remove index
            const removeItemIndex=  profile.education.map(item=>item.id)
                .indexOf(req.params.edu_id);

            //Splice out the array
            profile.education.splice(removeItemIndex,1);

            //Done removing. Save the pr.ofile
            profile.save().then(profile=> res.json(profile));

        }).catch(err=> res.status(404).json(err));


    });


//@Route       DELETE api/profile
//@description DELETE user and profile
//@access private

router.delete('/', passport.authenticate('jwt',{session: false}),
    (req,res)=>{

        Profile.findOneAndRemove({user: req.user.id}).then( () =>{
            User.findOneAndRemove({_id: req.user.id}).then(()=>{
                res.json({success: 'Succesfully deleted'})
            });

        });


    });


module.exports=router;
