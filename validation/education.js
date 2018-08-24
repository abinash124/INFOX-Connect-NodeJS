const Validator = require('validator');
const isEmpty =require ('./is-empty');

module.exports= function validateEducationInput(data){
    let errors={
    }


    data.school= !isEmpty(data.school) ? data.school : '';
    data.fieldOfStudy= !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
    data.from= !isEmpty(data.from) ? data.from : '';


    if(Validator.isEmpty(data.school)){
        errors.school="School field is required"
    }


    if(Validator.isEmpty(data.fieldOfStudy)){
        errors.fieldOfStudy="Field of study field is required"
    }


    if(Validator.isEmpty(data.from)){
        errors.from="From date is required"
    }



    return{
        errors,
        isValid : isEmpty(errors)
    }
}