/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "currentUser": () => (/* binding */ currentUser),
/* harmony export */   "renderBookings": () => (/* binding */ renderBookings)
/* harmony export */ });
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _images_mountain_logo_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _images_hotel_room_jpg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _api_calls_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var _Classes_Customer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);
/* harmony import */ var _Classes_Room_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _Classes_Booking_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(11);











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

let currentUser;
let customerClasses;
let roomClasses;
let bookingClasses;
let customers;
let rooms;
let bookings;

const promise = Promise.all([_api_calls_js__WEBPACK_IMPORTED_MODULE_3__.data.customers, _api_calls_js__WEBPACK_IMPORTED_MODULE_3__.data.rooms, _api_calls_js__WEBPACK_IMPORTED_MODULE_3__.data.bookings])
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
  renderAvailableRooms();
})

checkDatesButton.addEventListener("click", function() {
  renderAvailableRooms();
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
    return new _Classes_Room_js__WEBPACK_IMPORTED_MODULE_5__.Room(room.number, room.roomType, room.bidet, room.bedSize, room.numBeds, room.costPerNight);
  });
  bookingClasses = bookings.map(booking => {
    return new _Classes_Booking_js__WEBPACK_IMPORTED_MODULE_6__.Booking(booking);
  });
  customerClasses = customers.map(customer => {
    return new _Classes_Customer_js__WEBPACK_IMPORTED_MODULE_4__.Customer(customer, roomClasses, bookingClasses);
  });
}

const getTodaysDate = () => {
  let today = new Date().toLocaleDateString('en-US').split('/');
  today[0] = `0${today[0]}`
  let year = today.pop();
  today.unshift(year);
  today = today.join("-")
  bookingDate.setAttribute("value", today);
  bookingDate.setAttribute("min", today);
};

const renderTotalSpent = () => {
  currentUser.calculateMoneySpent();
  totalMoneyTag.innerText = " " + (Math.round(currentUser.totalSpent * 100) / 100).toFixed(2);
};

const renderBookings = () => {
  futureBookings.innerHTML = " ";
  pastBookings.innerHTML = " ";
  currentUser.calculateBookings();
  currentUser.futureBookings.forEach(booking => {
  futureBookings.innerHTML += `
    <div class="future-box booking-content">
      <p class="booking-id hidden">${booking.id}</p>
      <p class="future-content">Room ${booking.roomNumber}</p>
      <p class="future-content">${booking.date}</p>
      <button onclick="deleteData(${booking.id});" class="delete-btn">Cancel Reservation</button>
    </div>
  `;
  });
  currentUser.pastBookings.forEach(booking => {
  pastBookings.innerHTML += `
    <div class="past-box booking-content">
      <p class="booking-id hidden">${booking.id}</p>
      <p class="past-content">Room ${booking.roomNumber}</p>
      <p class="past-content">${booking.date}</p>
      <button onclick="deleteData(${booking.id});" class="delete-btn">Cancel Reservation</button>
    </div>
  `;
  });
};

const renderAvailableRooms = () => {
  const dateParts = bookingDate.value.split("-");
  currentUser.getRoomsPerDay(bookingDate.value);
  currentUser.getRoomsByType(roomType);
  availableRoomsContent.innerHTML = " "
  if (currentUser.availableRooms.length === 0) {
    availableRoomsContent.innerHTML += `
    <h1 class="error-msg">We're very sorry! It looks like there are no rooms available for this date. How about we try again for another day?</h1>
    `
  } else {
    currentUser.availableRooms.forEach(room => {
      availableRoomsContent.innerHTML += `
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img class="available-photo" src="./images/hotel-room.jpg" alt="A view of a   hotel room">
            <p class="front-details">Room ${room.number}</p>
          </div>
          <div class="flip-card-back">
            <div class="room-details">
              <h1 class="room-type">${room.type}</h1>
              <p class="room-description">${room.bedNum} ${room.bedSize} Sized Bed</p>
              <p class="room-description">Bidet: ${room.bidet}</p>
              <p class="room-description">Price Per Night: $${room.cost.toFixed(2)}</p>
            </div>
            <div onclick="postBooking(${currentUser.id}, ${dateParts[0]}, ${dateParts[1]}, ${dateParts[2]}, ${room.number});" class="btn-box"   id="book-button">
              <a href="#" class="btn">Book</a>
            </div>
          </div>
        </div>
      </div>
      `;
    });
  };
};

const logIn = () => {
  let userChars = username.value.split("");
  if (password.value === "overlook2021") {
    (0,_api_calls_js__WEBPACK_IMPORTED_MODULE_3__.fetchData)(`customers/${userChars[8]}${userChars[9]}`).then(setUser => {
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

window.postBooking = _api_calls_js__WEBPACK_IMPORTED_MODULE_3__.postBooking;

window.renderTotalSpent = renderTotalSpent;

window.renderBookings = renderBookings;

window.deleteData = _api_calls_js__WEBPACK_IMPORTED_MODULE_3__.deleteData;


/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _images_hotel_background_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
// Imports




var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_hotel_background_jpg__WEBPACK_IMPORTED_MODULE_3__.default);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  margin: 0px;\n  padding: 0px;\n  box-sizing: border-box;\n  /* border: black 1px solid; */\n}\n\n/* All Pages */\n\nbody {\n  padding: 30px;\n}\n\n.general {\n  height: 95vh;\n  background-image: linear-gradient(to left, rgba(112, 67, 110, .8), rgba(68, 55, 82, .8)), url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-size: cover;\n  background-position: top;\n  position: relative;\n}\n\n.logo-box {\n  display: flex;\n  position: absolute;\n  top: 40px;\n  left: 40px;\n}\n\n.logo {\n  height: 35px;\n}\n\n.company-name {\n  color: #e0e0e0;\n  font-size: 28px;\n  margin-left: 15px;\n}\n\n.content-box {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  text-align: center;\n}\n\n/* Main Page */\n\n.heading-primary {\n  color: #FFFFFF;\n  text-transform: uppercase;\n  backface-visibility: hidden;\n  margin-bottom: 60px;\n}\n\n.heading-primary-main {\n  display: block;\n  padding-left: 12px;\n  font-size: 60px;\n  font-weight: bold;\n  letter-spacing: 35px;\n}\n\n.heading-primary-sub {\n  display: block;\n  font-size: 20px;\n  font-weight: bolder;\n  letter-spacing: 17.4px;\n  margin-top: 15px;\n}\n\n/* Buttons */\n\n.btn:link,\n.btn:visited {\n  text-transform: uppercase;\n  text-decoration: none;\n  padding: 15px 40px;\n  display: inline-block;\n  border-radius: 100px;\n  transition: all 0.2s;\n  position: relative;\n}\n\n.btn:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 7px 15px #2a1236;\n}\n\n.btn:active {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 10px #2a1236;\n}\n\n.btn {\n  background-color: #FFFFFF;\n  color: #3a1a4a;\n  letter-spacing: 11px;\n  font-weight: bold;\n}\n\n/* Log In Page */\n\n.sign-in-form {\n  margin-bottom: 100px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 60vw;\n}\n\n.login-inputs {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  height: 3vh;\n  margin-top: 30px;\n}\n\n.form-label {\n  background-color: white;\n  width: 15vw;\n  height: 4vh;\n  padding-top: 7.5px;\n  margin-right: 4vw;\n  color: #2a1236;\n  font-weight: bold;\n}\n\n.form-input {\n  width: 20vw;\n  height: 4vh;\n  border-radius: 6px;\n  color: #2a1236;\n  font-weight: bold;\n  font-size: 16px;\n  text-align: center;\n  outline-color: #3a1a4a;\n  border: none;\n}\n\n.form-input:focus::placeholder {\n  color: transparent;\n}\n\n/* User Dashboard */\n\n.amount-spent {\n  display: flex;\n  justify-content: space-around;\n  position: absolute;\n  top: 120px;\n  right: 80px;\n  width: 15vw;\n  height: 4vh;\n  background-color: white;\n  color: #3a1a4a;\n  padding-top: 1vh;\n  border-radius: 4px;\n  box-shadow: 0 4px 10px #2a1236;\n}\n\n.dashboard-box {\n  height: 90vh;\n  width:80vw;\n  margin-top: 8vh;\n}\n\n.dashboard-content-box {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 80vh;\n  margin-top: 2vh;\n}\n\n#new-reserve-button {\n  margin-top: 20px;\n}\n\n.dash-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.dash-items-grid {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around;\n  overflow-y: scroll;\n}\n\n.dashboard-future-content {\n  width: 40vw;\n  height: 65vh;\n  background-color: rgba(255, 255, 255, .4);\n  border-radius: 6px;\n}\n\n.dashboard-past-content {\n  width: 32vw;\n  height: 65vh;\n  background-color: rgba(255, 255, 255, .4);\n  border-radius: 6px;\n}\n\n.booking-title {\n  background-color: white;\n  color: #3a1a4a;\n  text-align: center;\n  margin-top: 4vh;\n  margin-bottom: 5vh;\n  border-radius: 6px;\n  width: 80%;\n  letter-spacing: 8px;\n  box-shadow: 0 4px 10px #595d63;\n}\n\n.booking-content {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: flex-start;\n  background-color: white;\n  color: #3a1a4a;\n  border-radius: 10px;\n  padding-left: 1vw;\n  margin: 5px;\n  box-shadow: 0 6px 12px #595d63;\n  cursor: pointer;\n}\n\n.future-box {\n  width: 12vw;\n  height: 16vh;\n}\n\n.past-box {\n  width: 10vw;\n  height: 13.3vh;\n}\n\n.past-content {\n  font-size: 18px;\n}\n\n.future-content {\n  font-size: 20px;\n}\n\n/* Available Rooms */\n\n.available-box {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 80vw;\n  height: 80vh;\n  margin-top: 5vh;\n  background-color: rgba(255, 255, 255, .4);\n  border-radius: 10px;\n}\n\n.back-dash {\n  display: flex;\n  justify-content: space-around;\n  position: absolute;\n  top: 40px;\n  right: 40px;\n  width: 10vw;\n  height: 4vh;\n  background-color: white;\n  color: #3a1a4a;\n  padding-top: 1vh;\n  border-radius: 4px;\n  box-shadow: 0 4px 10px #2a1236;\n  cursor: pointer;\n}\n\n.available-title {\n  background-color: white;\n  border-radius: 6px;\n  width: 80%;\n  height: 5vh;\n  margin-top: 3vh;\n  padding-top: 0.6vh;\n  color: #3a1a4a;\n  font-size: 24px;\n  box-shadow: 0 4px 10px #595d63;\n}\n\n.booking-form {\n  display: flex;\n  justify-content: space-around;\n  width: 40vw;\n  margin-top: 2vh;\n}\n\n.booking-forms {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  height: 15vh;\n}\n\n.forms {\n  background-color: rgba(255, 255, 255, .8);\n  color: #3a1a4a;\n  width: 18vw;\n  height: 3vh;\n  margin-top: 2vh;\n  padding-top: 0.5vh;\n  box-shadow: 0 4px 10px #595d63;\n  border-radius: 6px;\n}\n\n#check-button {\n  margin-top: 5vh;\n}\n\n#check-btn:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 7px 15px #5c565e;\n}\n\n#check-btn:active {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 10px #5c565e;\n}\n\n.available-grid {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around;\n  align-items: flex-start;\n  margin-top: 8vh;\n  width: 100%;\n  height: 60vh;\n  overflow-y: scroll;\n}\n\n.available-rooms {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  background-color: white;\n  border-radius: 8px;\n  height: 32vh;\n  width: 16vw;\n  box-shadow: 0 6px 12px #595d63;\n  cursor: pointer;\n}\n\n.available-photo {\n  width: 100%;\n  height: auto;\n  border-top-left-radius: 6px;\n  border-top-right-radius: 6px;\n}\n\n/* Flip Card */\n\n.flip-card {\n  background-color: transparent;\n  width: 300px;\n  height: 300px;\n  perspective: 1000px;\n  margin: 2vh;\n}\n\n.flip-card-inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  transition: transform 0.6s;\n  transform-style: preserve-3d;\n  box-shadow: 0 4px 10px #595d63;\n  border-radius: 6px;\n}\n\n.flip-card:hover .flip-card-inner {\n  transform: rotateY(180deg);\n}\n\n.flip-card-front, .flip-card-back {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  border-radius: 6px;\n}\n\n.flip-card-front {\n  background-color: white;\n  color: black;\n}\n\n.flip-card-back {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  color: white;\n  background-color: #8d709e;\n  transform: rotateY(180deg);\n}\n\n.front-details {\n  color: #3a1a4a;\n  font-size: 22px;\n  padding-top: 12%;\n  text-transform: uppercase;\n}\n\n.room-type {\n  font-size: 26px;\n  padding-left: 10px;\n  padding-top: 10px;\n  text-transform: uppercase;\n}\n\n.room-description {\n  font-size: 22px;\n  padding-left: 10px;\n  padding-top: 15px;\n  text-transform: uppercase;\n}\n\n#book-button {\n  width: 3vw;\n  height: auto;\n  margin-bottom: 15px;\n  margin-right: 15px;\n}\n\n.hidden {\n  display: none;\n}\n", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"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","sourcesContent":["* {\n  margin: 0px;\n  padding: 0px;\n  box-sizing: border-box;\n  /* border: black 1px solid; */\n}\n\n/* All Pages */\n\nbody {\n  padding: 30px;\n}\n\n.general {\n  height: 95vh;\n  background-image: linear-gradient(to left, rgba(112, 67, 110, .8), rgba(68, 55, 82, .8)), url(../images/hotel-background.jpg);\n  background-size: cover;\n  background-position: top;\n  position: relative;\n}\n\n.logo-box {\n  display: flex;\n  position: absolute;\n  top: 40px;\n  left: 40px;\n}\n\n.logo {\n  height: 35px;\n}\n\n.company-name {\n  color: #e0e0e0;\n  font-size: 28px;\n  margin-left: 15px;\n}\n\n.content-box {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  text-align: center;\n}\n\n/* Main Page */\n\n.heading-primary {\n  color: #FFFFFF;\n  text-transform: uppercase;\n  backface-visibility: hidden;\n  margin-bottom: 60px;\n}\n\n.heading-primary-main {\n  display: block;\n  padding-left: 12px;\n  font-size: 60px;\n  font-weight: bold;\n  letter-spacing: 35px;\n}\n\n.heading-primary-sub {\n  display: block;\n  font-size: 20px;\n  font-weight: bolder;\n  letter-spacing: 17.4px;\n  margin-top: 15px;\n}\n\n/* Buttons */\n\n.btn:link,\n.btn:visited {\n  text-transform: uppercase;\n  text-decoration: none;\n  padding: 15px 40px;\n  display: inline-block;\n  border-radius: 100px;\n  transition: all 0.2s;\n  position: relative;\n}\n\n.btn:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 7px 15px #2a1236;\n}\n\n.btn:active {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 10px #2a1236;\n}\n\n.btn {\n  background-color: #FFFFFF;\n  color: #3a1a4a;\n  letter-spacing: 11px;\n  font-weight: bold;\n}\n\n/* Log In Page */\n\n.sign-in-form {\n  margin-bottom: 100px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 60vw;\n}\n\n.login-inputs {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  height: 3vh;\n  margin-top: 30px;\n}\n\n.form-label {\n  background-color: white;\n  width: 15vw;\n  height: 4vh;\n  padding-top: 7.5px;\n  margin-right: 4vw;\n  color: #2a1236;\n  font-weight: bold;\n}\n\n.form-input {\n  width: 20vw;\n  height: 4vh;\n  border-radius: 6px;\n  color: #2a1236;\n  font-weight: bold;\n  font-size: 16px;\n  text-align: center;\n  outline-color: #3a1a4a;\n  border: none;\n}\n\n.form-input:focus::placeholder {\n  color: transparent;\n}\n\n/* User Dashboard */\n\n.amount-spent {\n  display: flex;\n  justify-content: space-around;\n  position: absolute;\n  top: 120px;\n  right: 80px;\n  width: 15vw;\n  height: 4vh;\n  background-color: white;\n  color: #3a1a4a;\n  padding-top: 1vh;\n  border-radius: 4px;\n  box-shadow: 0 4px 10px #2a1236;\n}\n\n.dashboard-box {\n  height: 90vh;\n  width:80vw;\n  margin-top: 8vh;\n}\n\n.dashboard-content-box {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 80vh;\n  margin-top: 2vh;\n}\n\n#new-reserve-button {\n  margin-top: 20px;\n}\n\n.dash-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.dash-items-grid {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around;\n  overflow-y: scroll;\n}\n\n.dashboard-future-content {\n  width: 40vw;\n  height: 65vh;\n  background-color: rgba(255, 255, 255, .4);\n  border-radius: 6px;\n}\n\n.dashboard-past-content {\n  width: 32vw;\n  height: 65vh;\n  background-color: rgba(255, 255, 255, .4);\n  border-radius: 6px;\n}\n\n.booking-title {\n  background-color: white;\n  color: #3a1a4a;\n  text-align: center;\n  margin-top: 4vh;\n  margin-bottom: 5vh;\n  border-radius: 6px;\n  width: 80%;\n  letter-spacing: 8px;\n  box-shadow: 0 4px 10px #595d63;\n}\n\n.booking-content {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: flex-start;\n  background-color: white;\n  color: #3a1a4a;\n  border-radius: 10px;\n  padding-left: 1vw;\n  margin: 5px;\n  box-shadow: 0 6px 12px #595d63;\n  cursor: pointer;\n}\n\n.future-box {\n  width: 12vw;\n  height: 16vh;\n}\n\n.past-box {\n  width: 10vw;\n  height: 13.3vh;\n}\n\n.past-content {\n  font-size: 18px;\n}\n\n.future-content {\n  font-size: 20px;\n}\n\n/* Available Rooms */\n\n.available-box {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 80vw;\n  height: 80vh;\n  margin-top: 5vh;\n  background-color: rgba(255, 255, 255, .4);\n  border-radius: 10px;\n}\n\n.back-dash {\n  display: flex;\n  justify-content: space-around;\n  position: absolute;\n  top: 40px;\n  right: 40px;\n  width: 10vw;\n  height: 4vh;\n  background-color: white;\n  color: #3a1a4a;\n  padding-top: 1vh;\n  border-radius: 4px;\n  box-shadow: 0 4px 10px #2a1236;\n  cursor: pointer;\n}\n\n.available-title {\n  background-color: white;\n  border-radius: 6px;\n  width: 80%;\n  height: 5vh;\n  margin-top: 3vh;\n  padding-top: 0.6vh;\n  color: #3a1a4a;\n  font-size: 24px;\n  box-shadow: 0 4px 10px #595d63;\n}\n\n.booking-form {\n  display: flex;\n  justify-content: space-around;\n  width: 40vw;\n  margin-top: 2vh;\n}\n\n.booking-forms {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  height: 15vh;\n}\n\n.forms {\n  background-color: rgba(255, 255, 255, .8);\n  color: #3a1a4a;\n  width: 18vw;\n  height: 3vh;\n  margin-top: 2vh;\n  padding-top: 0.5vh;\n  box-shadow: 0 4px 10px #595d63;\n  border-radius: 6px;\n}\n\n#check-button {\n  margin-top: 5vh;\n}\n\n#check-btn:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 7px 15px #5c565e;\n}\n\n#check-btn:active {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 10px #5c565e;\n}\n\n.available-grid {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around;\n  align-items: flex-start;\n  margin-top: 8vh;\n  width: 100%;\n  height: 60vh;\n  overflow-y: scroll;\n}\n\n.available-rooms {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  background-color: white;\n  border-radius: 8px;\n  height: 32vh;\n  width: 16vw;\n  box-shadow: 0 6px 12px #595d63;\n  cursor: pointer;\n}\n\n.available-photo {\n  width: 100%;\n  height: auto;\n  border-top-left-radius: 6px;\n  border-top-right-radius: 6px;\n}\n\n/* Flip Card */\n\n.flip-card {\n  background-color: transparent;\n  width: 300px;\n  height: 300px;\n  perspective: 1000px;\n  margin: 2vh;\n}\n\n.flip-card-inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  transition: transform 0.6s;\n  transform-style: preserve-3d;\n  box-shadow: 0 4px 10px #595d63;\n  border-radius: 6px;\n}\n\n.flip-card:hover .flip-card-inner {\n  transform: rotateY(180deg);\n}\n\n.flip-card-front, .flip-card-back {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  border-radius: 6px;\n}\n\n.flip-card-front {\n  background-color: white;\n  color: black;\n}\n\n.flip-card-back {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  color: white;\n  background-color: #8d709e;\n  transform: rotateY(180deg);\n}\n\n.front-details {\n  color: #3a1a4a;\n  font-size: 22px;\n  padding-top: 12%;\n  text-transform: uppercase;\n}\n\n.room-type {\n  font-size: 26px;\n  padding-left: 10px;\n  padding-top: 10px;\n  text-transform: uppercase;\n}\n\n.room-description {\n  font-size: 22px;\n  padding-left: 10px;\n  padding-top: 15px;\n  text-transform: uppercase;\n}\n\n#book-button {\n  width: 3vw;\n  height: auto;\n  margin-bottom: 15px;\n  margin-right: 15px;\n}\n\n.hidden {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/hotel-background.jpg");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/mountain-logo.png");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/hotel-room.jpg");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "data": () => (/* binding */ data),
/* harmony export */   "fetchData": () => (/* binding */ fetchData),
/* harmony export */   "deleteData": () => (/* binding */ deleteData),
/* harmony export */   "postBooking": () => (/* binding */ postBooking)
/* harmony export */ });
/* harmony import */ var _Classes_Booking_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _scripts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);




const fetchData = (data) => fetch(`http://localhost:3001/api/v1/${data}`).then(response => response.json());

const deleteData = (data) => fetch(`http://localhost:3001/api/v1/bookings/${data}`, { method: 'DELETE' })
    .then((removal) => {
      _scripts_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.allBookings.forEach(deletion => {
        if (deletion.id === `${data}`) {
          _scripts_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.allBookings.splice(_scripts_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.allBookings.indexOf(deletion), 1)
        };
      });
      (0,_scripts_js__WEBPACK_IMPORTED_MODULE_1__.renderBookings)();
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
    let userBooking = new _Classes_Booking_js__WEBPACK_IMPORTED_MODULE_0__.Booking(data.newBooking)
    _scripts_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.allBookings.push(userBooking)
    _scripts_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.availableRooms.splice(_scripts_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.availableRooms.indexOf(userBooking), 1)
    renderAvailableRooms()
    console.log("Booking added successfully")
  }).catch(error => console.log("Booking not added successfully"))
};

const data = {
  customers: fetchData("customers"),
  rooms: fetchData("rooms"),
  bookings: fetchData("bookings"),
};







/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Booking": () => (/* binding */ Booking),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Booking {
  constructor({id: id, userID: userID, date: date, roomNumber: roomNumber}) {
    this.id = id;
    this.userID = userID;
    this.date = date;
    this.roomNumber = roomNumber;
  };

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Booking);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Customer": () => (/* binding */ Customer),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Customer {
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

  calculateMoneySpent(value) {
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
    console.log(this.unavailableRooms);
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
    if (input.value === "any") {
      return;
    } else {
      this.availableRooms.forEach(room => {
        if (input.value === room.type) {
          array.push(room);
        }
      });
    };
    this.availableRooms = array;
  };

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Customer);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Room": () => (/* binding */ Room),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Room {
  constructor(number, type, bidet, bedSize, bedNum, cost) {
    this.number = number;
    this.type = type;
    this.bidet = bidet;
    this.bedSize = bedSize;
    this.bedNum = bedNum;
    this.cost = cost;
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Room);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map