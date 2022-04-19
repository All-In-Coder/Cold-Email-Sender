const express = require('express')
const { spawn } = require('child_process');
const app = express()
const port = 3000
const path = require("path")
var multer = require('multer');
const fs = require('fs');
const { parse } = require('fast-csv');


let FILE_NAME;

function send_email_util(res, email) {
    // spawn new child process to call the python script
    const python = spawn('python', ['main.py', email]);

    // collect data from script
    python.stdout.on('data', function (data) {
    });

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    });
}

function send_email(res) {
    let rows = [];

    fs.createReadStream(path.resolve(__dirname + '\\uploads', FILE_NAME))
        .pipe(parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            send_email_util(res, row["emailid"]);
        })
}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        console.log(file.mimetype.substring(5));
        let ext = file.mimetype.split("/");
        console.log(ext[1]);

        var fileName = ext[1] == "csv" ? "mailID" : "Resume";
        FILE_NAME = fileName + "." + ext[1];

        cb(null, fileName + "." + ext[1])
    }
})


// For uploading csv to the upload folder
var uploadCSV = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(req.filetypes);
        console.log(file.filetypes);
        var filetypes = /csv|pdf/;
        var mimetype = filetypes.test(file.mimetype);
        console.log(file.mimetype);
        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // mypic is the name of file attribute
}).single("csv");


// For uploading resume to the upload folder
var uploadResume = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(req.filetypes);
        console.log(file.filetypes);
        var filetypes = /csv|pdf/;
        var mimetype = filetypes.test(file.mimetype);
        console.log(file.mimetype);
        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // mypic is the name of file attribute
}).single("resume");



// Methods

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html')
})

app.get('/uploadCSV', (req, res) => {

    res.sendFile(__dirname + '/show.html')
})

app.post('/sendEmail', (req, res) => {
    console.log(req.body);
    uploadCSV(req, res, function (err) {

        if (err) {
            res.send(err)
        }
        else {
            send_email(res);
            res.sendFile(__dirname + '/index.html');
        }
    })
})



app.get("/uploadResume", (req, res) => {
    res.sendFile(__dirname + '/uploadResume.html')
})

app.post('/uploadResume', (req, res) => {
    uploadResume(req, res, function (err) {

        if (err) {
            res.send(err)
        }
        else {
            res.sendFile(__dirname + '/index.html');
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port 
${port}!`))