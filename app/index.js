require('dotenv').config();

var express = require('express');

var app = express();

let cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

var doctor = require('./module/v1/doctor/route');

app.use('/', require('./middleware/middleware.js').extractHeaderLanguage);

app.use('/', require('./middleware/middleware.js').validateApiKey);

app.use('/', require('./middleware/middleware.js').validateHeaderToken);

app.use('/v1/doctors', doctor);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

try {
    app.listen(process.env.PORT);
    console.log("Database connected successfully at :", process.env.PORT);
} catch (error) {
    console.log("Database connection failed!!", error);
};
