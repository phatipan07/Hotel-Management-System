const fs = require("fs");
const { Hotel } = require("./hotel");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

const main = () => {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let hotel = null;
  commands.forEach((command) => {
    const params = command.params;
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        hotel = new Hotel(floor, roomPerFloor);
        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );
        return;
      case "book":
        const booked = hotel.book(...params);
        console.log(booked.message);
        return;
      case "list_available_rooms":
        const listAvilable = hotel.listAvailableRooms();
        console.log(listAvilable.join(", "));
        return;
      case "checkout":
        const checkout = hotel.checkout(...params);
        console.log(checkout);
        return;
      case "list_guest":
        const listGuest = hotel.listGuest();
        console.log(listGuest);
        return;
      case "get_guest_in_room":
        const ListByRoom = hotel.getGuestInRoom(...params);
        console.log(ListByRoom);
        return;
      case "list_guest_by_age":
        const listsByAge = hotel.listGuestByAge(...params);
        console.log(listsByAge);
        return;
      case "list_guest_by_floor":
        const listCustomerInfoor = hotel.listGuestByFloor(...params);
        console.log(listCustomerInfoor);
        return;
      case "checkout_guest_by_floor":
        const checkoutByFloor = hotel.checkoutByFloor(...params);
        console.log(checkoutByFloor);
        return;
      case "book_by_floor":
        const bookingByFloor = hotel.bookByFloor(...params);
        console.log(bookingByFloor);
        return;

      default:
    }
  });
};

const getCommandsFromFileName = (fileName) => {
  const file = fs.readFileSync(fileName, "utf-8");
  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
};

main();
