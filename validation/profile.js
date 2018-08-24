const Validator= require('validator');
const isEmpty= require('./is-empty');

module.exports= function validateProfileData(data){
    let errors={};

    data.handle=!isEmpty(data.handle) ? data.handle: '';
    data.status=!isEmpty(data.status) ? data.status: '';
    data.skills=!isEmpty(data.skills) ? data.skills: '';


    if(!Validator.isLength(data.handle, {min:4, max:40}))
    {
        errors.handle='Handle must be between 4 and 40 characters long';
    }

    if(Validator.isEmpty(data.handle)){
        errors.handle='Profile handle field is required';
    }

    if(Validator.isEmpty(data.status)){
        errors.status='Status field is required';
    }

    if(Validator.isEmpty(data.skills)){
        errors.skills='Skills field is required'
    }

    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website='Invalid URL';
        }
    }

    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook='Invalid URL';
        }
    }

    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube='Invalid URL';
        }
    }

    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.instagram='Invalid URL';
        }
    }

    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter='Invalid URL';
        }
    }


    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin='Invalid URL';
        }
    }








    return{
        errors,
        isValid: isEmpty(errors)

    }
}