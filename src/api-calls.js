import { Booking } from "./Classes/Booking.js";
import { currentUser } from "./scripts.js";
import { renderBookings } from "./scripts.js";

const fetchData = (data) => fetch(`http://localhost:3001/api/v1/${data}`).then(response => response.json());

const deleteData = (data) => fetch(`http://localhost:3001/api/v1/bookings/${data}`, { method: 'DELETE' })
    .then((removal) => {
      currentUser.allBookings.forEach(deletion => {
        if (deletion.id === `${data}`) {
          currentUser.allBookings.splice(currentUser.allBookings.indexOf(deletion), 1)
        };
      });
      renderBookings();
      renderTotalSpent();
      console.log("Booking removed successfully")
  }).catch((error) => console.log("Booking not removed successfully"))

const postBooking = (userID, year, month, day, roomNumber) => {
  fetch("http://localhost:3001/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify({
      userID: userID,
      date:  `${year}/${month}/${day}`,
      roomNumber: roomNumber
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json()).then(data => {
    let userBooking = new Booking(data.newBooking)
    currentUser.allBookings.push(userBooking)
    currentUser.availableRooms.splice(currentUser.availableRooms.indexOf(userBooking), 1)
    renderAvailableRooms()
    console.log("Booking added successfully")
  }).catch(error => console.log("Booking not added successfully"))
};

const data = {
  customers: fetchData("customers"),
  rooms: fetchData("rooms"),
  bookings: fetchData("bookings"),
};

export { data }
export { fetchData }
export { deleteData }
export { postBooking }
