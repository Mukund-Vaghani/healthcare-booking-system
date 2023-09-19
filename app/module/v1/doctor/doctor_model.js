var con = require('../../../config/database');
var common = require('../../../config/common');
var moment = require('moment')

var auth = {
    signup: function (req, callback) {
        console.log(req);
        auth.checkEmail(req, function (isExist) {
            if (isExist) {
                callback('0', 'rest_keywords_unique_email', null)
            } else {
                var insertObject = {
                    first_name: req.fname,
                    last_name: req.lname,
                    email: req.email,
                    role: req.role,
                    password: req.password,
                    speciality: (req.speciality != '' && req.speciality != undefined) ? req.speciality : '',
                    address: req.address,
                    dob: req.date_of_birth,

                };
                var sql = `INSERT INTO tbl_user SET ?`;
                con.query(sql, [insertObject], function (error, result) {
                    if (!error) {
                        var id = result.insertId;
                        common.checkeUpdateToken(id, req, function (token) {
                            auth.getUserDetails(id, function (userDetails) {
                                if (userDetails != null) {
                                    callback('1', 'rest_keywords_sign_up', userDetails);
                                } else {
                                    callback('0', 'rest_keywords_data_not_found', null);
                                };
                            });
                        });
                    } else {
                        callback('0', 'rest_keywords_something_wrong', error);
                    };
                });
            };
        });
    },

    checkEmail: function (req, callback) {
        var sql = `SELECT * FROM tbl_user WHERE email = ? AND is_active = 1 AND is_deleted = 0`;
        con.query(sql, [req.email], function (error, result) {
            if (!error && result.length > 0) {
                callback(true);
            } else {
                callback(false);
            };
        });
    },

    getUserDetails: function (id, callback) {
        var sql = `SELECT tu.*,IFNULL(di.token,'') as tokens FROM tbl_user tu LEFT JOIN tbl_user_deviceinfo di ON tu.id = di.user_id WHERE tu.id = ? AND tu.is_active = 1 AND tu.is_deleted=0`;
        con.query(sql, [id], function (error, result) {
            if (!error && result.length > 0) {
                callback(result[0]);
            } else {
                console.log(error);
                callback(null);
            };
        });
    },

    login: function (req, callback) {
        auth.checkEmail(req, function (isExist) {
            if (isExist) {
                var sql = `SELECT * FROM tbl_user WHERE email = ? AND is_active = 1 AND is_deleted=0`;
                con.query(sql, [req.email], function (error, result) {

                    if (!error && result.length > 0) {
                        if (result[0].password == req.password) {
                            common.checkeUpdateToken(result[0].id, req, function (token) {
                                auth.getUserDetails(result[0].id, function (userDetails) {
                                    callback('1', 'rest_keywords_loggedin', userDetails);
                                });
                            });
                        } else {
                            callback('0', 'rest_keywords_wrong_password', null);
                        };
                    } else {
                        callback('0', 'rest_keywords_wrong_email', null);
                    };
                });
            } else {
                callback('0', 'rest_keywords_not_signup', null);
            };
        });
    },

    add_availability_Schedule: function (req, doctor_id, callback) {
        let start_time = moment(req.start_time).format('HH:mm:ss');
        let end_time = moment(req.end_time).format('HH:mm:ss');
        var insertObject = {
            doctor_id: doctor_id,
            date: req.date,
            start_time: start_time,
            end_time: end_time,
        };

        var checkSql = `SELECT * FROM tbl_availability WHERE doctor_id = ? AND date = ? AND start_time = ? AND end_time = ?`;

        con.query(checkSql, [doctor_id, req.date, req.start_time, req.end_time], function (error, results) {
            if (error) {
                callback('0', 'rest_keywords_something_wrong', error);
            } else {
                if (results.length > 0) {
                    callback('0', 'Availability schedule already exists');
                } else {
                    var sql = `INSERT INTO tbl_availability SET ?`;
                    con.query(sql, [insertObject], function (insertError, insertResult) {
                        if (insertError) {
                            console.log(insertError);
                            callback('0', 'rest_keywords_something_wrong', insertError);
                        } else {
                            callback('1', 'Availability schedule added successfully');
                        }
                    });
                }
            }
        });
    },

    getAvailabilitySlote: function (req, callback) {
        con.query(`select * from tbl_availability where doctor_id = ${req.user_id} order by date ASC`, function (error, result) {
            if (!error) {
                let curren_date = moment().format("YYYY-MM-DD");
                filter_result = result.filter(item => item.date >= curren_date)
                callback('1', 'success', filter_result);
            } else {
                callback('0', 'rest_keywords_something_wrong', null);
            }
        })
    },

    //checkAvailability
    checkAvailability: function (request, callback) {
        con.query(`SELECT a.*,(SELECT CONCAT(u.first_name,' ',u.last_name) FROM tbl_user AS u WHERE u.id = a.doctor_id) AS doctor_name FROM tbl_availability AS a WHERE a.is_active = 1 AND a.is_delete = 0 AND a.date = '${request.date}' AND ('${request.appointment_time}' BETWEEN a.start_time AND a.end_time) AND a.booked = 0`, function (error, result) {
            if (error) {
                callback('0', 'Error occurred', {});
            } else if (result.length === 0) {
                callback('2', 'No available doctors found for the selected date and time ', {});
            } else {
                callback('1', 'Data found', result);
            };
        });
    },

    //docterlisting

    docterlisting: function (callback) {
        con.query(
            `SELECT * FROM tbl_user WHERE is_active = 1 AND is_deleted = 0 AND role = 'docter'`,
            function (error, result) {
                if (error) {
                    callback('2', 'Error occurred', {});
                } else if (result.length === 0) {
                    callback('0', 'No data found', {});
                } else {
                    callback('1', 'Data found', result);
                }
            }
        );
    },

    logOut: function (req, callback) {
        con.query(`UPDATE tbl_user_deviceinfo SET token = '' WHERE user_id = ${req.user_id}`, function (err, result) {
            if (!err) {
                callback('1', 'rest_keywords_logout', null);
            } else {
                callback('0', 'rest_keywords_nodata', null);
            };
        });
    },

    userDetails: function (req, callback) {
        con.query(`SELECT * FROM tbl_user WHERE id = ${req.user_id} AND is_active = 1 AND is_deleted = 0`, function (err, result) {
            if (!err) {
                callback('1', 'rest_keywords_success', result[0])
            } else {
                callback('0', 'rest_keywords_nodata', null);
            };
        });
    },

    // BOOK DOCTOR FUNCTION
    bookDoctor: function (req, callback) {
        var appointment_date = moment(req.appointment_date).format('YYYY-MM-DD');

        let insertObject = {
            doctor_id: req.doctor_id,
            patient_id: req.user_id,
            date: appointment_date,
            appointment_time: req.appointment_time,
            reason: req.reason,
        };

        con.query(`INSERT INTO tbl_book_appointment SET ?`, [insertObject], function (err, result) {
            if (!err) {
                con.query(`UPDATE tbl_availability SET booked = 1 WHERE doctor_id = ${req.doctor_id} AND date = '${appointment_date}' AND start_time = '${req.appointment_time}'`, function (err, result) {
                    if (!err) {
                        callback('1', 'Appointment scheduled successfully.!', null);
                    } else {
                        callback('0', 'rest_keywords_something_wrong', null);
                    };
                });
            } else {
                callback('0', 'rest_keywords_something_wrong', null);
            };
        });
    },

    // USER DASHBOARD FUNCTION
    userDashboard: function(req, callback){
        let sql = ``;
        if(req.body.filter){
            if(req.body.filter == 'past'){
                sql = ` a.date < CURRENT_DATE`;
            } else {
                sql = ` a.date >= CURRENT_DATE`;
            };
            con.query(`SELECT *,(SELECT CONCAT(u.first_name,' ',u.last_name) FROM tbl_user AS u WHERE u.id = a.doctor_id) AS doctor_name FROM tbl_book_appointment AS a WHERE ${sql}`,function(err,result){
                console.log(err);
                if(!err && result.length > 0){
                    callback('1','rest_keywords_success',result);
                } else {
                    callback('0','No Appointment found!!',null);
                };
            });
        } else {
            con.query(`SELECT (SELECT COUNT(id) WHERE date < CURRENT_DATE) AS past_count,(SELECT COUNT(id) WHERE date >= CURRENT_DATE) AS scheduled_count FROM tbl_book_appointment WHERE patient_id = ${req.user_id}`,function(err, result){
                if (!err) {
                    callback('1','rest_keywords_success',result);
                } else {
                    callback('0','No Data Found!',null);
                };
            });
        };
    },

    appointment_count: function (req, callback) {
        con.query(`SELECT IFNULL((SELECT COUNT(id) WHERE date < CURRENT_DATE),0) AS past_count,IFNULL((SELECT COUNT(id) WHERE date >= CURRENT_DATE),0) AS scheduled_count FROM tbl_book_appointment WHERE patient_id = ${req.user_id}`, function (err, result) {
            if (!err) {
                callback('1', 'rest_keywords_success', result);
            } else {
                callback('0', 'No Data Found!', null);
            };
        });
    },
}
module.exports = auth;