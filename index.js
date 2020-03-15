import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

class App extends Component {

  ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt');

  constructor() {
    super();
    this.state = {
      name: 'FalconX',
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
      console.log(message);
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
    }

  }

  render() {
    return (
      <div>
        <Hello name={this.state.name} />
        <p>
          Start editing to see some magic happen :)
        </p>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
