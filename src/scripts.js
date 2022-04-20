import './css/styles.css';
import './images/mountain-logo.png';
import './images/hotel-room.jpg';
import { data } from "./api-calls.js"
import { Customer } from "./Classes/Customer.js"
import { Room } from "./Classes/Room.js"
import { Booking } from "./Classes/Booking.js"

const mainPage = document.querySelector(".main-page");
const mainBox = document.querySelector(".main-box");
const mainButton = document.getElementById("main-button");

const loginPage = document.querySelector(".login-page");
const loginBox = document.querySelector(".login-box");
const loginButton = document.getElementById("login-button");

const dashboardPage = document.querySelector(".dashboard-page");
const dashboardBox = document.querySelector(".dashboard-box");
const newReserveButton = document.getElementById("new-reserve-button");

const availableRoomsPage = document.querySelector(".available-rooms-page");
const backToDash = document.querySelector(".back-dash");

const bookingDate = document.getElementById("booking-date");

let currentUser;
let customers;
let customerClasses;
let rooms;
let roomClasses;
let bookings;
let bookingClasses;

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
  hideElement(loginPage);
  showElement(dashboardPage);
  createDataClasses();
  getRandomUser();
  console.log(currentUser);
});

newReserveButton.addEventListener("click", function() {
  hideElement(dashboardPage);
  showElement(availableRoomsPage);
})

backToDash.addEventListener("click", function() {
  hideElement(availableRoomsPage);
  showElement(dashboardPage);
})

const getRandomUser = () => {
  currentUser = customerClasses[Math.floor(Math.random() * customerClasses.length)];
};

const showElement = (element) => {
  element.classList.remove("hidden");
};

const hideElement = (element) => {
  element.classList.add("hidden");
};

const createDataClasses = () => {
  customerClasses = customers.map(customer => {
    return new Customer(customer);
  });
  roomClasses = rooms.map(room => {
    return new Room(room.number, room.roomType, room.bidet, room.bedSize, room.numBeds, room.costPerNight);
  });
  bookingClasses = bookings.map(booking => {
    return new Booking(booking.id, booking.userId, booking.date, booking.roomNumber);
  });
}

const getTodaysDate = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  };
  if (mm < 10) {
    mm = '0' + mm
  };

  today = yyyy + '-' + mm + '-' + dd;
  bookingDate.setAttribute("value", today);
  bookingDate.setAttribute("min", today);
};

const checkAvailableRooms = () => {
  
}
