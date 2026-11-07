/**
 * Burger Panic Enemies Sprite Atlas Definitions - HD Arcade Edition (All Pests)
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
    "w": 21,
    "h": 26
  },
  "pickle_walk2": {
    "x": 25,
    "y": 46,
    "w": 21,
    "h": 26
  },
  "pickle_walk3": {
    "x": 48,
    "y": 46,
    "w": 21,
    "h": 26
  },
  "pickle_walk4": {
    "x": 71,
    "y": 46,
    "w": 20,
    "h": 26
  },
  "pickle_walk5": {
    "x": 93,
    "y": 46,
    "w": 21,
    "h": 26
  },
  "pickle_walk6": {
    "x": 116,
    "y": 46,
    "w": 21,
    "h": 26
  },
  "pickle_climb1": {
    "x": 139,
    "y": 46,
    "w": 19,
    "h": 26
  },
  "pickle_climb2": {
    "x": 160,
    "y": 46,
    "w": 20,
    "h": 31
  },
  "pickle_climb3": {
    "x": 182,
    "y": 46,
    "w": 20,
    "h": 33
  },
  "pickle_stunned": {
    "x": 204,
    "y": 46,
    "w": 24,
    "h": 27
  },
  "pickle_stunned2": {
    "x": 230,
    "y": 46,
    "w": 24,
    "h": 27
  },
  "pickle_squashed": {
    "x": 256,
    "y": 46,
    "w": 36,
    "h": 14
  },
  "pickle_squashed2": {
    "x": 294,
    "y": 46,
    "w": 39,
    "h": 13
  },
  "egg_walk1": {
    "x": 2,
    "y": 84,
    "w": 21,
    "h": 22
  },
  "egg_walk2": {
    "x": 25,
    "y": 84,
    "w": 21,
    "h": 23
  },
  "egg_walk3": {
    "x": 48,
    "y": 84,
    "w": 22,
    "h": 21
  },
  "egg_walk4": {
    "x": 72,
    "y": 84,
    "w": 23,
    "h": 19
  },
  "egg_walk5": {
    "x": 97,
    "y": 84,
    "w": 21,
    "h": 22
  },
  "egg_climb1": {
    "x": 120,
    "y": 84,
    "w": 21,
    "h": 23
  },
  "egg_climb2": {
    "x": 143,
    "y": 84,
    "w": 21,
    "h": 23
  },
  "egg_climb3": {
    "x": 166,
    "y": 84,
    "w": 21,
    "h": 23
  },
  "egg_stunned": {
    "x": 189,
    "y": 84,
    "w": 22,
    "h": 23
  },
  "egg_stunned2": {
    "x": 213,
    "y": 84,
    "w": 23,
    "h": 21
  },
  "egg_squashed": {
    "x": 238,
    "y": 84,
    "w": 37,
    "h": 13
  },
  "egg_squashed2": {
    "x": 277,
    "y": 84,
    "w": 28,
    "h": 9
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