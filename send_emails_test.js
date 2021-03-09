var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

let sendEmails = (params) => {
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  //host: 'mail.authsmtp.com',
  port: 25,
  secure: false,
  ignoreTLS: true,
  auth: {
    user: 'atrodgers77@gmail.com',
    pass: '.......8'
  }
}));

var mailOptions = {
  from: 'atrodgers77@gmail.com',
  to: params.to,
  subject: 'Delv: '+(params.topic?params.topic:'Some survey questions from delv portal team'),
  html: `<h3> <img src="https://front-end-delv.herokuapp.com/static/media/logo.99549d24.png" width="70px" height="40px"/> </h3>
          Hello `+(params.client_name?params.client_name:'delv user')+`, <br/><br/>
          We are carrying out a survey and we would like to know your opinion 
          concerning the topic below. <br/>
          <h3><i>TOPIC: </i> <span><b>`+(params.topic?params.topic:'Not specified.')+`</b></span> </h3>
          Please click on the button below to find and answer
          a few questions. <br/>
          <a href="`+params.link+`">
            <button > Open survey questions now </button>
          </a>
          
          <br/><br/>
          Thank you for supporting delv platform.`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent successfully: ' + info.response);
  }
});
        
}

sendEmails({ to: ['atrodgers7@gmail.com','atrodgers777@gmail.com'],
             link: "http://195.201.136.61:9900/",
             topic:"Some survey questions from delv portal team",
             client_name:null });



