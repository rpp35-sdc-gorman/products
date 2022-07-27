// server.js;
const db = require('./db');
const express = require('express');

const app = express();

app.get('/products', (req, res, next) => {
  // req.query.page = 1;
  // req.query.count = 5;
  db.products(req.query.page, req.query.count)
    .then((rows) => {
      res.send(rows);
    })
    .catch((reason) => {
      console.error(reason);
      res.status(500).send(reason);
    });
});

app.get('/products/:id', (req, res, next) => {
  // req.query.page = 1;
  // req.query.count = 5;
  db.product(Number(req.params.id))
    .then((rows) => {
      res.send(rows);
    })
    .catch((reason) => {
      console.error(reason);
      res.status(500).send(reason);
    });
});

app.get('/products/:id/styles', (req, res, next) => {
  // req.query.page = 1;
  // req.query.count = 5;
  db.styles(Number(req.params.id))
    .then((rows) => {
      res.send(rows);
    })
    .catch((reason) => {
      console.error(reason);
      res.status(500).send(reason);
    });
});

app.get('/products/:id/related', (req, res, next) => {
  db.related(Number(req.params.id))
    .then((rows) => {
      res.send(rows);
    })
    .catch((reason) => {
      console.error(reason);
      res.status(500).send(reason);
    });
});

app.listen(5000, () => console.log('listening on port 5000'));
