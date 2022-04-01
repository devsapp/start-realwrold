var getRawBody = require('raw-body');
var getFormBody = require('body/form');
var body = require('body');


/*
To enable the initializer feature (https://help.aliyun.com/document_detail/156876.html)
please implement the initializer function as below：
exports.initializer = (context, callback) => {
  console.log('initializing');
  callback(null, '');
};
*/

exports.handler = (req, resp, context) => {
  console.log('hello world');
  const { DB_CONNECTION } = process.env; 
  getRawBody(req, function(err, body) {
    resp.send(JSON.stringify({DB_CONNECTION}, null, ' '));
  });
}