import React, { Component } from "react";

import firebase from "firebase";
import { DB_CONFIG } from "./components/Data/Config";
import "./App.css";
import { Services } from "../src/components/Data/Data";

class App extends Component {
  constructor(props) {
    super(props);
    this.app = firebase.initializeApp(
      DB_CONFIG
    );
    this.database = this.app
      .database()
      .ref()
      .child("first");
  }
  state = {
    name: "",
    services: [],
    time: 0,
    kunder: [],
    firebase: [],
    timeStamp: "",
    currentCustomerStart: "",
    currentCustomer: ""
  };

  nextCustomer = () => {
    if (this.state.firebase.length > 1) {
      this.database
        .child(this.state.firebase[1][0])
        .update({ timeStamp: Date.now() });
    }
    this.database.child(this.state.currentCustomerStart).remove();
    if (this.state.firebase.length == 1) {
      this.setState({ firebase: [], timeStamp: Date.now() });
    }
  };
  componentDidMount() {
    this.database.on("value", snap => {
  

      if (snap.val()) {
        this.setState({
          firebase: Object.entries(snap.val()),
          currentCustomerStart: Object.entries(snap.val())[0][0],
          timeStamp: Object.entries(snap.val())[0][1].timeStamp
        });
      }
    });
  }

  onChange = e => {
    this.setState({ name: e.target.value });
  };
  handleService = e => {
    if (e.target.classList.value === "active") {
      e.target.classList.remove("active");
    } else {
      e.target.classList.add("active");
    }
    let newTime = this.state.time;
    if(this.state.services.includes(e.target.innerText)){
      const newServices = this.state.services.filter(service => {
      
        
        console.log(service == e.target.innerText)
        
        return service != e.target.innerText
      })
      
      this.setState({services:newServices})
      
      
    } else {

      let newServices = this.state.services;
   
      
      newServices.push(e.target.innerText);
      newTime += parseInt(e.target.value, 10);
      this.setState({ services: newServices, time: newTime });
    }
  };

  register = () => {
    let test = document.querySelectorAll(".active");
    test.forEach(x => {
      x.classList.remove("active");
    });
if(this.state.services.length>0){

  const nyKund = this.state.kunder;
  nyKund.push({
    namn: this.state.name,
    services: this.state.services,
    time: this.state.time,
    timeStamp: Date.now()
  });
  this.setState({
    name: "",
    services: [],
    time: 0,
    kunder: nyKund,
    
  });
  this.database.push().set({
    namn: this.state.name,
    services: this.state.services,
    time: this.state.time,
    timeStamp: this.state.timeStamp
  });
}
  };
  render() {
    let kundnr = 0;
    let tid = 0;
    let justnu = 0;
    if (this.state.firebase.length > 0) {
      justnu = this.state.firebase[0][1].time;
    }

    let namn = this.state.firebase.map(kund => {
      kundnr++;
      tid += kund[1].time;

      let hr = new Date(
        this.state.timeStamp + 1000 * 60 * tid - 1000 * 60 * justnu
      ).getHours();

      let min = new Date(
        this.state.timeStamp + 1000 * 60 * tid - 1000 * 60 * justnu
      ).getMinutes();
      let sec = new Date(
        this.state.timeStamp + 1000 * 60 * tid - 1000 * 60 * justnu
      ).getSeconds()
      return (
        <li key={kund[0]} className="firstCustomer">
          <div><h3>{kund[1].namn}</h3></div>
          {/* <div>
            tid kl {hr}:{min < 10 ? "0" : ""}
            {min}:{sec}
          </div> */}
          {kund[0] === this.state.currentCustomerStart ? (
            <div style={{paddingBottom:'10px'}}>Just nu</div>
          ) : (
            <div style={{paddingBottom:'10px'}}>
              tid kl {hr}:{min < 10 ? "0" : ""}
              {min}
            </div>
          )}
        </li>
      );
    });

    const services = Services.map(service => {
      let classes = this.state.ActiveService ? "active" : "";
      return (
        <li
          className={classes}
          key={service.id}
          onClick={this.handleService}
          value={service.time}
        >
          {service.service} -- {service.time} min
        </li>
      );
    });
    console.log(this.state.services)
    
    return (
      <div>
     
        <input  style={{marginTop:'20px', marginLeft:'20px',fontSize:'16px'}}
          type="text"
          placeholder="namn"
          value={this.state.name}
          onChange={this.onChange}
        />

        <p>Välj tjänst</p>
        <ul>{services}</ul>
        <button onClick={this.register}>Registrera Kund</button>
        <hr />
       
        <ul>{namn}</ul>

        <div>
          <button onClick={this.nextCustomer}>NÄSTA</button>
        </div>
      </div>
    );
  }
}

export default App;
