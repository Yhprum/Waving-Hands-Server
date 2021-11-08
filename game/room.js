class Room {
  constructor(id, player) {
    this.gameId = id;
    this.players = [player];
    this.stats = {};
    this.history = {};
  }

  join(player) {
    this.players.push(player);
  }

  leave(username) {
    if (this.players.indexOf(username) !== -1){
      this.players.splice(this.players.indexOf(username), 1);
    }
  }

  start() {
    this.players.forEach(player => {
      this.stats[player] = {
        hp: 15,
        enchantments: [],
        summons: []
      };
      this.history[player] = [];
    });
  }
}

exports.Room = Room;