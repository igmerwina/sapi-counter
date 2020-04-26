import React, { Component } from 'react'
import './Counter.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Container } from 'react-bulma-components';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }

  _increment = () => {
    this.setState({ count: this.state.count + 1 })
  }

  _decrement = () => {
    if (this.state.count !== 1) {
      this.setState({ count: this.state.count - 1 })
      return;
    }
    // minimun limit
    this.setState({ count: 1 })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>How many cows are there?</h2>
          <img src="https://reuniting-europe.blogactiv.eu/files/2016/02/Cows-1.jpg" className="sapi-img" alt="sapi" />
          <Button onClick={() => this._decrement()}> - </Button>
          <p>{this.state.count} </p>
          <Button onClick={() => this._increment()}> + </Button>
          <Button color="primary">Validate</Button>
        </header>
        <body>
          <Container>

          </Container>
        </body>
      </div>
    );
  }
}

