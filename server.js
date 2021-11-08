const { Server } = require("socket.io");
const { calculateState } = require("./game/game");
const { Room } = require("./game/room");

const games = {};
// Example game state for now
const game = {
  history: {
    "you": [["F", "P"], ["P", "W"], ["W", ">"], ["P", "W"], ["F", "W"], ["S", "W"], ["S", "P"], ["S", "S"]],
    "enemy": [["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"]]
  },
  stats: {
    "you": {
      hp: 15,
      enchantments: ["Resist Heat", "Fear"],
      summons: [{ type: "Troll", hp: 2 }]
    },
    "enemy": {
      hp: 13,
      enchantments: ["Disease", "Amnesia", "Resist Cold"],
      summons: [{ type: "Goblin", hp: 2 }]
    }
  },
  moves: {}
};

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  socket.name = "you";

  socket.on("create game", () => {
    games[socket.id] = new Room(socket.id, socket.id);
    io.emit("games", games);
  });

  socket.on("join game", gameId => {
    socket.join(gameId);
    games[gameId].join(socket.id);
    io.emit("games", games);
  });

  socket.on("leave game", gameId => {
    socket.leave(gameId);
    games[gameId].leave(socket.id);
    if(games[gameId].players.length === 0) delete games[gameId];
    io.emit("games", games);
  });

  socket.on("submit move", move => {
    console.log(move);

    [0, 1].forEach(i => {
      if (move.spell[i])
        game.moves[socket.name].push({ selected: move.selected[i], spell: move.spell[i], target: move.target[i], caster: socket.name })
    });
    game.history[socket.name].push(move.selected);
    if (Object.keys(game.moves).length === 1) { // === 2
      let state = calculateState(game);
      // Emit visible state to players
      game.moves = {};
      io.to(socket.id).emit("state", state);
    }
  });
});

io.listen(3001);