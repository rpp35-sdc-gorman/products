const { parse } = require('csv-parse');
const { Client } = require('pg');
const fs = require('fs/promises');
const client = new Client();
client.connect();

fs.readFile(__dirname + '/product.csv').then((file) => {
  parse(file, (err, records) => {
    client
      .query(
        'INSERT into products (id, name, slogan, description, category, default_price) values $1',
        records
      )
      .then((res) => {
        console.log(res);
      });
  });
});
// parse(input, {}, function (err, records) {
//
// });
