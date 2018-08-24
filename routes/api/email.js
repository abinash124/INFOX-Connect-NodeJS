/*const express=require('express');
const router=express.Router();


    //@route        POST api/email
    //description   Send Email to other developers
    //access        Private

router.post('/email',(req,res)=>{
    const msg= ` 
    <p> InfoX email </p>
    <h3>Email Details</h3>
    <ul>
         <li> Name:  {req.body.name} </li>
         <li> Address: {req.body.address}</li>
         <li> Email: {req.body.email} </li>
     </ul>
     <h3> Message: {req.body.description}</h3>`

    const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: gmail,
            auth : {
                xoauth2: xoauth2.createXOAuth2Generator({
                    user: req.body.email,
                    clientId: '92706879050-k28bi8hc7o119cvjbp7mi9e1g3jr757n.apps.googleusercontent.com',
                    clientSecret: '6rPYhUEUQJLn6N8hBeOe9_3F',
                    refreshToken: ''
                })
        }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'req.body.name <req.body.email>', // sender address
            to: 'bhattarai.abinash@gmail.com', // list of receivers
            subject: 'Email from client', // Subject line
            text: 'Email', // plain text body
            html: msg // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
});

*/


