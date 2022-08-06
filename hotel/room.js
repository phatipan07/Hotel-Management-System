class Room {
  constructor(floor, number) {
    this.floor = floor;
    this.number = this.setRoomNumber(floor, number);
    this.keyCard = number + floor;
    this.available = true;
  }

  setRoomNumber(floor, n) {
    var length = String(10).length - String(n).length + 1;
    const number = length > 0 ? new Array(length).join("0") + n : n;
    return `${floor}${number}`;
  }

  setAvailable(value) {
    this.available = value;
  }
}

module.exports.Room = Room;
