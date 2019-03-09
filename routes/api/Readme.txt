
 General POST architecture
 - For private access authenticate user using Passport.
 - Validate the fields.
 - Create a new Model Object and populate the  model (from request body) ( Reference object by user id )
 - Save the model.
 - Return response.


  General GET secure architecture
 - For private access authenticate user using Passport.
 - Check the database for the information that you are looking for.
 - If found return the information
 - Else return error

 Similar architecture for DELETE Request as well.
