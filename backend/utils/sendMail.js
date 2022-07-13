const nodeMailer = require("nodemailer")
const sendMail = async(option)=>{
    const transporter = nodeMailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_USER,
            pass:process.env.SMPT_PASSWORD,
        }
    })
    const mailOption = {
        from:process.env.SMPT_USER,
        to:option.email,
        subject:option.subject,
        text:option.message,
    }

    transporter.sendMail(mailOption)
}
module.exports = sendMail;