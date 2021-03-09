

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
  subject: 'Some survey questions from delv portal',
  html: `<h3> <img src="https://front-end-delv.herokuapp.com/static/media/logo.99549d24.png" width="70px" height="40px"/> </h3>
          Hello delv user, <br/><br/>
          We are carrying out a survey and we would like to know your opinions 
          concerning the above topic. <br/>
          Please click on the button below to find and answer
          a few questions. <br/>
          <a href="`+params.link+`">
            <button > Open survey questions now </button>
          </a>
          
          <br/><br/>
          Thank you for supporting delv platform.
          `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent successfully: ' + info.response);
  }
});
        
}         

module.exports = { sendEmails };
        
