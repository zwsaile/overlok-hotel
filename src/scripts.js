import './css/styles.css';
import './images/mountain-logo.png';
import './images/hotel-room.jpg';
import { data } from "./api-calls.js";
import { fetchData } from "./api-calls.js";
import { deleteData } from "./api-calls.js";
import { postBooking } from "./api-calls.js";
import { Customer } from "./Classes/Customer.js";
import { Room } from "./Classes/Room.js";
import { Booking } from "./Classes/Booking.js";

const mainPage = document.querySelector(".main-page");
const mainBox = document.querySelector(".main-box");
const mainButton = document.getElementById("main-button");

const loginPage = document.querySelector(".login-page");
const loginBox = document.querySelector(".login-box");
const loginButton = document.getElementById("login-button");
const username = document.getElementById("name");
const password = document.getElementById("password");

const dashboardPage = document.querySelector(".dashboard-page");
const dashboardBox = document.querySelector(".dashboard-box");
const newReserveButton = document.getElementById("new-reserve-button");
const roomType = document.getElementById("room-type");
const futureBookings = document.querySelector(".future-grid");
const pastBookings = document.querySelector(".past-grid");
const totalMoneyTag = document.querySelector(".total-money");

const availableRoomsPage = document.querySelector(".available-rooms-page");
const availableRoomsContent = document.querySelector(".available-grid");
const backToDash = document.querySelector(".back-dash");
const checkDatesButton = document.getElementById("check-button");
const bookingDate = document.getElementById("booking-date");

export let currentUser;
let customers;
let customerClasses;
let rooms;
let roomClasses;
let bookings;
let bookingClasses;
let hotelClass;

const promise = Promise.all([data.customers, data.rooms, data.bookings])
  .then(results => {
    customers = results[0].customers;
    rooms = results[1].rooms;
    bookings = results[2].bookings;
  }).catch(error => console.log("Failed to retrieve data. Reload page."));

window.addEventListener("load", function() {
  getTodaysDate();
})

mainButton.addEventListener("click", function() {
  hideElement(mainPage);
  showElement(loginPage);
});

loginButton.addEventListener("click", function() {
  if (logIn()) {
    createDataClasses();
    hideElement(loginPage);
    showElement(dashboardPage);
  } else {
    return;
  }
});

newReserveButton.addEventListener("click", function() {
  hideElement(dashboardPage);
  showElement(availableRoomsPage);
  renderAvailableRooms(bookingDate.value.split("-").join("/"));
})

checkDatesButton.addEventListener("click", function() {
  renderAvailableRooms(bookingDate.value.split("-").join("/"));
})

backToDash.addEventListener("click", function() {
  hideElement(availableRoomsPage);
  showElement(dashboardPage);
  renderTotalSpent();
  renderBookings();
})

const showElement = (element) => {
  element.classList.remove("hidden");
};

const hideElement = (element) => {
  element.classList.add("hidden");
};

const createDataClasses = () => {
  roomClasses = rooms.map(room => {
    return new Room(room.number, room.roomType, room.bidet, room.bedSize, room.numBeds, room.costPerNight);
  });
  bookingClasses = bookings.map(booking => {
    return new Booking(booking);
  });
  customerClasses = customers.map(customer => {
    return new Customer(customer, roomClasses, bookingClasses);
  });
}

const getTodaysDate = () => {
  const today = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
  bookingDate.setAttribute("value", today);
  bookingDate.setAttribute("min", today);
};

const renderTotalSpent = () => {
  currentUser.calculateMoneySpent();
  totalMoneyTag.innerText = " " + (Math.round(currentUser.totalSpent * 100) / 100).toFixed(2);
};

export const renderBookings = () => {
  futureBookings.innerHTML = " ";
  pastBookings.innerHTML = " ";
  currentUser.calculateBookings();
  currentUser.futureBookings.forEach(booking => {
  futureBookings.innerHTML += `
    <div class="future-box booking-content">
      <p class="booking-id hidden">${booking.id}</p>
      <p class="future-content">Room ${booking.roomNumber}</p>
      <p class="future-content">${booking.date}</p>
      <button onclick="deleteData(${booking.id});" class="delete-btn">Delete</p>
    </div>
  `;
  });
  currentUser.pastBookings.forEach(booking => {
  pastBookings.innerHTML += `
    <div class="past-box booking-content">
      <p class="booking-id hidden">${booking.id}</p>
      <p class="past-content">Room ${booking.roomNumber}</p>
      <p class="past-content">${booking.date}</p>
    </div>
  `;
  });
};

const renderAvailableRooms = (date) => {
  const dateParts = bookingDate.value.split("-");
  currentUser.getRoomsPerDay(bookingDate);
  currentUser.getRoomsByType(roomType);
  availableRoomsContent.innerHTML = " "
  if (currentUser.availableRooms.length === 0) {
    availableRoomsContent.innerHTML += `
    <h1 class="error-msg">We're very sorry! It looks like there are no rooms available for this date. How about we try again for another day?</h1>
    `
  }
  currentUser.availableRooms.forEach(room => {
    availableRoomsContent.innerHTML += `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img class="available-photo" src="./images/hotel-room.jpg" alt="A view of a hotel room">
          <p class="front-details">Room ${room.number}</p>
        </div>
        <div class="flip-card-back">
          <div class="room-details">
            <h1 class="room-type">${room.type}</h1>
            <p class="room-description">${room.bedNum} ${room.bedSize} Sized Bed</p>
            <p class="room-description">Bidet: ${room.bidet}</p>
            <p class="room-description">Price Per Night: $${room.cost.toFixed(2)}</p>
          </div>
          <div onclick="postBooking(${currentUser.id}, ${dateParts[0]}, ${dateParts[1]}, ${dateParts[2]}, ${room.number});" class="btn-box" id="book-button">
            <a href="#" class="btn">Book</a>
          </div>
        </div>
      </div>
    </div>
    `;
  });
  currentUser.getRoomsPerDay(bookingDate)
};

const logIn = () => {
  let userChars = username.value.split("");
  if (password.value === "overlook2021") {
    fetchData(`customers/${userChars[8]}${userChars[9]}`).then(setUser => {
      customerClasses.forEach(user => {
        if (user.id === setUser.id) {
          currentUser = user;
        };
      });
    }).then(data => {
      renderTotalSpent();
      renderBookings();
    })
    return true;
  } else {
    return false;
  };
};

window.postBooking = postBooking;

window.renderTotalSpent = renderTotalSpent;

window.renderBookings = renderBookings;

window.deleteData = deleteData;
