
var mime = require('mime');

/*
Takes in data and a filename and returns a file for download
{
    data: string,
    filename: string
}
*/
exports.downloadData = function(req, res) {
    var data = req.body.data;
    var filename = req.body.filename;
    var mimeType = mime.lookup(filename)
    var safeFilename = filename.replace(/\s+/g,'-');
    
    res.setHeader('Content-disposition', 'attachment; filename='+safeFilename);
    res.setHeader('Content-type', 'text/html');
    res.send(data);
}