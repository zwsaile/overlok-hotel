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
    let num = 0
    this.allBookings.forEach(booking => {
      this.allRooms.forEach(room => {
        if (this.id === booking.userID && room.number === booking.roomNumber) {
          num += room.cost;
        };
      });
    });
    this.totalSpent = num
  };

  calculateBookings() {
    this.futureBookings = [];
    this.pastBookings = [];
    this.allBookings.forEach(booking => {
      if (this.id === booking.userID && new Date(booking.date) >= new Date()) {
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
    this.unavailableRooms = [];
    this.availableRooms = [];
    let actuallyToday = new Date(date)
    actuallyToday.setDate(actuallyToday.getDate() + 1)
    this.allBookings.forEach(booking => {
      if (new Date(booking.date).toLocaleDateString('en-US') === new Date(actuallyToday).toLocaleDateString('en-US')) {
        this.unavailableRooms.push(booking)
      };
    });
    this.allRooms.forEach(room => {
      this.availableRooms.push(room);
      this.unavailableRooms.forEach(unRoom => {
        if (room.number === unRoom.roomNumber) {
          this.availableRooms.splice(this.availableRooms.indexOf(room), 1)
        };
      });
    });
  };

  getRoomsByType(input) {
    let array = []
    if (input === "any") {
      return;
    } else {
      this.availableRooms.forEach(room => {
        if (input === room.type) {
          array.push(room);
        }
      });
    };
    this.availableRooms = array;
  };

};

export default Customer;
