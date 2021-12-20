import React, { Component } from 'react';
import './StaffHomePage.css';
import ParkVehicle from '../ParkVehicle';
import ExitParking from '../ExitParking';

class StaffHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = { allocateLot: false, vacateLot: false };
        this.viewData = this.viewData.bind(this);
        this.editVehicleNumber = this.editVehicleNumber.bind(this);
    }

    //Get the data from localstorage before the component gets rendered
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

    editVehicleNumber(eve) {
        let key = eve.target.id;
        let value = eve.target.value;
        this.setState((state, props) => ({
            [key]: value
        }));
    }

    //View the historic data of vehicles
    viewData() {
        let vcData = this.state.vehiclesHistory[this.state.vehicleNumber];
        if (vcData) {
            this.setState((state, props) => ({
                showVehicleData: true
            }));
        }
        else {
            this.setState((state, props) => ({
                noVehicle: true
            }));
        }
    }

    render() {
        return (
            <div className="staff-page">
                {!this.state.allocateLot && !this.state.vacateLot ?
                    <div className="staff-page d-flex flex-column align-items-center">
                        {/* Staff have 2 options here, 1. To Allocate lot, 2. To Vacate a lot */}
                        <div className="staff-choices d-flex justify-content-between">
                            <button className="btn btn-primary" onClick={() => this.setState((state, props) => ({
                                allocateLot: true,
                                vacateLot: false
                            }))}>Allocate a parking lot</button>
                            <button className="btn btn-primary" onClick={() => this.setState((state, props) => ({
                                vacateLot: true,
                                allocateLot: false
                            }))}>Vacate from parking lot</button>
                        </div>
                        <div className="d-flex help-vehicle justify-content-start mt-4">
                            <p className="help-text pb-0">You can find the complete details of a vehicle below</p>
                        </div>
                        <div className="d-flex justify-content-start vehicle-input-field">
                            <input placeholder="Enter the Vehicle number" type="text" value={this.state.vehicleNumber ? this.state.vehicleNumber : ''} id="vehicleNumber" onChange={this.editVehicleNumber} />
                            <button className="btn btn-success" onClick={this.viewData}>View Data</button>
                        </div>
                        {/* Show tabular representatoin of data for a vehicle even if it left*/}
                        {this.state.showVehicleData && this.state.vehiclesHistory[this.state.vehicleNumber] ?
                            <div className="table-overflow">
                                <table className="vehicle-data-table">
                                    <tr>
                                        <th>Parking Lot Id</th>
                                        <th>Vehicle Type</th>
                                        <th>Duration (minutes)</th>
                                        <th>Amount to be Paid</th>
                                    </tr>
                                    <tr>
                                        <td>{this.state.vehiclesHistory[this.state.vehicleNumber]["lotId"]}</td>
                                        <td>{this.state.vehiclesHistory[this.state.vehicleNumber]["vehicleType"]}</td>
                                        <td>{this.state.vehiclesHistory[this.state.vehicleNumber]["duration"]}</td>
                                        <td>{this.state.vehiclesHistory[this.state.vehicleNumber]["amountPaid"]}</td>
                                    </tr>
                                </table>
                            </div>
                            : ''}
                        {this.state.noVehicle ? <p className="text-danger">No vehicle exits with that number</p> : ''}
                    </div>
                    :
                    (this.state.allocateLot ? <ParkVehicle /> : <ExitParking />)
                }
            </div>
        )
    }
}

export default StaffHomePage;