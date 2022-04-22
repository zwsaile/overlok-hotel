export class Customer {
  constructor({id: id, name: name}, allRooms, allBookings) {
    this.id = id;
    this.name = name;
    this.allRooms = allRooms;
    this.availableRooms = [];
    this.unavailableRooms = [];
    this.allBookings = allBookings;
    this.pastBookings = [];
    this.futureBookings = [];
    this.totalSpent = 0;
  };

calculateMoneySpent() {
  this.allBookings.forEach(booking => {
    this.allRooms.forEach(room => {
      if (this.id === booking.userID && room.number === booking.roomNum) {
        this.totalSpent += room.cost;
      };
    });
  });
};

calculateBookings() {
  this.allBookings.forEach(booking => {
    if (this.id === booking.userID && new Date(booking.date) > new Date()) {
      this.futureBookings.push(booking);
      this.futureBookings = this.futureBookings.sort((a, b) => new Date(a.date) - new Date(b.date))
      this.futureBookings.forEach(booking => {
        booking.date = new Date(booking.date).toLocaleDateString("en-US")
      });
    } else if (this.id === booking.userID && new Date(booking.date) < new Date()) {
      this.pastBookings.push(booking);
      this.pastBookings = this.pastBookings.sort((a, b) => new Date(a.date) - new Date(b.date))
      this.pastBookings.forEach(booking => {
        booking.date = new Date(booking.date).toLocaleDateString("en-US")
      });
    }
  });
};

getRoomsPerDay(date) {
  this.unavailableRooms = []
  this.unavailableRooms = this.allBookings.filter(booking => booking.date === date.value.split("-").join("/"));
  this.availableRooms = [];
  this.allRooms.forEach(room => {
    this.availableRooms.push(room);
    this.unavailableRooms.forEach(unRoom => {
      if (room.number === unRoom.roomNum) {
        this.availableRooms.splice(this.availableRooms.indexOf(room), 1)
      };
    });
  });
};

};

export default Customer;
