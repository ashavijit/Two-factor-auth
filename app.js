const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('express-handlebars');
const app = express();

app.engine ('hbs', hbs.engine({
    viewEngine: 'express-hbs',
    extName: '.hbs',
    defaultLayout: false,
    layoutsDir: path.resolve('views/'),
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public',express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('contact');
});

var email;
var otp= Math.random();
otp = otp * 1000000;
otp= parseInt(otp);
console.log(otp);


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    service: 'gmail',
    auth: {
        user: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
        pass: 'XXXXXXXXXXXXXXXXX'

    } 


});

app.post('/send', (req, res) => {
    email = req.body.email;
    const mailOptions = {
        from: 'Avijit Sen',
        to: email,
        subject: 'OTP',
        text: 'Your OTP is ' + otp
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('otp');
    });
});

app.post('/verify', (req, res) => {
    var otp1 = req.body.otp;
    if (otp1 == otp) {
        res.render('success');
    }
    else {
        res.render('failure');
    }
});

app.post('/resend',function(req,res){
    var mailOptions={
        to: email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('otp',{msg:"otp has been sent"});
    });

});





const PORT = process.env.PORT || 3000;
app.listen(PORT,
     () => console.log(`Server started on port ${PORT}`));