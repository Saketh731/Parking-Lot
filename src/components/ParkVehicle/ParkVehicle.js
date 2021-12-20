import React, { Component } from 'react';
import './ParkVehicle.css';

class ParkVehicle extends Component {

    constructor(props) {
        super(props);
        this.state = { parkingLotsData: {}, vehicleHourlyRates: {}, vehiclesData: {} };
        //Bind the functions
        this.editVehicleDetails = this.editVehicleDetails.bind(this);
        this.checkLotAvailability = this.checkLotAvailability.bind(this);
        this.selectTheLot = this.selectTheLot.bind(this);
        this.allocateTheLot = this.allocateTheLot.bind(this);
        this.editVehicleNumber = this.editVehicleNumber.bind(this);
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

    //Get the type of vehicle and store it in state    
    editVehicleDetails(eve) {
        //Bring the previous states to its defaults state
        this.setState((state, props) => ({
            checkSlots: false,
            selectedLot: false,
            popup: false
        }));
        let key = eve.target.id;
        let value = eve.target.value;
        this.setState((state, props) => ({
            [key]: value
        }));
    }

    checkLotAvailability() {
        let capacity = this.state.vehicleType;
        let availability = false;
        let availableLots = 0;
        this.setState((state, props) => ({
            checkSlots: true
        }));
        if (capacity) {
            //Check if the lot is availale based the vehicle type
            Object.keys(this.state.parkingLotsData).map((floor, index) => {
                this.state.parkingLotsData[floor] ? this.state.parkingLotsData[floor].map((lot) => {
                    if (lot["capacity"] === capacity && lot["availability"] === true) {
                        availability = true;
                        availableLots = availableLots + 1;
                    }
                }) : ''
            })
        }
        if (availability) {
            this.setState((state, props) => ({
                lotAvailable: true,
                availableLots: availableLots
            }));
        }
    }

    selectTheLot(lot) {
        Object.keys(this.state.parkingLotsData).map((floor, index) => {
            this.state.parkingLotsData[floor] ? this.state.parkingLotsData[floor].map((lot) => {
                document.getElementById(lot.lotId).classList.remove("selected-lot");
            }) : ''
        })
        document.getElementById(lot.lotId).classList.add("selected-lot");
        this.setState((state, props) => ({
            selectedLot: lot
        }));
    }

    //store vehicle number in the state
    editVehicleNumber(eve) {
        let key = eve.target.id;
        let value = eve.target.value;
        this.setState((state, props) => ({
            [key]: value
        }));
    }

    //Allocate the lot if everything goes well
    allocateTheLot() {
        let vehiclesData = this.state.vehiclesData;
        let parkingLotsData = this.state.parkingLotsData;
        let vehiclesHistory = this.state.vehiclesHistory;

        let selectedLot = this.state.selectedLot;
        let vehicleNumber = this.state.vehicleNumber;

        let vcData = { lotId: selectedLot.lotId, timeOfArriaval: new Date().getTime(), vehicleType: selectedLot.capacity, timeOfExit: '', duration: '', amountPaid: '' };
        vehiclesData = { ...vehiclesData, [vehicleNumber]: vcData };
        vehiclesHistory = { ...vehiclesHistory, [vehicleNumber]: vcData };

        Object.keys(parkingLotsData).map((floor, index) => {
            parkingLotsData[floor] ? parkingLotsData[floor].map((lot) => {
                if (lot["lotId"] === selectedLot.lotId && lot["availability"] === true) {
                    lot["availability"] = false;
                }
            }) : ''
        })

        //Update the new object in the local storage
        localStorage.setItem("parkingLotsData", JSON.stringify(parkingLotsData));
        localStorage.setItem("vehiclesData", JSON.stringify(vehiclesData));
        localStorage.setItem("vehiclesHistory", JSON.stringify(vehiclesHistory));

        this.setState((state, props) => ({
            vehiclesData: vehiclesData,
            parkingLotsData: parkingLotsData,
            popup: false,
            selectedLot: false,
            vehicleType: '',
            vehicleNumber: ''
        }));
    }

    render() {
        return (
            <div className="d-flex flex-column allocate-lot-container align-items-center">
                <h2 className='mt-3 mb-4'>Allocate a Parking lot</h2>
                <div className="d-flex mt-4">
                    <p>Vehicle Type: </p>
                    <select className="select-vehicle" value={this.state.vehicleType ? this.state.vehicleType : ''} id="vehicleType" onChange={this.editVehicleDetails}>
                        <option value=""></option>
                        <option value="twoWheeler">Two Wheeler</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="suv">SUV</option>
                    </select>
                </div>
                <button className="park-buttons btn btn-primary mt-3 mb-3" onClick={this.checkLotAvailability}>Check Availability</button>

                {this.state.checkSlots && this.state.vehicleType != '' ? (this.state.lotAvailable ? this.state.availableLots + " lots are available" : "No lot is available") : ''}
           
                {/* Table representation of all the parking lots available for the given vehicle type */}
                {this.state.parkingLotsData ? <div className="parking-lots-table">
                    <table className={this.state.checkSlots && this.state.vehicleType != '' ? "available-slots-table" : ''}>
                        {Object.keys(this.state.parkingLotsData).map((floor, index) => (
                            <tr>
                                <td>Floor {index + 1}:</td>
                                {this.state.parkingLotsData[floor] ? this.state.parkingLotsData[floor].map((lot) => (
                                    <td onClick={() => lot.capacity == this.state.vehicleType && lot.availability == true ? this.selectTheLot(lot) : ''} id={lot.lotId} className={this.state.checkSlots && lot.capacity != this.state.vehicleType ? "not-applicable" : (lot.availability ? "available" : "not-available")}>{lot.lotId}</td>
                                )) : ''}
                            </tr>
                        ))}
                    </table>
                </div> : ''}

                <div className="d-flex justify-content-end mt-4 book-lot">
                    <button className={`park-buttons btn btn-success ${!this.state.selectedLot ? "block" : ''}`} onClick={() => this.setState((state, props) => ({
                        popup: true
                    }))} disabled={this.state.selectedLot ? false : true}>Allocate The Lot</button>
                </div>

                {this.state.popup ? <div className="vehicleNumberForm d-flex justify-content-center mt-4">
                    <input placeholder="Enter the Vehicle number" type="text" value={this.state.vehicleNumber ? this.state.vehicleNumber : ''} id="vehicleNumber" onChange={this.editVehicleNumber} />
                    <button onClick={this.allocateTheLot}>Confirm</button>
                </div> : ''}

            </div>


        )
    }
}

export default ParkVehicle;