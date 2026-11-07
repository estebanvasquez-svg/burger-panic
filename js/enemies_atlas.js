/**
 * Burger Panic Enemies Sprite Atlas Definitions - HD Arcade Edition
 */
window.ENEMIES_ATLAS_DATA = {
  "hotdog_walk1": {
    "x": 2,
    "y": 2,
    "w": 25,
    "h": 26
  },
  "hotdog_walk2": {
    "x": 29,
    "y": 2,
    "w": 25,
    "h": 26
  },
  "hotdog_walk3": {
    "x": 56,
    "y": 2,
    "w": 26,
    "h": 26
  },
  "hotdog_walk4": {
    "x": 84,
    "y": 2,
    "w": 25,
    "h": 26
  },
  "hotdog_walk5": {
    "x": 111,
    "y": 2,
    "w": 25,
    "h": 26
  },
  "hotdog_walk6": {
    "x": 138,
    "y": 2,
    "w": 25,
    "h": 26
  },
  "hotdog_climb1": {
    "x": 165,
    "y": 2,
    "w": 21,
    "h": 37
  },
  "hotdog_climb2": {
    "x": 188,
    "y": 2,
    "w": 21,
    "h": 37
  },
  "hotdog_climb3": {
    "x": 211,
    "y": 2,
    "w": 20,
    "h": 37
  },
  "hotdog_stunned": {
    "x": 233,
    "y": 2,
    "w": 24,
    "h": 31
  },
  "hotdog_stunned2": {
    "x": 259,
    "y": 2,
    "w": 25,
    "h": 31
  },
  "hotdog_squashed": {
    "x": 286,
    "y": 2,
    "w": 28,
    "h": 11
  },
  "hotdog_squashed2": {
    "x": 316,
    "y": 2,
    "w": 26,
    "h": 10
  },
  "pickle_walk1": {
    "x": 2,
    "y": 46,
    "w": 14,
    "h": 26
  },
  "pickle_walk2": {
    "x": 18,
    "y": 46,
    "w": 13,
    "h": 26
  },
  "pickle_walk3": {
    "x": 33,
    "y": 46,
    "w": 14,
    "h": 26
  },
  "pickle_walk4": {
    "x": 49,
    "y": 46,
    "w": 14,
    "h": 26
  },
  "pickle_walk5": {
    "x": 65,
    "y": 46,
    "w": 11,
    "h": 26
  },
  "pickle_walk6": {
    "x": 78,
    "y": 46,
    "w": 11,
    "h": 26
  },
  "pickle_climb1": {
    "x": 91,
    "y": 46,
    "w": 12,
    "h": 26
  },
  "pickle_climb2": {
    "x": 105,
    "y": 46,
    "w": 12,
    "h": 26
  },
  "pickle_climb3": {
    "x": 119,
    "y": 46,
    "w": 12,
    "h": 26
  },
  "pickle_stunned": {
    "x": 133,
    "y": 46,
    "w": 14,
    "h": 25
  },
  "pickle_stunned2": {
    "x": 149,
    "y": 46,
    "w": 14,
    "h": 26
  },
  "pickle_squashed": {
    "x": 165,
    "y": 46,
    "w": 22,
    "h": 7
  },
  "pickle_squashed2": {
    "x": 189,
    "y": 46,
    "w": 23,
    "h": 7
  },
  "egg_walk1": {
    "x": 2,
    "y": 82,
    "w": 19,
    "h": 22
  },
  "egg_walk2": {
    "x": 23,
    "y": 82,
    "w": 20,
    "h": 22
  },
  "egg_walk3": {
    "x": 45,
    "y": 82,
    "w": 20,
    "h": 22
  },
  "egg_walk4": {
    "x": 67,
    "y": 82,
    "w": 19,
    "h": 22
  },
  "egg_walk5": {
    "x": 88,
    "y": 82,
    "w": 20,
    "h": 22
  },
  "egg_climb1": {
    "x": 110,
    "y": 82,
    "w": 16,
    "h": 25
  },
  "egg_climb2": {
    "x": 128,
    "y": 82,
    "w": 14,
    "h": 25
  },
  "egg_climb3": {
    "x": 144,
    "y": 82,
    "w": 14,
    "h": 25
  },
  "egg_stunned": {
    "x": 160,
    "y": 82,
    "w": 18,
    "h": 25
  },
  "egg_stunned2": {
    "x": 180,
    "y": 82,
    "w": 18,
    "h": 25
  },
  "egg_squashed": {
    "x": 200,
    "y": 82,
    "w": 23,
    "h": 7
  },
  "egg_squashed2": {
    "x": 225,
    "y": 82,
    "w": 23,
    "h": 7
  }
};

// Register Kitchen Pest Aliases: mouse (Ratón), roach (Cucaracha), fly (Mosca)
Object.keys(window.ENEMIES_ATLAS_DATA).forEach((k) => {
  if (k.startsWith("hotdog_")) {
    window.ENEMIES_ATLAS_DATA[k.replace("hotdog_", "mouse_")] = window.ENEMIES_ATLAS_DATA[k];
  } else if (k.startsWith("pickle_")) {
    window.ENEMIES_ATLAS_DATA[k.replace("pickle_", "roach_")] = window.ENEMIES_ATLAS_DATA[k];
  } else if (k.startsWith("egg_")) {
    window.ENEMIES_ATLAS_DATA[k.replace("egg_", "fly_")] = window.ENEMIES_ATLAS_DATA[k];
  }
});