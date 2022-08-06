const { Floor } = require("./floor");

class Hotel {
  constructor(floors = 0, roomPerFloor = 0) {
    this.bookings = [];
    this.keyCards = [];
    this.floors = this.createFloors(floors, roomPerFloor);
  }

  createFloors(floorLenght, roomPerFloor) {
    const floors = [...Array(floorLenght).keys()];
    return floors.map((item) => {
      const numberOfFloor = item + 1;
      return new Floor(numberOfFloor, roomPerFloor);
    });
  }

  findRoom(roomNumber) {
    return this.floors
      .map((f) => f.rooms.find((r) => r.number == roomNumber))
      .find((f) => f !== undefined);
  }

  listAvailableRooms() {
    return this.floors.reduce((result, f) => {
      const rooms = f.rooms.filter((r) => r.available).map((r) => r.number);
      return result.concat(rooms);
    }, []);
  }

  checkIsUnavailable(roomNumber) {
    return this.bookings.find(
      (b) => b.roomNumber === roomNumber && b.status === "checkin"
    );
  }

  generateKeycard() {
    let number = 1;

    if (this.keyCards.length === 0) {
      this.keyCards.push({
        number,
        available: false,
      });
      return number;
    }

    const findKeycard = this.keyCards.find((k) => k.available);

    if (findKeycard === undefined) {
      const keys = this.keyCards.sort(function (a, b) {
        return b.number - a.number;
      });

      number = keys[0].number + 1;

      this.keyCards.push({
        number,
        available: false,
      });
    } else {
      number = findKeycard.number;

      this.keyCards = this.keyCards
        .sort(function (a, b) {
          return a.number - b.number;
        })
        .map((k) => {
          return {
            ...k,
            available: k.number === number ? false : k.available,
          };
        });
    }

    return number;
  }

  book(roomNumber, customerName, customerAge) {
    const isUnavailable = this.checkIsUnavailable(roomNumber);
    // console.log(isUnavailable)
    if (isUnavailable !== undefined) {
      return {
        message: `Cannot book room ${roomNumber} for ${customerName}, The room is currently booked by ${isUnavailable.customerName}.`,
      };
    }

    const room = this.findRoom(roomNumber);
    if (room === undefined) {
      return `The room is not found.`;
    }

    const keyCard = this.generateKeycard();
    room.setAvailable(false);
    const book = {
      roomNumber,
      customerName,
      customerAge,
      keyCard,
      status: "checkin",
      room,
    };
    this.bookings.push(book);

    return {
      message: `Room ${roomNumber} is booked by ${customerName} with keycard number ${keyCard}.`,
      book,
    };
  }

  checkout(keyCard, customerName) {
    const book = this.bookings.find(
      (b) => b.keyCard === keyCard && b.status == "checkin"
    );

    if (book === undefined || book.customerName !== customerName) {
      return `Only ${book.customerName} can checkout with keycard number 1.`;
    }

    this.keyCards = this.keyCards.map((k) => {
      return {
        ...k,
        available: book.keyCard == k.number ? true : k.available,
      };
    });

    this.bookings = this.bookings.map((b) => {
      const status =
        b.keyCard === keyCard && b.status == "checkin" ? "checkout" : b.status;
      return {
        ...b,
        status,
      };
    });

    return `Room ${book.roomNumber} is checkout.`;
  }

  checkoutByFloor(foor) {
    const bookInFoor = this.bookings
      .filter((b) => b.status == "checkin" && b.room.floor == foor)
      .reduce((r, b) => {
        this.checkout(b.keyCard, b.customerName);
        r.push(b.roomNumber);
        return r;
      }, []);
    return `Room ${bookInFoor.join(", ")} are chckout.`;
  }

  listGuest() {
    return this.bookings
      .filter((b, i, a) => {
        return b.status == "checkin" && a.indexOf(b) === i;
      })
      .map((b) => b.customerName)
      .join(", ");
  }

  getGuestInRoom(room) {
    return this.bookings.find((b) => b.roomNumber == room).customerName;
  }

  listGuestByAge(opl, age) {
    return this.bookings
      .filter((b) => eval(`${b.customerAge} ${opl} ${age}`))
      .map((b) => b.customerName)
      .join(", ");
  }

  listGuestByFloor(floor) {
    return this.bookings
      .filter((b) => b.room.floor == floor && b.status === "checkin")
      .map((b) => b.customerName)
      .join(", ");
  }

  bookByFloor(floor, customerName, customerAge) {
    const haveRoomAvailable = this.bookings.filter(
      (b) => b.room.floor == floor && b.status === "checkin"
    );
    if (haveRoomAvailable.length > 0) {
      return `Cannot book floor ${floor} for ${customerName}.`;
    }
    const booked = this.floors
      .find((f) => f.number === floor)
      .rooms.reduce(
        (r, f) => {
          const booked = this.book(f.number, customerName, customerAge);
          r.rooms.push(booked.book.roomNumber);
          r.keys.push(booked.book.keyCard);
          return r;
        },
        {
          rooms: [],
          keys: [],
        }
      );
    const rooms = booked.rooms.join(", ");
    const keys = booked.rooms.join(", ");
    return `Room ${rooms} are booked with keycard number ${keys}`;
  }
}

module.exports.Hotel = Hotel;
