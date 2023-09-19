var template = {
    otpVerification:function(result,callback){
    var template = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Verification OTP Email</title>
    </head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
                <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
                    <img src="https://drive.google.com/file/d/1rER5YaOxPhFatTlGJSULRRNZA5ZVzXHb/view?usp=share_link" alt="Logo" width="150">
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="font-size: 24px; font-weight: bold;">Verify your account</td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 30px 0;">Thank you for signing up for our service. To verify your account, please use the following One-Time Password (OTP):</td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px 0 30px 0; font-size: 32px; font-weight: bold; border: 1px solid #000000; border-radius: 10px;">${result.otp}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0 0 30px 0;">Please enter this OTP in the verification field to complete the registration process. This OTP is valid for 10 minutes only. If you did not sign up for this service, please ignore this email.</td>
                        </tr>
                        <tr>
                            <td align="center">
                                <a href="https://example.com/verify" style="background-color: #000000; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#000000" style="padding: 30px 30px 30px 30px; color: #ffffff; text-align: center; font-size: 14px;">If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #ffffff;">support@example.com</a></td>
            </tr>
        </table>
    </body>
    </html>
    `
    callback(template)
},
forgotPassword:function(result,callback){
    // console.log(result);
    var template = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>
                Reset Password
            </title>
            <style>
                body {
                    background-color: #f7f7f7;
                    font-family: Arial, sans-serif;
                }
                .container {
                    margin: 0 auto;
                    max-width: 600px;
                    padding: 20px;
                }
                h1 {
                    color: #333;
                    font-size: 24px;
                    font-weight: normal;
                    margin-bottom: 20px;
                }
                p {
                    color: #666;
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .button {
                    background-color: #1a73e8;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    display: inline-block;
                    font-size: 16px;
                    font-weight: bold;
                    padding: 12px 24px;
                    text-align: center;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #0d47a1;
                }
            </style>
        </head>
            <body>
                <div class="container">
                    <h1>Reset Your Password</h1>
                    <p>Hi ${result[0].full_name},</p>
                    <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
                    <p>To reset your password, please click the button below:</p>
                    <p><a href="http://localhost:8597/v1/auth/reset/${result[0].id}" class="button">Reset Password</a></p>
                    <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                    <p>"http://localhost:8597/v1/auth/reset/${result[0].id}"</p>
                    <p>If you have any questions or concerns, please contact us at hyperlink.infosystem@gmail.com.</p>
                    <p>Thanks,</p>
                    <p>Hyperlink Team</p>
                </div>
            </body>
    </html>
    `;
    callback(template)
},
};
module.exports = template;