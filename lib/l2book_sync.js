const { WebsocketClient } = require('gdax');
const Orderbook = require('./L2orderbook.js');

// Orderbook syncing
class L2bookSync extends WebsocketClient {
  constructor(
    productIDs,
    websocketURI = 'wss://ws-feed.pro.coinbase.com',
  ) {
    super(productIDs, websocketURI, null, {channels: ['level2', 'heartbeat']});
    this.books = {};
    this.productIDs.forEach(this._newProduct, this);
    this.on('message', this.processMessage.bind(this));
  }

  _newProduct(productID) {
    this.books[productID] = new Orderbook();
  }

  _newSubscription(data) {
    const channel = data.channels.find(c => c.name === 'level2');
    channel &&
      channel.product_ids
        .filter(productID => !(productID in this.books))
        .forEach(this._newProduct, this);
  }

  processMessage(data) {
    const { type, product_id } = data;
    const book = this.books[product_id];

    switch (type) {
      case 'subscriptions':
        this._newSubscription(data);
      break;

      case 'snapshot':
        for(var i=0; i<data.bids.length; i++) {
            var bid = data.bids[i];
            book.add({
              side: 'buy',
              price: bid[0],
              size: bid[1],
            })
        }
        for(var i=0; i<data.asks.length; i++) {
            var ask = data.asks[i];
            book.add({
              side: 'sell',
              price: ask[0],
              size: ask[1],
            })
        }
        book._bids.sort(this.revsortPrice);
        book._asks.sort(this.sortPrice);
        book._isSynced = true;
        this.emit('synced', product_id);
        this.emit('synced '+ product_id, product_id);
        break;

      case 'l2update':
        var changes = data.changes;
        for(var i=0; i<changes.length; i++) {
            book.processchanges(changes[i]);
        }
        this.emit('updated', product_id);
        this.emit('updated '+ product_id, product_id);
        break;
      
      case 'heartbeat':

        break;
    }
  }
}

module.exports = exports = L2bookSync;