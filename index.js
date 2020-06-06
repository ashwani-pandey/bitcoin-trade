import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

class App extends Component {

  ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@depth');

  constructor() {
    super();
    this.state = {
      name: 'Ashwani',
      dataFromServer: null
    };
  }

  componentDidMount(){

    this.ws.onopen = () => {
      console.log("connected");
    }

    this.ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      this.setState({dataFromServer: message});
      //console.log(message);
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
    }

  }

  render() {

    const bid_items = !!this.state.dataFromServer && this.state.dataFromServer.data.b.map((item)=> {
        
        const item_price = parseFloat(item[0]).toFixed(2);
        const item_amount = parseFloat(item[1]).toFixed(6);
        const item_total = (item_price * item_amount).toFixed(8);

        if(item_amount != 0){
          return (
            <div className="item bid-item">
              <div className="item-price bid-item-price">{item_price}</div>
              <div className="item-amount bid-item-text">{item_amount}</div>
              <div className="item-total bid-item-text">{item_total}</div>
            </div>
          )
        }
    });

    const ask_items = !!this.state.dataFromServer && this.state.dataFromServer.data.a.map((item)=> {

        const item_price = parseFloat(item[0]).toFixed(2);
        const item_amount = parseFloat(item[1]).toFixed(6);
        const item_total = (item_price * item_amount).toFixed(8);

        if(item_amount != 0){
          return (
            <div className="item bid-item">
              <div className="item-price ask-item-price">{item_price}</div>
              <div className="item-amount">{item_amount}</div>
              <div className="item-total">{item_total}</div>
            </div>
          )
        }
    });

    return (
      <div className="all-items">
        <Hello name={this.state.name} />
        <div className="headers">
          <div className="item">
            <div className="item-price header-text">Price (USDT)</div>
            <div className="item-amount header-text">Amount (BTC)</div>
            <div className="item-total header-text">Total (USDT)</div>
          </div>
        </div>
        <div className="bid-items"> {bid_items} </div>
        <div className="spot-price"><p>SPOT PRICE</p></div>
        <div className="ask-items"> {ask_items} </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
