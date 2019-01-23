const formidable = require('formidable');
const path = require('path');

exports.upload = (req, res, next) => {
  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file){
    file.path = path.join(__dirname, '../static/uploads/', file.name);
  });

  form.on('file', function (name, file){
    req.file = file;
    req.file.relativePath = path.join('../uploads/', file.name);
    next();
  });
};