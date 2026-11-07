/**
 * Burger Panic Enemies Sprite Atlas Definitions
 */
window.ENEMIES_ATLAS_DATA = {
  "hotdog_walk1": {
    "x": 2,
    "y": 2,
    "w": 15,
    "h": 26
  },
  "hotdog_walk2": {
    "x": 19,
    "y": 2,
    "w": 15,
    "h": 26
  },
  "hotdog_walk3": {
    "x": 36,
    "y": 2,
    "w": 16,
    "h": 26
  },
  "hotdog_walk4": {
    "x": 54,
    "y": 2,
    "w": 15,
    "h": 26
  },
  "hotdog_walk5": {
    "x": 71,
    "y": 2,
    "w": 14,
    "h": 26
  },
  "hotdog_walk6": {
    "x": 87,
    "y": 2,
    "w": 15,
    "h": 26
  },
  "hotdog_climb1": {
    "x": 104,
    "y": 2,
    "w": 14,
    "h": 29
  },
  "hotdog_climb2": {
    "x": 120,
    "y": 2,
    "w": 15,
    "h": 29
  },
  "hotdog_climb3": {
    "x": 137,
    "y": 2,
    "w": 14,
    "h": 29
  },
  "hotdog_stunned": {
    "x": 153,
    "y": 2,
    "w": 18,
    "h": 29
  },
  "hotdog_stunned2": {
    "x": 173,
    "y": 2,
    "w": 18,
    "h": 27
  },
  "hotdog_squashed": {
    "x": 193,
    "y": 2,
    "w": 21,
    "h": 7
  },
  "hotdog_squashed2": {
    "x": 216,
    "y": 2,
    "w": 24,
    "h": 7
  },
  "pickle_walk1": {
    "x": 2,
    "y": 33,
    "w": 14,
    "h": 26
  },
  "pickle_walk2": {
    "x": 18,
    "y": 33,
    "w": 13,
    "h": 26
  },
  "pickle_walk3": {
    "x": 33,
    "y": 33,
    "w": 14,
    "h": 26
  },
  "pickle_walk4": {
    "x": 49,
    "y": 33,
    "w": 14,
    "h": 26
  },
  "pickle_walk5": {
    "x": 65,
    "y": 33,
    "w": 11,
    "h": 26
  },
  "pickle_walk6": {
    "x": 78,
    "y": 33,
    "w": 11,
    "h": 26
  },
  "pickle_climb1": {
    "x": 91,
    "y": 33,
    "w": 12,
    "h": 26
  },
  "pickle_climb2": {
    "x": 105,
    "y": 33,
    "w": 12,
    "h": 26
  },
  "pickle_climb3": {
    "x": 119,
    "y": 33,
    "w": 12,
    "h": 26
  },
  "pickle_stunned": {
    "x": 133,
    "y": 33,
    "w": 14,
    "h": 25
  },
  "pickle_stunned2": {
    "x": 149,
    "y": 33,
    "w": 14,
    "h": 26
  },
  "pickle_squashed": {
    "x": 165,
    "y": 33,
    "w": 22,
    "h": 7
  },
  "pickle_squashed2": {
    "x": 189,
    "y": 33,
    "w": 23,
    "h": 7
  },
  "egg_walk1": {
    "x": 214,
    "y": 33,
    "w": 19,
    "h": 22
  },
  "egg_walk2": {
    "x": 2,
    "y": 61,
    "w": 20,
    "h": 22
  },
  "egg_walk3": {
    "x": 24,
    "y": 61,
    "w": 20,
    "h": 22
  },
  "egg_walk4": {
    "x": 46,
    "y": 61,
    "w": 19,
    "h": 22
  },
  "egg_walk5": {
    "x": 67,
    "y": 61,
    "w": 20,
    "h": 22
  },
  "egg_climb1": {
    "x": 89,
    "y": 61,
    "w": 16,
    "h": 25
  },
  "egg_climb2": {
    "x": 107,
    "y": 61,
    "w": 14,
    "h": 25
  },
  "egg_climb3": {
    "x": 123,
    "y": 61,
    "w": 14,
    "h": 25
  },
  "egg_stunned": {
    "x": 139,
    "y": 61,
    "w": 18,
    "h": 25
  },
  "egg_stunned2": {
    "x": 159,
    "y": 61,
    "w": 18,
    "h": 25
  },
  "egg_squashed": {
    "x": 179,
    "y": 61,
    "w": 23,
    "h": 7
  },
  "egg_squashed2": {
    "x": 204,
    "y": 61,
    "w": 23,
    "h": 7
  }
};

// Register Kitchen Pest Aliases: mouse (Ratón), roach (Cucaracha), fly (Mosca)
Object.keys(window.ENEMIES_ATLAS_DATA).forEach((k) => {
  if (k.startsWith('hotdog_')) {
    window.ENEMIES_ATLAS_DATA[k.replace('hotdog_', 'mouse_')] = window.ENEMIES_ATLAS_DATA[k];
  } else if (k.startsWith('pickle_')) {
    window.ENEMIES_ATLAS_DATA[k.replace('pickle_', 'roach_')] = window.ENEMIES_ATLAS_DATA[k];
  } else if (k.startsWith('egg_')) {
    window.ENEMIES_ATLAS_DATA[k.replace('egg_', 'fly_')] = window.ENEMIES_ATLAS_DATA[k];
  }
});
