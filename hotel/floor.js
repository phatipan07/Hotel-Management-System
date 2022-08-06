const { Room } = require("./room");

class Floor {
  constructor(number, roomPerFloor) {
    this.number = number;
    this.rooms = this.createRoom(roomPerFloor);
  }

  createRoom(roomPerFloor) {
    const room = [...Array(roomPerFloor).keys()];
    return room.map((item) => {
      const roomNumber = item + 1;
      return new Room(this.number, roomNumber);
    });
  }
}

module.exports.Floor = Floor;
