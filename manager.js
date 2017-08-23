var inquirer = require("inquirer");
var Table = require('easy-table');

var manager = function(connection) {

    inquirer.prompt([{
      type: 'list',
      name: 'managerChoice',
      message: 'What would you like to do?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory',
        'Add New Product', 'Quit']

    }]).then(function(ans) {
      selection = ans.managerChoice;

      switch (selection) {
        case 'View Products for Sale':
          viewProduct();
          break;

        case 'View Low Inventory':
          viewLow();
          break;

        case 'Add to Inventory':
          addInventory();
          break;

        case 'Add New Product':
          addProduct();
          break;

        case 'Quit':
          console.log("Goodbye!");
          connection.end();
          process.exit();
          break;

      }

    })

    var viewProduct = function() {

      connection.query('SELECT * FROM products',

        function(error, results, fields) {

          if (error) throw error;

          var t = new Table

          results.forEach(function(product) {
            t.cell('ID', product.item_id)
            t.cell('Product', product.product_name)
            t.cell('Department', product.department_name)
            t.cell('Price', product.price)
            t.cell('Inventory Level', product.stock_quantity)
            t.newRow()
          })

          console.log(t.toString());

          manager(connection);

        }
      )
    }

    var viewLow = function() {

      connection.query('SELECT * FROM products WHERE stock_quantity < 5',

        function(error, results, fields) {

          if (error) throw error;

          var t = new Table

          results.forEach(function(product) {
            t.cell('ID', product.item_id)
            t.cell('Product', product.product_name)
            t.cell('Department', product.department_name)
            t.cell('Price', product.price)
            t.cell('Inventory Level', product.stock_quantity)
            t.newRow()
          })

          console.log(t.toString());

          manager(connection);

        }
      )
    }

    var addInventory = function() {

      connection.query('SELECT * FROM products',

        function(error, results, fields) {

          if (error) throw error;

          var t = new Table

          results.forEach(function(product) {
            t.cell('ID', product.item_id)
            t.cell('Product', product.product_name)
            t.cell('Department', product.department_name)
            t.cell('Price', product.price)
            t.cell('Inventory Level', product.stock_quantity)
            t.newRow()
          })

          console.log(t.toString());

          inquirer.prompt([{
            type: 'input',
            name: 'addInvent',
            message: 'To which item would you like to add inventory?',
            validate: function(value) {
              if (isNaN(value) === false && value <= results.length && value > 0) {
                return true;
              }
              return false;
            }

          }]).then(function(ans) {

            var addInvent = ans.addInvent - 1;
            item = parseInt(ans.addInvent);


            console.log(Table.print(results[addInvent], {
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
                  message: 'How many units would you like to add?',
                  validate: function(value) {
                    if (isNaN(value) === false && value > '0') {
                      return true;
                    }
                    return false;
                  }
                }]).then(function(ans2) {



                  var addition = parseInt(results[addInvent].stock_quantity) + parseInt(ans2.quantity);

                  inquirer.prompt([{
                    type: 'list',
                    name: 'confirm',
                    message: 'Add ' + ans2.quantity + ' units to ' + results[addInvent].product_name + '?',
                    choices: ['Yes', 'No']
                  }]).then(function(ansbuy) {

                    if (ansbuy.confirm === 'Yes') {
                      connection.query('UPDATE products SET stock_quantity=' + addition + ' WHERE item_id=' +
                        item,
                        function() {
                          if (error) throw error;
                        });

                      console.log("Success, you've added " + ans2.quantity + " units to " + results[addInvent].product_name + " for a new total of: " + addition);

                      inquirer.prompt([{
                        type: 'list',
                        name: 'again',
                        message: 'Would you like to do something else?',
                        choices: ['Yes', 'No']
                      }]).then(function(ans3) {
                        if (ans3.again === 'Yes') {
                          manager(connection);
                        } else {
                          console.log("Goodbye!");
                          connection.end();
                          process.exit();

                        }
                      })
                    } else {

                      manager(connection);

                    }

                  });

                });
              } else {
                manager(connection);
              }

            });
          });

        }
      )
    }

    var addProduct = function() {

      inquirer.prompt([{
          type: 'input',
          name: 'addProdName',
          message: 'What is the Product Name?'
        },
        {
          type: 'list',
          name: 'addProdDept',
          message: 'What is the Department?',
          choices: ['Apparel', 'Beverage', 'Food', 'Tool', 'Toy']
        },
        {
          type: 'input',
          name: 'addProdPrice',
          message: 'What is the Product Price?',
          validate: function(value) {
            if (isNaN(value) === false && value > '0') {
              return true;
            }
            return false;
          }
        },
        {
          type: 'input',
          name: 'addProdInventory',
          message: 'How much Inventory?',
          validate: function(value) {
            if (isNaN(value) === false && value > '0') {
              return true;
            }
            return false;
          }
        },
      ]).then(function(ans) {

          var price = parseFloat(ans.addProdPrice);
          price = price.toFixed(2);

          console.log('Product: ' + ans.addProdName);
          console.log('Department: ' + ans.addProdDept);
          console.log('Price: ' + price);
          console.log('Inventory Level: ' + ans.addProdInventory);

          inquirer.prompt([{
            type: 'list',
            name: 'confirm',
            message: 'Is this correct?',
            choices: ['Yes', 'No']
          }]).then(function(ans2) {

              if (ans2.confirm === 'Yes') {
                connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity)' +
                  ' VALUE ("' + ans.addProdName + '", "' + ans.addProdDept + '", "' + price + '", "' + ans.addProdInventory +
                  '")');
                  console.log("Item added successfully.");

                  inquirer.prompt([{
                    type: 'list',
                    name: 'additional',
                    message: 'Would you like to add more products?',
                    choices: ['Yes', 'No']
                  }]).then(function(ans3) {
                    if (ans3.additional === 'Yes') {
                      addProduct();
                    } else {
                      manager(connection);

                    }


                  })


                }

                else {

                  addProduct();
                }

              })

          })

      }
    }

    module.exports = manager;
