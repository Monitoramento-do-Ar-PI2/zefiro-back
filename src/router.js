const express = require('express');

const router = express.Router();

router.get('/', (_, res) => {
  res.json('WELCOME!!');
});

module.exports = (app) => app.use('/', router);
