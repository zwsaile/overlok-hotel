import chai from 'chai';
const expect = chai.expect;
import Customer from "../src/Classes/Customer.js"



describe('Customer', () => {

  let customer;
  let customers;
  let bookings;
  let rooms;

    beforeEach(() => {
      customers = [
        {
          "id": 1,
          "name": "Leatha Ullrich"
        },
        {
          "id": 2,
          "name": "Rocio Schuster"
        },
        {
          "id": 3,
          "name": "Kelvin Schiller"
        }
      ];

      rooms = [
        {
          "number": 1,
          "type": "residential suite",
          "bidet": true,
          "bedSize": "queen",
          "numBeds": 1,
          "cost": 358.4
        },
        {
          "number": 2,
          "type": "suite",
          "bidet": false,
          "bedSize": "full",
          "numBeds": 2,
          "cost": 477.38
        },
        {
          "number": 3,
          "type": "single room",
          "bidet": false,
          "bedSize": "king",
          "numBeds": 1,
          "cost": 491.14
        },
        {
          "number": 4,
          "type": "suite",
          "bidet": true,
          "bedSize": "queen",
          "numBeds": 2,
          "cost": 458.4
        },
        {
          "number": 5,
          "type": "junior suite",
          "bidet": true,
          "bedSize": "full",
          "numBeds": 1,
          "cost": 311.38
        },
        {
          "number": 6,
          "type": "single room",
          "bidet": false,
          "bedSize": "king",
          "numBeds": 1,
          "cost": 401.14
        }
      ];

      bookings = [
        {
          "id": "5fwrgu4i7k55hl6sz",
          "userID": 1,
          "date": "2022/04/22",
          "roomNumber": 3
        },
        {
          "id": "5fwrgu4i7k55hl6t5",
          "userID": 2,
          "date": "2022/01/24",
          "roomNumber": 2
        },
        {
          "id": "5fwrgu4i7k55hl6t6",
          "userID": 3,
          "date": "2022/01/10",
          "roomNumber": 1
        },
        {
          "id": "5fwrgu4i7k55hl6sz",
          "userID": 2,
          "date": "2022/04/29",
          "roomNumber": 1
        },
        {
          "id": "5fwrgu4i7k55hl6t5",
          "userID": 1,
          "date": "2022/06/24",
          "roomNumber": 3
        },
        {
          "id": "5fwrgu4i7k55hl6t6",
          "userID": 1,
          "date": "2022/05/10",
          "roomNumber": 2
        }
      ];

      customer = new Customer(customers[0], rooms, bookings);

    });

  it('should be a function', () => {
    expect(Customer).to.be.a('function');
  });

  it('should be able to take different users', () => {
    expect(customer.id).to.equal(1);
    customer = new Customer(customers[1], rooms, bookings);
    expect(customer.id).to.equal(2);
  });

  it('should be able to store rooms', () => {
    expect(customer.allRooms).to.have.lengthOf(6);
  });

  it('should be able to store bookings', () => {
    expect(customer.allBookings).to.have.lengthOf(6);
  });

  it('should be able to count how much money has been spent', () => {
    customer.calculateMoneySpent();
    expect(customer.totalSpent).to.equal(1459.6599999999999);
  });

  it('should be able to keep track all past and future bookings', () => {
    customer.calculateBookings();
    expect(customer.futureBookings).to.have.lengthOf(2);
    expect(customer.pastBookings).to.have.lengthOf(1);
  });

  it('should be able to sort available rooms by date', () => {
    let date = new Date();
    customer.getRoomsPerDay(date);
    expect(customer.availableRooms).to.have.lengthOf(6);
  });

  it('should be able to sort rooms by room type', () => {
    let date = new Date();
    customer.getRoomsPerDay(date);
    customer.getRoomsByType("suite")
    expect(customer.availableRooms).to.have.lengthOf(2);
  });

});
