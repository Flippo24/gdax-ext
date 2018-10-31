const gdax = require('gdax');
gdax.L2Orderbook = require('./lib/L2orderbook.js');
gdax.L2bookSync = require('./lib/L2book_sync.js');

module.exports = gdax;
