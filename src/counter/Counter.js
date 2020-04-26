import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Columns, Column } from 'react-bulma-components';
import React, { Component } from 'react'
import './Counter.css';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 1 };
  }

  componentDidMount() {
    document.title = 'Sapi Counter';
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

  _validate = () => {
    if (this.state.count !== 8) {
      alert('Wrong answer, please think again human')
      this.setState({ count: 1 })
      return
    }

    // navigate to wikipedia cow page 
    alert('Congrats, You\'re right :)')
    window.location.href = 'https://id.wikipedia.org/wiki/Sapi'

  }

  render() {
    return (
      <div className="App">
        <body className="App-header">
          <h2> <b>How many cows are there? </b></h2>
          <img src="https://reuniting-europe.blogactiv.eu/files/2016/02/Cows-1.jpg" alt="sapi" /><br />
          <Columns>
            <Columns.Column> <Button onClick={() => this._decrement()}> - </Button> </Columns.Column>
            <Columns.Column> {this.state.count} </Columns.Column>
            <Columns.Column> <Button onClick={() => this._increment()}> + </Button><br /> </Columns.Column>
          </Columns>
          <Button color="link" onClick={() => this._validate()}>Validate</Button>
        </body>
      </div>
    );
  }
}

