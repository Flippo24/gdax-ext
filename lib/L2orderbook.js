class Orderbook {
  constructor() {
    this._asks = [];
    this._bids = [];
    this._isSynced = false;
  }

  _getTree(side) {
    return side === 'buy' ? this._bids : this._asks;
  }

  state() {
    // this._bids.sort(this.revsortPrice);
    // this._asks.sort(this.sortPrice);

    var book = { asks: this._asks, bids:this._bids };
    return book;
  }

  getSpread() {
    // this._bids.sort(this.revsortPrice);
    // this._asks.sort(this.sortPrice);
    // var book = { asks: this._asks, bids:this._bids };
    // return this._asks[0].price - this._bids[0].price;

    // var maxBid = this._bids.reduce((max, p) => p.price > max ? p.price : max, this._bids[0].price);
    // var minAsk = this._asks.reduce((max, p) => p.price < max ? p.price : max, this._asks[0].price);
    var maxBid = Math.max.apply(Math, this._bids.map(function(o) { return o.price; }));
    var minAsk = Math.min.apply(Math, this._asks.map(function(o) { return o.price; }));
    return minAsk - maxBid;
  }

  processchanges(change) {
    if(change[0] === 'buy') {
        if(change[2] === '0') {
          this.remove(change[1], change[0]);
        } else {
          this.add({
            side: 'buy',
            price: change[1],
            size: change[2],
          })
        }
    } else if (change[0] === 'sell') {
        if(change[2] === '0') {
            this.remove(change[1], change[0]);
        } else {
          this.add({
            side: 'sell',
            price: change[1],
            size: change[2],
          })
        }
    }
  }

  get(side, count=5) {
    switch (side) {
      case 'buy':
        this._bids.sort(this.revsortPrice);
        return this._bids.slice(0,count);
      case 'sell':
        this._asks.sort(this.sortPrice);
        return this._asks.slice(0,count);
    }
  }

  sortPrice(a, b) {
    if (a.price > b.price) {
      return 1;
    }
    if (a.price < b.price) {
      return -1;
    }
    return 0;
  }

  revsortPrice(a, b) {
    if (a.price < b.price) {
      return 1;
    }
    if (a.price > b.price) {
      return -1;
    }
    return 0;
  }

  findPrice(element, index, array) {
    return element.price === this;
  }

  add(order) {

    const newOrder = {
      price: order.price*1,
      size: order.size*1,
    };
    
    const tree = this._getTree(order.side);

    const idx = tree.findIndex(this.findPrice,newOrder.price);
    if (idx === -1) {
      tree.push(newOrder);
      if (this._isSynced) {
        switch (order.side) {
          case 'buy':
            // this._bids.sort(this.revsortPrice);
            break;
          case 'sell':
            // this._asks.sort(this.sortPrice);
            break;
        }
      }
    } else {
      tree.splice(idx, 1, newOrder);
    }
    // tree.sort(sortPrice);
  }

  remove(price, side) { 
    const tree = this._getTree(side);

    const idx = tree.findIndex(this.findPrice, price*1);
    if (idx > -1) {
       tree.splice(idx, 1);
    }
  }
}

module.exports = exports = Orderbook;
