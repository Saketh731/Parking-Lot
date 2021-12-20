import React, { Component } from 'react';
import './ExitParking.css';
import labels from '../../config/en_labels';

class ExitParking extends Component {
    constructor(props) {
        super(props);
        this.state = { parkingLotsData: {}, vehicleHourlyRates: {}, vehiclesData: {} };
        //Bind the functions
        this.editExitVehicleNumber = this.editExitVehicleNumber.bind(this);
        this.checkPaymentAmount = this.checkPaymentAmount.bind(this);
        this.exitFromParking = this.exitFromParking.bind(this);
    }

    //Get data from localstorage and store it in react state
    componentWillMount() {
        let parkingLotsData = JSON.parse(localStorage.getItem('parkingLotsData'));
        let vehicleHourlyRates = JSON.parse(localStorage.getItem('vehicleHourlyRates'));
        let vehiclesData = JSON.parse(localStorage.getItem('vehiclesData'));
        let vehiclesHistory = JSON.parse(localStorage.getItem('vehiclesHistory'));
        this.setState((state, props) => ({
            parkingLotsData: parkingLotsData,
            vehicleHourlyRates: vehicleHourlyRates,
            vehiclesData: vehiclesData,
            vehiclesHistory: vehiclesHistory
        }));
    }

    //save vehicle number in state
    editExitVehicleNumber(eve) {
        let key = eve.target.id;
        let value = eve.target.value;
        this.setState((state, props) => ({
            [key]: value,
            showVehicleData: false
        }));
    }

    //Calculate the amount to be paid while exiting
    checkPaymentAmount() {
        let exitVehicleNumber = this.state.exitVehicleNumber;
        let vehiclesData = this.state.vehiclesData;
        let vehiclesHistory = this.state.vehiclesHistory;
        let vehicleHourlyRates = this.state.vehicleHourlyRates;
        let vcData = vehiclesData[exitVehicleNumber];
        if (vcData) {
            let vehicleType = vcData.vehicleType;
            //Exit time
            let timeOfExit = new Date().getTime();
            vcData["timeOfExit"] = timeOfExit;

            //Calculate time Duration
            let timeOfArriaval = vcData["timeOfArriaval"];
            let duration = (timeOfExit - timeOfArriaval) / 1000;
            duration /= 60;
            vcData["duration"] = duration;

            //Calculate the amount to be paid
            let timeRange = '';
            if (duration <= 120) {
                timeRange = "uptoTwo"
            }
            else if (duration <= 240) {
                timeRange = "uptoFour"
            }
            else {
                timeRange = "beyondFour"
            }

            let amount = vehicleHourlyRates[vehicleType][timeRange];
            vcData["amountPaid"] = amount;

            //Update the vehiclesData object
            vehiclesData[this.state.exitVehicleNumber] = vcData;
            vehiclesHistory[this.state.exitVehicleNumber] = vcData;
            this.setState((state, props) => ({
                vehiclesData: vehiclesData,
                showVehicleData: true,
                vehiclesHistory: vehiclesHistory,
                noVehicle: false
            }));
        }
        else {
            this.setState((state, props) => ({
                noVehicle: true
            }));
        }
    }

    //Update the localStorage
    exitFromParking() {
        let parkingLotsData = this.state.parkingLotsData;
        let lotId = this.state.vehiclesData[this.state.exitVehicleNumber]["lotId"];
        let vehiclesData = this.state.vehiclesData;
        delete vehiclesData[this.state.exitVehicleNumber];
        let vehiclesHistory = this.state.vehiclesHistory;


        Object.keys(parkingLotsData).map((floor, index) => {
            parkingLotsData[floor] ? parkingLotsData[floor].map((lot) => {
                if (lot["lotId"] === lotId && lot["availability"] === false) {
                    lot["availability"] = true;
                }
            }) : ''
        })

        this.setState((state, props) => ({
            showVehicleData: false,
            noVehicle: false,
            exitVehicleNumber: ''
        }));

        localStorage.setItem("parkingLotsData", JSON.stringify(parkingLotsData));
        localStorage.setItem("vehiclesData", JSON.stringify(vehiclesData));
        localStorage.setItem("vehiclesHistory", JSON.stringify(vehiclesHistory));
    }

    render() {
        return (
            <div className="exit-container d-flex flex-column justify-content-center align-items-center">
                <h2 className="mt-4">Parking History</h2>
                <div className="d-flex flex-column flex-md-row exit-vehicle-details align-items-center justify-content-center mt-5">
                    <input placeholder={labels.exit_parking.enter_vehicle_number} type="text" value={this.state.exitVehicleNumber ? this.state.exitVehicleNumber : ''} id="exitVehicleNumber" onChange={this.editExitVehicleNumber} />
                    <button className="btn btn-primary" onClick={this.checkPaymentAmount}>{labels.exit_parking.check_amount}</button>
                </div>
                {/* <p className="help-text">Enter Vehicle number to get its details</p> */}
                {this.state.showVehicleData && this.state.vehiclesData[this.state.exitVehicleNumber] ?
                    <div>
                        {/* Table to show the vehicle details */}
                        <div className="vehicle-data-table">
                            <table>
                                <tr>
                                    <th>Parking Lot Id</th>
                                    <th>Vehicle Type</th>
                                    <th>Duration (minutes)</th>
                                    <th>Amount to be Paid</th>
                                </tr>
                                <tr>
                                    <td>{this.state.vehiclesData[this.state.exitVehicleNumber]["lotId"]}</td>
                                    <td>{this.state.vehiclesData[this.state.exitVehicleNumber]["vehicleType"]}</td>
                                    <td>{this.state.vehiclesData[this.state.exitVehicleNumber]["duration"]}</td>
                                    <td>{this.state.vehiclesData[this.state.exitVehicleNumber]["amountPaid"]}</td>
                                </tr>
                            </table>
                        </div>
                        <div className="d-flex justify-content-end finished-exit">
                            <button className="btn btn-success mt-5" onClick={this.exitFromParking}> {labels.exit_parking.recieve_payment}</button>
                        </div>
                    </div>
                    : ''}
                {this.state.noVehicle ? <p className="text-danger mt-3"> {labels.exit_parking.no_vehicle}</p> : ''}
            </div>
        )
    }
}

export default ExitParking;