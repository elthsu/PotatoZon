var manager = function(connection) {

  connection.query('SELECT * FROM products',

    function (error, results, fields) {

        if (error) throw error;

        var valuesArr = [];

        for (var i = 0; i < results.length; i++) {
            var values = [i+1, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity];
            valuesArr.push(values);
        }

        console.table(['#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], valuesArr);

    });

  connection.end();

  }

  module.exports = manager;
