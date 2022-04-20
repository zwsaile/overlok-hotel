import './css/styles.css';
import './images/mountain-logo.png';
import './images/hotel-room.jpg';

const mainPage = document.querySelector(".main-page");
const mainBox = document.querySelector(".main-box");
const mainButton = document.getElementById("main-button");

const loginPage = document.querySelector(".login-page");
const loginBox = document.querySelector(".login-box");
const loginButton = document.getElementById("login-button");

const dashboardPage = document.querySelector(".dashboard-page");
const dashboardBox = document.querySelector(".dashboard-box");

mainButton.addEventListener("click", function() {
  hideElement(mainPage);
  showElement(loginPage);
});
loginButton.addEventListener("click", function() {
  hideElement(loginPage);
  showElement(dashboardPage);
});

const showElement = (element) => {
  element.classList.remove("hidden");
};

const hideElement = (element) => {
  element.classList.add("hidden");
};
