const fetchData = (data) => fetch(`http://localhost:3001/api/v1/${data}`).then(response => response.json());

const data = {
  customers: fetchData("customers"),
  rooms: fetchData("rooms"),
  bookings: fetchData("bookings"),
};

export { data }
