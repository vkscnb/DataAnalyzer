import React, { Component } from "react";
import './App.css';

import Header from './js/Header'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css'

import SelectFormate from './js/selectFormate';
import SelectSource from './js/selectSource'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <Header />
          {/* <SelectFormate /> */}
          <div style={{marginTop:"5%"}}>
            <SelectFormate />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
