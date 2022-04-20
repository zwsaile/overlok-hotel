export class Customer {
  constructor({id: id, name: name}, pastBookings, futureBookings, totalSpent) {
    this.id = id;
    this.name = name;
    this.pastBookings = pastBookings;
    this.futureBookings = futureBookings;
    this.totalSpent = totalSpent;
  };


};

export default Customer;
