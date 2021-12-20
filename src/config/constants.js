export default {
    parkingLotsData: {
        floor1: [{ lotId: 'A1', capacity: 'twoWheeler', availability: true }, { lotId: 'B1', capacity: 'hatchback', availability: true }, { lotId: 'C1', capacity: 'twoWheeler', availability: true }, { lotId: 'D1', capacity: 'suv', availability: true }, { lotId: 'E1', capacity: 'hatchback', availability: true }, { lotId: 'F1', capacity: 'suv', availability: true }],
        floor2: [{ lotId: 'A2', capacity: 'hatchback', availability: true }, { lotId: 'B2', capacity: 'twoWheeler', availability: true }, { lotId: 'C2', capacity: 'suv', availability: true }, { lotId: 'D2', capacity: 'twoWheeler', availability: true }, { lotId: 'E2', capacity: 'suv', availability: true }, { lotId: 'F2', capacity: 'hatchback', availability: true }],
        floor3: [{ lotId: 'A3', capacity: 'suv', availability: true }, { lotId: 'B3', capacity: 'hatchback', availability: true }, { lotId: 'C3', capacity: 'twoWheeler', availability: true }, { lotId: 'D3', capacity: 'hatchback', availability: true }, { lotId: 'E3', capacity: 'twoWheeler', availability: true }, { lotId: 'F3', capacity: 'suv', availability: true }]
    },
    vehicleHourlyRates: {
        twoWheeler: { uptoTwo: 20, uptoFour: 40, beyondFour: 60 },
        hatchback: { uptoTwo: 30, uptoFour: 50, beyondFour: 70 },
        suv: { uptoTwo: 40, uptoFour: 60, beyondFour: 80 }
    },
    vehiclesData: {},
    vehiclesHistory: {}
}