const formidable = require('formidable');
const path = require('path');

const config = require('../../settings');

exports.upload = (req, res, next) => {
  var form = new formidable.IncomingForm(),
  files = [];

  form.parse(req);

  form.on('fileBegin', function (name, file){
    file.path = path.join(config.directory.root, config.directory.public, config.directory.uploads, file.name);
  });

  form.on('file', function (name, file){
    req.file = file;
    req.file.relativePath = path.join(config.directory.uploads, file.name);
    files.push(req.file.relativePath);
    req.files = files;
  });

  form.on('end', function() {
    next();
  });
};