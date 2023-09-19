var con = require('../../../config/database');
var common = require('../../../config/common');

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
                    dob: req.date_of_birth
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
        console.log(doctor_id);
        var insertObject = {
            doctor_id: doctor_id,
            date: req.date,
            start_time: req.start_time,
            end_time: req.end_time,
        };

        // Check if the same availability already exists for the given doctor and time range
        var checkSql = `SELECT * FROM tbl_availability WHERE doctor_id = ? AND date = ? AND start_time = ? AND end_time = ?`;

        con.query(checkSql, [doctor_id, req.date, req.start_time, req.end_time], function (error, results) {
            if (error) {
                console.log(error);
                callback('0', 'rest_keywords_something_wrong', error);
            } else {
                if (results.length > 0) {
                    // Availability with the same time range already exists
                    callback('0', 'Availability schedule already exists');
                } else {
                    // Insert the new availability schedule
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

    getAvailabilitySlote: function(req,callback){
        con.query(`select * from tbl_availability where doctor_id = ${req.user_id} order by date ASC`, function(error,result){
            if(!error){
                let curren_date = new Date()
                filter_result = result.filter(item => item.date >= curren_date)
                callback('1','success',filter_result)
            }else{
                callback('0', 'rest_keywords_something_wrong', null);
            }
        })
    },

    // book_schedule: function (req, patient_id, callback) {
    //     var insertObject = {
    //         doctor_id: req.doctor_id,
    //         patient_id: patient_id,
    //         reason: req.reason,
    //         date: req.date,
    //         start_time: req.start_time,
    //         end_time: req.end_time
    //     };
    //     var sql = `INSERT INTO tbl_book_appointment SET ?`;
    //     con.query(sql, [insertObject], function (error, result) {
    //         if (!error) {
    //             callback('1', 'Appointment scheduled successfully.');
    //         }
    //         else {
    //             callback('0', 'rest_keywords_something_wrong', error);
    //         }
    //     })

    // },

    book_schedule: function (req, user_id, callback) {
        var appointmentTime = req.appointment_date.split(' ')[1];

        var checkExistingAppointmentsSQL = `SELECT * FROM tbl_book_appointment WHERE doctor_id = ? AND patient_id = ? AND DATE(date) = DATE(?) AND TIME(appointment_time) = ? AND is_delete = 0 AND is_active = 1`;

        con.query(checkExistingAppointmentsSQL, [req.doctor_id, user_id, req.date, appointmentTime], function (error3, result3) {
            if (error3) {
                callback('0', 'Error checking existing appointments.', error3);
                return;
            }

            if (result3.length > 0) {
                callback('0', 'appointment already scheduled');
                return;
            }

            var checkDoctorAvailabilitySQL = `SELECT * FROM tbl_availability WHERE is_delete = 0 AND is_active = 1 AND doctor_id = ? AND available_dates = DATE(?) AND ? BETWEEN start_time AND end_time`;

            con.query(checkDoctorAvailabilitySQL, [req.doctor_id, req.appointment_date, appointmentTime], function (error2, result2) {
                if (error2) {
                    callback('0', 'Error checking doctor availability.', error2);
                    return;
                }

                if (result2.length === 0) {
                    callback('0', 'Doctor not available at the selected time.');
                    return;
                }

                var insertObject = {
                    doctor_id: req.doctor_id,
                    patient_id: user_id,
                    appointment_date: req.appointment_date,
                    reason: req.reason
                };
                var insertSQL = `INSERT INTO tbl_book_appointment SET ?`;

                con.query(insertSQL, [insertObject], function (error, result) {
                    if (error) {
                        callback('0', 'Error booking appointment.', error);
                        return;
                    }

                    var id = result.insertId;
                    callback('1', 'Appointment scheduled successfully.', { appointment_id: id });
                });
            });
        });
    },

    //checkAvailability

    checkAvailability: function (request, callback) {
        con.query(
            `SELECT *
          FROM tbl_availability
          WHERE
            is_active = 1
            AND is_delete = 0
            AND doctor_id = ${request.doctor_id}
            AND date = '${request.date}'
            AND start_time <= '${request.start_time}'
            AND end_time >= '${request.end_time}';
          
           `,
            function (error, result) {

                if (error) {
                    callback('0', 'Error occurred', {});
                } else if (result.length === 0) {
                    callback('2', 'No available doctors found for the selected date and time ', {});
                } else {
                    callback('1', 'Data found', result);
                }
            }
        );
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
}
module.exports = auth;