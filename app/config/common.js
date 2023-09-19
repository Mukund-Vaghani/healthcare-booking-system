var nodemailer = require('nodemailer');
var con = require('../config/database');
var common = {
    sendEmail:function(to_email,subject,message,callback){
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
            });
        
            var mailOptions = {
            from: process.env.EMAIL_ID,
            to: to_email,
            subject: subject,
            html: message
            };
        
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                callback(false);
            } else {
                console.log('Email sent: ' + info.response);
                callback(true)
            }
            });
    },
    checkeUpdateToken:function(id,request,callback){
        var randtoken = require('rand-token').generator();
        var usersession = randtoken.generate(64,"0123456789abcdefghijklmnopqrstuvwxyz");
        con.query(`SELECT * FROM tbl_user_deviceinfo WHERE user_id = ?`,[id],function(error,result){
            if (!error && result.length > 0) {
                var deviceparams = {
                    device_type:(request.device_type!= undefined) ? request.device_type:'A',
                    device_token:(request.device_token!= undefined) ? request.device_token:'0',
                    token:usersession
                }
                con.query(`UPDATE tbl_user_deviceinfo SET ? WHERE user_id = ?`,[deviceparams,id],function(error,result){
                    callback(usersession);
                });
            } else {
                var deviceparams = {
                    device_type:(request.device_type!= undefined) ? request.device_type:'A',
                    device_token:(request.device_token!= undefined) ? request.device_token:'0',
                    token:usersession,
                    user_id:id
                };
                con.query(`INSERT INTO tbl_user_deviceinfo SET ?`,[deviceparams],function(error,result){
                    callback(usersession);
                });
            }
        });
    },
    randomOtpGenerate:function(){
        // return Math.floor(1000 + Math.random() * 9000);
        return '1234';
    },
    
};
module.exports = common;