const Validator = require('validator');
const isEmpty =require ('./is-empty');

module.exports= function validateEventPostInput(data){
    let errors={
    }


    data.eventName= !isEmpty(data.eventName) ? data.eventName : '';
    data.description= !isEmpty(data.description) ? data.description : '';
    data.category= !isEmpty(data.category) ? data.category : '';
    data.location= !isEmpty(data.location) ? data.location : '';
    data.date= !isEmpty(data.date) ? data.date : '';


    if(!Validator.isLength(data.eventName,{min:'4', max:'20'})){
        errors.eventName="Event name must be between 4 to 20 characters long";
    }

    if(!Validator.isLength(data.description,{min:'10', max:'300'})){
        errors.description="Description must be between 10 to 300 characters long";
    }



    if(Validator.isEmpty(data.eventName)){
        errors.eventName="Event Name field cannot be empty";
    }
    if(Validator.isEmpty(data.description)){
        errors.description="Description field cannot be empty";
    }
    if(Validator.isEmpty(data.category)){
        errors.category="Category field cannot be empty";
    }
    if(Validator.isEmpty(data.location)){
        errors.location="Location field cannot be empty";
    }
    if(Validator.isEmpty(data.date)){
        errors.date="Date field cannot be empty";
    }


    return{
        errors,
        isValid : isEmpty(errors)
    }
}