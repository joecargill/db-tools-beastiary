export const schemaFields = [
  // Core
  { name: "type", type: "select", options: ["MONSTER", "NPC"], required: true },
  { name: "name", type: "text", required: true },
  { name: "description", type: "textarea" },

  // Stats
  { name: "morale", type: "number" },
  { name: "ferocity", type: "number" },
  { name: "size", type: "select", options: ["SMALL", "NORMAL", "LARGE", "HUGE", "SWARM"], required: true },
  { name: "move", type: "number", required: true },
  { name: "hp", type: "number", required: true },
  { name: "wp", type: "number" },
  { name: "armor", type: "number" },

  // Resistances
  { name: "resistance", type: "text" },
  { name: "immunity", type: "text" },
  { name: "weakness", type: "text" },

  // Tags
  {
    name: "tags",
    type: "array",
    itemType: "text"
  },

  // Skills
  {
    name: "skills",
    type: "array",
    fields: [
      {
        name: "name",
        type: "select",
        options: [
          "Acrobatics", "Awareness", "Bartering", "Beast Lore", "Bluffing", "Bushcraft",
          "Crafting", "Evade", "Healing", "Hunting & Fishing", "Languages", "Myths & Legends",
          "Performance", "Persuasion", "Riding", "Seamanship", "Sleight of Hand", "Sneaking",
          "Spot Hidden", "Swimming", "Animism", "Mentalism", "Elementalism"
        ],
        required: true
      },
      { name: "level", type: "number", required: true }
    ]
  },

  // Attacks
  {
    name: "attacks",
    type: "array",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "description", type: "textarea", required: true },
      { name: "result", type: "text", required: true }
    ]
  },

  // Spells
  {
    name: "spells",
    type: "array",
    itemType: "text"
  },

  // Weapons
  {
    name: "weapons",
    type: "array",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "level", type: "number", required: true },
      { name: "damage", type: "text", required: true },
      { name: "durability", type: "number", required: true }
    ]
  },

  // Armors
  {
    name: "armors",
    type: "array",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "rating", type: "number", required: true }
    ]
  },

  // Damage Bonuses
  {
    name: "damage_bonuses",
    type: "array",
    fields: [
      { name: "type", type: "select", options: ["STR", "AGL"], required: true },
      { name: "value", type: "number", required: true }
    ]
  }
];
