const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASS
    }
})

const sendMail = async(email,subject,content)=>{
    try{
        var mailOptions = {
            from:process.env.SMTP_MAIL,
            to:email,
            subject:subject,
            html:content

        }
        transporter.sendMail(mailOptions,(error,info)=>{

            if(error){
                console.log(error);
            }
            console.log('Mail has been sent',info.messageId); // jab v mail send hota hai to usme ek message id hote hai 

        })

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    sendMail
}