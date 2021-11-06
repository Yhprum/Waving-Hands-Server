const spells = require("../data/spells");

function calculateState(state) {
  let moves = Object.values(state.moves).flat();
  // TODO: check if moves are legal
  let protections = {
    "you": [],
    "enemy": []
  };
  let dispelMagic = false;
  Object.values(moves).sort().forEach(move => {
    if (dispelMagic) return;
    if (protections[move.target].includes("Counter Spell")) {
      return;
    }
    if (protections[move.target].includes("Magic Mirror")) {
      move.target = move.caster;
    }
    switch (move.spell) {
      // Protection
      case "Shield":
      case "Magic Mirror":
      case "Counter Spell":
        protections[move.target] = move.name;
        break;
      case "Dispel Magic":
        dispelMagic = true;
        break;
      case "Cure Light Wounds":
        state.stats[move.target].hp += 1;
        break;
      case "Cure Heavy Wounds":
        state.stats[move.target].hp += 2;
        state.stats[move.target].enchantments.filter(removeDisease);
        break;
      case "Remove Enchantment":
        state.stats[move.target].enchantments = [];
        break;
      // Summons
      case "Summon Goblin":
        state.stats[move.target].summons.push({ type: "Goblin", hp: 2 });
        break;
      case "Summon Ogre":
        state.stats[move.target].summons.push({ type: "Ogre", hp: 2 });
        break;
      case "Summon Troll":
        state.stats[move.target].summons.push({ type: "Troll", hp: 2 });
        break;
      case "Summon Giant":
        state.stats[move.target].summons.push({ type: "Giant", hp: 2 });
        break;
      case "Summon Elemental":
        state.stats[move.target].summons.push({ type: "Elemental", hp: 2, element: move.element });
        break;
      // Damaging
      case "Missile":
        if (!protections[move.target].includes("Shield")) state.stats[move.target].hp -= 1;
        break;
      case "Finger Of Death":
        state.stats[move.target].hp = 0;
        break;
      case "Lightning Bolt":
        state.stats[move.target].hp -= 5;
        // TODO: disable short sequence if used
        break;
      case "Cause Light Wounds":
        state.stats[move.target].hp -= 2;
        break;
      case "Cause Heavy Wounds":
        state.stats[move.target].hp -= 3;
        break;
      case "Fireball":
        if (!state.stats[move.target].enchantments.includes("Resist Heat")) state.stats[move.target].hp -= 5;
        break;
      case "Fire Storm":
        // TODO: cancel with opposite storm or elemental
        Object.keys(state.status).forEach(player => {
          if (!state.stats[player].enchantments.includes("Resist Heat")) state.stats[move.target].hp -= 5;
        });
        break;
      case "Ice Storm":
        // TODO: cancel with opposite storm or elemental
        Object.keys(state.status).forEach(player => {
          if (!state.stats[player].enchantments.includes("Resist Cold")) state.stats[move.target].hp -= 5;
        });
        break;
      // Enchantments
      case "Amnesia":
      case "Confusion":
      case "Charm Person":
      case "Charm Monster":
      case "Paralysis":
      case "Fear":
        // TODO: badEnchantments fired on same turn
        if (state.stats[move.target].enchantments.some(badEnchantments)) {
          break;
        }
        state.stats[move.target].enchantments.push(move.name);
        break;
      case "Anti-Spell":
      case "Resist Heat":
      case "Resist Cold":
      case "Disease":
      case "Poison":
      case "Blindness":
      case "Invisibility":
      case "Haste":
        state.stats[move.target].enchantments.push(move.name);
        break;
      case "Time Stop":
        // TODO
        break;
      case "Delayed Effect":
        // TODO
        break;
      case "Permanency":
        // TODO
        break;
      // Non-Spells
      case "Surrender":
        state.stats[move.target].surrender = true;
        break;
      case "Stab":
        if (!protections[move.target].includes("Shield")) state.stats[move.target].hp -= 1;
        break;
    }
  });
  return state;
}

const badEnchantments = item => ["Amnesia", "Confusion", "Charm Person", "Charm Monster", "Paralysis", "Fear"].includes(item);
const removeDisease = item => item !== "Disease";

exports.calculateState = calculateState;