// server.js;
const db = require('./db');
const express = require('express');
const rediss = require('redis');
const path = require('path');
const redis = rediss.createClient(6379);
require('newrelic');
redis.connect();
redis.on('connect', function () {
  console.log('Connected!');
});
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

function cache(req, res, next) {
  redis
    .get(req.originalUrl)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

app.use(cache);

app.get('/products', (req, res, next) => {
  // req.query.page = 1;
  // req.query.count = 5;
  db.products(req.query.page, req.query.count)
    .then((rows) => {
      redis.setEx(req.originalUrl, 3600 * 1000000, JSON.stringify(rows));
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
      redis.setEx(req.originalUrl, 3600 * 1000000, JSON.stringify(rows));
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
      redis.setEx(req.originalUrl, 3600 * 1000000, JSON.stringify(rows));
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
      redis.setEx(req.originalUrl, 3600 * 1000000, JSON.stringify(rows));
      res.send(rows);
    })
    .catch((reason) => {
      console.error(reason);
      res.status(500).send(reason);
    });
});

app.listen(5000, () => console.log('listening on port 5000'));
