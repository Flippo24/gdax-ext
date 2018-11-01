# gdax-ext

This is an extension for Coinbase's Node.js library [gdax-node](https://github.com/coinbase/gdax-node).

## Additional Features

* Synced level2 orderbook

## Quick Start

Just change the modulename from gdax to gdax-ext and use it like you used gdax-node before.

```js
const Gdax = require('gdax-ext');
const publicClient = new Gdax.PublicClient();
```

### Methods

#### Level2 Orderbook

`L2orderbook` is a data structure that can be used to store a local copy of the level2
orderbook.

```js
const orderbook = new Gdax.L2orderbook();
```

The orderbook has the following methods:

* `state()` 

Gives the complete book

```js
L2orderbook.state();
```

* `get(side, count)` 

Ask for the top (count) entries of a side. If count is not specified the top 5 entries where selected.

```js
L2orderbook.get('buy',6);
```

* `getSpread()`

Returns the spread on the book.

```js
L2orderbook.getSpread();
```

* `processchanges(change)`

Processes the messages (data) from the l2update websocket channel. This automaticaly checks, if this message has to be remove or adds an entry.

```js
L2orderbook.processchanges(data.changes);
```

* `add(order)`

Adds an order to the book.

```js
const order = {
    price: '6452.34',
    size: '0.23245'
};
L2orderbook.add(order);
```

* `remove(price, side)`

Removes an order from the book.

```js
const price = '6452.34';
const side = 'sell'
L2orderbook.remove(price, side);
```

### Level2 Orderbook Sync

`L2bookSync` creates a local mirror of the level2 orderbook on GDAX using

```js
const orderbookSync = new Gdax.L2bookSync(productID);
```

* `productID` _optional_ - defaults to 'BTC-USD' if not specified.

### Events

The following events can be emitted from the `L2bookSync`:

* `synced` when a orderbook is synced
* `synced productID` when the book of productID is synced
* `updated` when a orderbook is updated
* `updated productID` when the book of productID is updated

While productID has to be the name of the productID you specified.

## Basic Examples

###  Get level2 orderbooks syncronisation finished and orderbook updated.

```js
const Gdax = require('gdax-ext');

const productIDs = ['ETH-BTC', 'BTC-USD'];
const orderbookSync = new Gdax.L2bookSync(productIDs);

//sync finished for every books
orderbookSync.on('synced', function(data) {
   console.log('synced book:', data);
   console.log(orderbookSync.books[data].state());
   console.log(orderbookSync.books[data].getSpread());
});

//sync finished for one book
orderbookSync.on('synced BTC-USD', function(data) {
   console.log('synced book:', data);
   console.log(orderbookSync.books['BTC-USD'].state());
});

//update for every book
orderbookSync.on('updated', function(data) {
   console.log('updated book:', data);
   console.log(orderbookSync.books[data].getSpread());
});

//update for one book
orderbookSync.on('updated BTC-ETH', function(data) {
   console.log('updated book:', data);
   console.log(orderbookSync.books[data].get('buy',6));
   console.log(orderbookSync.books[data].getSpread());
});
```
Data contains the productID. 


