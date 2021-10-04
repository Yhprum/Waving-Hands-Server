const { Server } = require("socket.io");
const { calculateState } = require("./game/game");

// Example game state for now
const game = {
  history: {
    "p1": [["F", "P"], ["P", "W"], ["W", ">"], ["P", "W"], ["F", "W"], ["S", "W"], ["S", "P"], ["S", "S"]],
    "p2": [["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"], ["S", "W"]]
  },
  stats: {
    "p1": {
      hp: 15,
      enchantments: ["Resist Heat", "Fear"],
      summons: [{ type: "Troll", hp: 2 }]
    },
    "p2": {
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
  socket.on("submit move", move => {
    console.log(move);
    game.moves[socket.id] = { ...move, caster: socket.id };
    if (Object.keys(game.moves).length === 2) {
      let state = calculateState(game);
      // Emit visible state to players
    }
  });
});

io.listen(3001);