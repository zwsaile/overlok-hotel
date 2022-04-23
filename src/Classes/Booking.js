export class Booking {
  constructor({id: id, userID: userID, date: date, roomNumber: roomNumber}) {
    this.id = id;
    this.userID = userID;
    this.date = date;
    this.roomNumber = roomNumber;
  };

};

export default Booking
