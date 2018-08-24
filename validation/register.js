const Validator = require('validator');
const isEmpty =require ('./is-empty');

module.exports= function validateRegisterationInput(data){
    let errors={
    }

    data.name= !isEmpty(data.name) ? data.name : '';
    data.email= !isEmpty(data.email) ? data.email : '';
    data.password= !isEmpty(data.password) ? data.password : '';
    data.confirmPass= !isEmpty(data.confirmPass) ? data.confirmPass : '';

    if(!Validator.isLength(data.name, {min: 2, max:30}))
    {
        errors.name="Name must be between 2 and 30 characters"
    }

    if(Validator.isEmpty(data.name)){
        errors.name="Name field cannot be empty";
    }

    if(Validator.isEmpty(data.email)){
        errors.email="Email field cannot be empty";
    }

    if(!Validator.isEmail(data.email)){
        errors.email="Email is invalid";
    }

    if(Validator.isEmpty(data.password)){
        errors.password="Password field cannot be empty"
    }

    if(!Validator.isLength(data.password,{min:6, max:30})) {
        errors.password = "Password must be between 6 to 30 characters long"

    }

    if(Validator.isEmpty(data.confirmPass)){
        errors.confirmPass="Confirm password field cannot be empty"
    }

    if(!Validator.equals(data.password,data.confirmPass)){
        errors.confirmPass="Passwords must match"
    }

    return{
        errors,
        isValid : isEmpty(errors)
    }
}