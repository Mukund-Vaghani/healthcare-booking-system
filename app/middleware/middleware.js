var Validator = require('Validator');
const {
    default: localizify
} = require('localizify');
const en = require('../language/en');
const guj = require('../language/guj');
const {
    t
} = require('localizify');
var con = require('../config/database');

var cryptoLib = require('cryptlib');
var shakey = cryptoLib.getHashSha256(process.env.KEY, 32);

var middleware = {
    //FOR VALIDATION
    checkValidationRules: function (request, res, rules, message) {
        const v = Validator.make(request, rules, message);
        if (v.fails()) {
            const errors = v.getErrors();
            for (var key in errors) {
                var error = errors[key][0];
                var response_data = {
                    code: '0',
                    message: error,
                };
                break;
            };
            var response_data = {
                code: '0',
                message: error
            };
            // middleware.encryption(response_data, function (response) {
                res.send(response_data);
            // });
            return false;
        } else {
            var response_data = {
                code: '1',
                message: "success"
            };
            return true;
        };
    },
    // GET RESPONSE
    sendResponse: function (req, res, code, message, data) {
        this.getMessage(req.lang, message, function (translated_message) {
            if (data == null) {
                response_data = {
                    code: code,
                    message: translated_message
                };
                // middleware.encryption(response_data, function (response) {
                    res.status(200);
                    res.send(response_data);
                // });
            } else {
                response_data = {
                    code: code,
                    message: translated_message,
                    data: data
                };
                // middleware.encryption(response_data, function (response) {
                    res.status(200);
                    res.send(response_data);
                // });
            };
        });
    },
    //FOR LANGUAGE MESSAGE EXTRACTION
    getMessage: function (language, keywords, callback) {
        localizify
            .add('en', en)
            .add('guj', guj)
            .setLocale(language)
        callback(t(keywords));
    },
    //FOR EXTRACT LANGUAGE OF HEADER
    extractHeaderLanguage: function (request, response, callback) {
        var headerlang = (request.headers['accept-language'] != undefined && request.headers['accept-language'] != "") ? request.headers['accept-language'] : 'en';
        request.lang = headerlang;
        request.language = (headerlang == 'en') ? en : guj;

        callback();
    },
    //FOR VALIDATION OF API-KEY
    validateApiKey: function (req, res, callback) {
        var end_point = req.path.split('/'); //get end point of url
        var uni_end_point = new Array("reset", "resetpass") //make new array
        var api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != "") ? req.headers['api-key'] : '';

        if (uni_end_point.includes(end_point[3])) {
            callback();
        } else {
            if (api_key != "") {
                var decrypt_api_key = api_key;
                // console.log("API Key : ", decrypt_api_key)
                if (decrypt_api_key != '' && decrypt_api_key == process.env.API_KEY) {
                    callback();
                } else {
                    response_data = {
                        code: "0",
                        message: req.language.rest_keywords_valid_api_key
                    };
                    // middleware.encryption(response_data, function (response) {
                        res.status(401);
                        res.send(response);
                    // });
                };
            } else {
                response_data = {
                    code: "0",
                    message: req.language.rest_keywords_valid_api_key
                };
                // middleware.encryption(response_data, function (response) {
                    res.status(401);
                    res.send(response);
                // });
            };
        };

    },
    //FOR VALIDATION OF HEADER-TOKEN
    validateHeaderToken: function (req, res, callback) {
        var end_point = req.path.split('/');
        // console.log(end_point);
        var uni_end_point = new Array("register", "login", "forgotpassword", "reset", "resetpass");
        var header_token = (req.headers['token'] != undefined && req.headers['token'] != "") ? req.headers['token'] : '';

        if (uni_end_point.includes(end_point[3])) {
            callback();
        } else {
            if (header_token != "") {

                var decrypt_header_token = header_token;
                // var decrypt_header_token = cryptoLib.decrypt(header_token, shakey, process.env.IV);

                if (decrypt_header_token != '') {
                    con.query(`SELECT * FROM tbl_user_deviceinfo WHERE token = ?`, [decrypt_header_token], function (error, result) {
                        if (!error && result.length > 0) {
                            req.user_id = result[0].user_id;
                            callback();
                        } else {
                            response_data = {
                                code: "0",
                                message: req.language.rest_keywords_valid_token
                            };
                            // middleware.encryption(response_data, function (response) {
                                res.status(401);
                                res.send(response_data);
                            // });
                        };
                    });
                } else {
                    response_data = {
                        code: "0",
                        message: req.language.rest_keywords_valid_token
                    };
                    // middleware.encryption(response_data, function (response) {
                        res.status(401);
                        res.send(response_data);
                    // });
                };
            } else {
                response_data = {
                    code: "0",
                    message: req.language.rest_keywords_valid_token
                };
                middleware.encryption(response_data, function (response) {
                    res.status(401);
                    res.send(response_data);
                });
            }
        };
    },

    // DECRYPTION FUNCTION
    decryption: function (encrypted_text, callback) {
        if (encrypted_text != undefined && Object.keys(encrypted_text).length !== 0) {
            try {
                var response = JSON.parse(cryptoLib.decrypt(encrypted_text, shakey, process.env.IV));
                callback(response);
            } catch (error) {
                console.log(error);
                callback({});
            };
        } else {
            callback({});
        };
    },
    // encryption function
    encryption: function (response_data, callback) {
        var response = cryptoLib.encrypt(JSON.stringify(response_data), shakey, process.env.IV);
        callback(response);
    },
};
module.exports = middleware;