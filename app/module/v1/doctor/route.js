var express = require('express');
var router = express.Router();
var auth = require('./doctor_model');
const middleware = require('../../../middleware/middleware');

//DOCTOR SIGN UP
// SIGN UP
router.post('/register', function (req, res) {
    let request = req.body;
    console.log("request",request)
    // middleware.decryption(req.body, function (request) {
    const rules = {
        fname: "required",
        lname: "required",
        email: "required",
        role: "required",
        password: "required",
        date_of_birth: "required",
        address: "required",
        speciality: "required_if:role,D"
    };
    const message = {
        required: req.language.rest_keywords_required_messages,
    };
    if (middleware.checkValidationRules(request, res, rules, message)) {
        auth.signup(request, function (code, message, data) {
            middleware.sendResponse(req, res, code, message, data);
        });
    };
    // });
});

//LOG IN
router.post('/login', function (req, res) {
    // middleware.decryption(req.body, function (request) {
    let request = req.body;
    const rules = {

        email: "required",
        password: "required"
    };
    const message = {
        required: req.language.rest_keywords_required_messages
    };
    if (middleware.checkValidationRules(request, res, rules, message)) {
        auth.login(request, function (code, message, data) {
            middleware.sendResponse(req, res, code, message, data);
        });
    };
    // });
});

//USER DETAIL
router.post('/getprofile', function(req,res){
    auth.userDetails(req,function(code,message,data){
        middleware.sendResponse(req,res,code,message,data);
    })
})


//ADD AVAILABILITY SCHEDULE
router.post('/add_availability_Schedule', function (req, res) {
    let request = req.body;
    var doctor_id = req.user_id
    const rules = {
        date: "required",
        start_time: "required",
        end_time: "required",
    };
    const message = {
        required: req.language.rest_keywords_required_messages
    };
    if (middleware.checkValidationRules(request, res, rules, message)) {
        auth.add_availability_Schedule(request, doctor_id, function (code, message, data) {
            middleware.sendResponse(req, res, code, message, data);
        });
    };
});

// To check availability Slot
router.post('/get_availability_slote', function(req,res){
    auth.getAvailabilitySlote(req,function(code,message,data){
        middleware.sendResponse(req,res,code,message,data);
    })
});

//checkavailablity
router.post('/checkavailablity', function (req, res) {
    // middleware.decryption(req.body, function (request) {
    let request = req.body;
    request.user_id = req.user_id;

    const rules = {
        date: "required",
        appointment_time: "required",
    };

    const message = {
        required: req.language.rest_keywords_required_messages
    };

    if (middleware.checkValidationRules(request, res, rules, message)) {
        auth.checkAvailability(request, function (code, message, data) {
            middleware.sendResponse(req, res, code, message, data);
        });
    };
    // });
});

//docterlisting

router.post('/docterlisting', function (req, res) {
    // middleware.decryption(req.body, function (request) {
    let request = req.body;

    const rules = {

    };

    const message = {
        required: req.language.rest_keywords_required_messages
    };

    if (middleware.checkValidationRules(request, res, rules, message)) {
        auth.docterlisting(function (code, message, data) {
            middleware.sendResponse(req, res, code, message, data);
        });
    };
    // });
});

//LOG OUT
router.post('/logout', function (req, res) {
    auth.logOut(req, function (code, message, data) {
        middleware.sendResponse(req, res, code, message, data);
    });
});

// BOOK DOCTOR
router.post('/bookdoctor', function (req, res) {
    // middleware.decryption(req.body, function (request) {
    let request = req.body;
    request.user_id = req.user_id;

    const rules = {
        reason:"required",
        doctor_id:"required",
        appointment_date: "required",
        appointment_time: "required",
    };

    const message = {
        required: req.language.rest_keywords_required_messages
    };

    if (middleware.checkValidationRules(request, res, rules, message)) {
        auth.bookDoctor(request, function (code, message, data) {
            middleware.sendResponse(req, res, code, message, data);
        });
    };
    // });
});



//User Dashboard
router.post('/user_dashboard', function (req, res) {
    auth.userDashboard(req, function (code, message, data) {
        middleware.sendResponse(req, res, code, message, data);
    });
});


module.exports = router;