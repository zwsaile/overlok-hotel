import './css/styles.css';
import './images/mountain-logo.png';
import './images/hotel-room.jpg';
import { data } from "./api-calls.js";

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

let currentUser;
let customers;
let rooms;
let bookings;

const promise = Promise.all([data.customers, data.rooms, data.bookings])
  .then(results => {
    customers = results[0].customers;
    rooms = results[1].rooms;
    bookings = results[2].bookings;
  })
  .then(randomUser => {
    getRandomUser(customers);
  })
  .catch(error => console.log("Failed to retrieve data. Reload page."));

mainButton.addEventListener("click", function() {
  hideElement(mainPage);
  showElement(loginPage);
});

loginButton.addEventListener("click", function() {
  hideElement(loginPage);
  showElement(dashboardPage);
});

newReserveButton.addEventListener("click", function() {
  hideElement(dashboardPage);
  showElement(availableRoomsPage);
})

const getRandomUser = () => {
  currentUser = customers[Math.floor(Math.random() * customers.length)];
};

const showElement = (element) => {
  element.classList.remove("hidden");
};

const hideElement = (element) => {
  element.classList.add("hidden");
};
