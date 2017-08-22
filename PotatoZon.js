var mysql = require('mysql');
var inquirer = require("inquirer");
var customer = require('./customer');
var manager = require('./manager');
var sup = require('./sup');


var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "potatozon"
});


connection.connect(function(err) {
  if (err) throw err;
  startApp();
});


var startApp = function() {

  inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      message: 'What is your role?',
      choices: ['Customer', 'Manager', 'Supervisor']

    }
  ]).then(function(ans){
    selection = ans.role;

    switch (selection) {
      case 'Customer':
      customer(connection);
      break;

      // case 'Manager':
      // manager();
      // break;
      //
      // case 'Supervisor':
      // sup();
      // break;

    }

  })



}
