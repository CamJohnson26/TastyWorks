var express = require('express');
var router = express.Router();
var path    = require("path");
var parse = require('csv-parser');
var fs = require('fs');


var stocks = [];
loadData();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(JSON.stringify(stocks));
});

module.exports = router;


function loadData() {
    console.log("Data Loaded");

    stocks = [];

    var testFolder = path.join(__dirname, "../data");

    fs.readdir(testFolder, (err, files) => {
        for (var file in files) {
            console.log(files[file]);

            fs.createReadStream(path.join(testFolder, files[file]))
                .pipe(parse())
                .on('data', function (data) {
                    try {
                        stocks.push({"Symbol": data.Symbol, "Name": data.Name});
                    }
                    catch (err) {
                        console.log(err);
                    }
                })
                .on('end', function () {
                    console.log(stocks.filter((s) => s["Name"].includes("Face")))
                });
        }
    })
}