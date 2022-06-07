var mysql = require('mysql');


// var http=require('http');
// var conn = mysql.createConnection({
//   protocol:'https:',  
//   host: '35.193.11.55', // Replace with your host name
//   user: 'root',      // Replace with your database username
//   password: 'asset',      // Replace with your database password
//   database: 'myasset', // // Replace with your database Name
 
// }); 
var conn = mysql.createConnection({
  // protocol:'http:',  

  
  host: '127.0.0.1', // Replace with your host name
  user: 'root',      // Replace with your database username
  password: '',      // Replace with your database password
  database: 'asset-mgt', // // Replace with your database Name
 
}); 
 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;