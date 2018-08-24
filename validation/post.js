const Validator = require('validator');
const isEmpty =require ('./is-empty');

module.exports= function validatePostInput(data){
    let errors={
    }


    data.text= !isEmpty(data.text) ? data.text : '';

    if(!Validator.isLength(data.text,{min:'5', max:'300'})){
       errors.text="Post must be between 5 to 300 characters long";
    }
    if(Validator.isEmpty(data.text)){
        errors.text="Text field cannot be empty";
    }


    return{
        errors,
        isValid : isEmpty(errors)
    }
}