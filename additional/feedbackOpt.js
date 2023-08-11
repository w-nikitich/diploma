// const nodemailer = require('nodemailer');

// const sendEmail = async (text) => {
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.ukr.net',
//         port: 465,
//         auth: {
//             user: 'diplomnaprojectvsha@ukr.net',
//             pass: 'PQ5KmdL2kd076omH'
//         }
//     })

//     const mailOptions = {
//         from: 'diplomnaprojectvsha@ukr.net',
//         to: 'shtoler02va@gmail.com',
//         subject: 'Feedback',
//         text: text
//     }

//     transporter.sendMail(mailOptions, function (err, info) {
//         if (err) {
//             console.error(err)
//         }
//         else {
//             console.log(info)
//         }
//     })
// }

// module.exports = {sendEmail};