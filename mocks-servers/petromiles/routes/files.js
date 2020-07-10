var express = require('express');
var router = express.Router();
const formidable = require('formidable')
const fs = require('fs')
router.post('/csv-check', function(req, res, next) {
    new formidable.IncomingForm().parse(req, (err, fields, files)=>{
        fs.mkdirSync(__dirname+'/../files', {recursive: true});
        fs.renameSync(files.file.path, __dirname+'/../files/'+files.file.name);
    })
    res.sendStatus(200)
});

module.exports = router;