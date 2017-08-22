var start = require('./PotatoZon');
var inquirer = require('inquirer');
var Table = require('easy-table');
var item = 0;

var customer = function(connection) {

  connection.query('SELECT * FROM products',

    function(error, results, fields) {

      if (error) throw error;

      var t = new Table

      results.forEach(function(product) {
        t.cell('#', product.item_id)
        t.cell('Product', product.product_name)
        t.cell('Department', product.department_name)
        t.cell('Price', product.price)
        t.newRow()
      })

      console.log(t.toString());

      inquirer.prompt([{
        type: 'input',
        name: 'purchase',
        message: 'What would you like to buy?',
        validate: function(value) {
          if (isNaN(value) === false && value <= results.length && value > 0) {
            return true;
          }
          return false;
        }

      }]).then(function(ans) {

        var purchase = ans.purchase - 1;
        item = parseInt(ans.purchase);


        console.log(Table.print(results[purchase], {
          item_id: {
            name: '#'
          },
          product_name: {
            name: 'Product'
          },
          department_name: {
            name: 'Department'
          },
          price: {
            name: 'Price'
          },
          stock_quantity: {
            name: 'Stock Quantity'
          }
        }));

        inquirer.prompt([{
          type: 'list',
          name: 'confirm',
          message: 'Is this correct?',
          choices: ['Yes', 'No']
        }]).then(function(ans) {
          if (ans.confirm === 'Yes') {
            inquirer.prompt([{
              type: 'input',
              name: 'quantity',
              message: 'How many would you like to buy?',
              validate: function(value) {
                if (isNaN(value) === false && value !== '0') {
                  return true;
                }
                return false;
              }
            }]).then(function(ans2) {

              if (ans2.quantity < results[purchase].stock_quantity) {

                var remaining = results[purchase].stock_quantity - ans2.quantity;
                var total = (ans2.quantity * results[purchase].price).toFixed(2);

                inquirer.prompt([{
                  type: 'list',
                  name: 'confirm',
                  message: 'Purchase ' + ans2.quantity + ' ' + results[purchase].product_name + ' for ' +
                    total + ' ?',
                  choices: ['Yes', 'No']
                }]).then(function(ansbuy) {

                  if (ansbuy.confirm === 'Yes') {
                    connection.query('UPDATE products SET stock_quantity=' + remaining + ' WHERE item_id=' +
                      item,
                      function() {
                        if (error) throw error;
                      });

                    console.log("Thank you for your purchase! Your total is $" +
                      total);
                      inquirer.prompt([{
                        type: 'list',
                        name: 'again',
                        message: 'Would you like to buy something else?',
                        choices: ['Yes', 'No']
                      }]).then(function(ans3) {
                        if (ans3.again === 'Yes') {
                          customer(connection);
                        } else {
                          console.log("Please come again!");
                          connection.end();
                          process.exit();

                        }
                      })
                  } else {

                    customer(connection);

                  }

                  });
              } else {

                console.log("Sorry! Your order exceeds our current inventory.");
                inquirer.prompt([{
                  type: 'list',
                  name: 'again',
                  message: 'Would you like to buy something else?',
                  choices: ['Yes', 'No']
                }]).then(function(ans3) {
                  if (ans3.again === 'Yes') {
                    customer(connection);
                  } else {
                    console.log("Please come again!");
                    connection.end();
                    process.exit();

                  }
                })
              }

            });
          } else {
            customer(connection);
          }

        });
      });

    });

}



module.exports = customer;
