import React, { Component } from 'react';
import './ParkingHomePage.css';
import StaffHomePage from '../StaffHomePage';
import constants from '../../config/constants';
import labels from '../../config/en_labels';

class ParkingHomePage extends Component {

  constructor(props) {
    super(props);
    this.state = { staffId: '', staffPassword: '', homepage: true, loginError: false };
    //Bind the methods
    this.editLoginDetails = this.editLoginDetails.bind(this);
    this.submitLoginDetails = this.submitLoginDetails.bind(this);
  }

  //Add inital data into local storage
  componentWillMount() {
    document.title = "Parking"
    //Add to localStorage only if you find it empty
    if (!(localStorage.getItem("parkingLotsData"))) {

      //Get intitial from constants folders
      let parkingLotsData = constants.parkingLotsData;
      let vehicleHourlyRates = constants.vehicleHourlyRates;
      let vehiclesData = constants.vehiclesData;
      let vehiclesHistory = constants.vehiclesHistory;

      localStorage.setItem("parkingLotsData", JSON.stringify(parkingLotsData));
      localStorage.setItem("vehicleHourlyRates", JSON.stringify(vehicleHourlyRates));
      localStorage.setItem("vehiclesData", JSON.stringify(vehiclesData));
      localStorage.setItem("vehiclesHistory", JSON.stringify(vehiclesHistory));
    }
    // window.history.pushState({}, '', "/parkinglot");
  }

  //Controlled components for react Forms
  editLoginDetails(eve) {
    let key = eve.target.id;
    let value = eve.target.value;
    this.setState((state, props) => ({
      [key]: value
    }));
  }

  //Submit login credentials and handle errors
  submitLoginDetails(eve) {
    eve.preventDefault();
    if (this.state.staffId === "saketh73" && this.state.staffPassword === "root") {
      this.setState((state, props) => ({
        homepage: false
      }));
    }
    else {
      this.setState((state, props) => ({
        loginError: true
      }));
    }
  }

  render() {
    return (
      <div className="App">
        {/* Staff (Person at the counter) login details*/}
        {this.state.homepage ?
          <div className="login-container d-flex justify-content-center align-items-center">
            <form className="d-flex flex-column">
              <div className="d-flex">
                {this.state.loginError ? <p className="text-danger">{labels.parking_home_page.login_error}</p> : ''}
              </div>
              <div className="d-flex mt-3">
                <input placeholder="Staff Id" type="text" value={this.state.staffId ? this.state.staffId : ''} id="staffId" onChange={this.editLoginDetails} />
              </div>
              <p className="mt-2 help-text">Login with your email address.</p>
              <div className="d-flex mt-3">
                <input placeholder="Password" type="text" value={this.state.staffPassword ? this.state.staffPassword : ''} id="staffPassword" onChange={this.editLoginDetails} />
              </div>
              <div className="d-flex mt-4">
                <button className="btn btn-primary p-2" onClick={this.submitLoginDetails}>{labels.parking_home_page.submit}</button>
              </div>

              <p className="mt-4 help-text">Sample : (Staff Id=saketh73, Password=root)</p>

            </form>
          </div>
          :
          <StaffHomePage />}
      </div>
    );
  }
}

export default ParkingHomePage;
