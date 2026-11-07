/**
 * Stage Themes & Kitchen Architecture for Burger Panic Mobile
 * Renders unique culinary platform textures, utensils, themed ladders, and plates
 * for all 15 stages matching their culinary names.
 */

class StageThemesManager {
  constructor() {
    this.cache = {};
  }

  getTheme(stageNum) {
    const s = Math.max(1, Math.min(stageNum || 1, 15));
    switch (s) {
      case 1:
        return {
          id: 1,
          name: 'LA COCINA CLÁSICA',
          wallColor: '#0a0d14',
          wallTileColor: 'rgba(255, 255, 255, 0.035)',
          platform: {
            topColor: '#f1f2f6',
            highlightColor: '#ffffff',
            bodyColor: '#747d8c',
            trimColor: '#2f3542',
            subColor: '#a4b0be',
            style: 'stainless_steel'
          },
          ladder: {
            railColor: '#dfe4ea',
            rungColor: '#ced6e0',
            highlightColor: '#ffffff',
            shadowColor: '#57606f',
            style: 'chrome_pipe'
          },
          plate: {
            rimColor: '#0984e3',
            bodyColor: '#ffffff',
            shadowColor: '#74b9ff',
            style: 'bistro_plate'
          }
        };

      case 2:
        return {
          id: 2,
          name: 'LA DESPENSA DE ESPECIAS',
          wallColor: '#120804',
          wallTileColor: 'rgba(230, 126, 34, 0.04)',
          platform: {
            topColor: '#d35400',
            highlightColor: '#f39c12',
            bodyColor: '#873600',
            trimColor: '#4d2007',
            subColor: '#e67e22',
            style: 'spice_wood'
          },
          ladder: {
            railColor: '#ba4a00',
            rungColor: '#e59866',
            highlightColor: '#f8c471',
            shadowColor: '#5e2303',
            style: 'rustic_wood'
          },
          plate: {
            rimColor: '#a04000',
            bodyColor: '#edbb99',
            shadowColor: '#dc7633',
            style: 'pizza_peel'
          }
        };

      case 3:
        return {
          id: 3,
          name: 'EL GRAN BISTRÓ GOURMET',
          wallColor: '#0d0d12',
          wallTileColor: 'rgba(212, 175, 55, 0.04)',
          platform: {
            topColor: '#2d3436',
            highlightColor: '#f1c40f',
            bodyColor: '#1e272e',
            trimColor: '#d4af37',
            subColor: '#f39c12',
            style: 'black_marble'
          },
          ladder: {
            railColor: '#f1c40f',
            rungColor: '#d4af37',
            highlightColor: '#fff9d2',
            shadowColor: '#9a7d0a',
            style: 'golden_brass'
          },
          plate: {
            rimColor: '#d4af37',
            bodyColor: '#17202a',
            shadowColor: '#f1c40f',
            style: 'gold_rim'
          }
        };

      case 4:
        return {
          id: 4,
          name: 'LA MARISQUERÍA DEL PULPO',
          wallColor: '#050f1a',
          wallTileColor: 'rgba(52, 152, 219, 0.04)',
          platform: {
            topColor: '#34495e',
            highlightColor: '#2980b9',
            bodyColor: '#1a252f',
            trimColor: '#16a085',
            subColor: '#48dbfb',
            style: 'dock_planks'
          },
          ladder: {
            railColor: '#d35400',
            rungColor: '#e67e22',
            highlightColor: '#f5b041',
            shadowColor: '#6e2c00',
            style: 'nautical_rope'
          },
          plate: {
            rimColor: '#16a085',
            bodyColor: '#d1f2eb',
            shadowColor: '#76d7c4',
            style: 'seafood_tray'
          }
        };

      case 5:
        return {
          id: 5,
          name: 'LA ESTACIÓN DE CAFÉ & BARISTA',
          wallColor: '#100b08',
          wallTileColor: 'rgba(184, 115, 51, 0.04)',
          platform: {
            topColor: '#5d4037',
            highlightColor: '#b87333',
            bodyColor: '#3e2723',
            trimColor: '#e08544',
            subColor: '#8d6e63',
            style: 'espresso_wood'
          },
          ladder: {
            railColor: '#e08544',
            rungColor: '#d9742b',
            highlightColor: '#ffbb88',
            shadowColor: '#803810',
            style: 'copper_pipes'
          },
          plate: {
            rimColor: '#6d4c41',
            bodyColor: '#efebe9',
            shadowColor: '#bcaaa4',
            style: 'latte_saucer'
          }
        };

      case 6:
        return {
          id: 6,
          name: 'LA PASTELERÍA FELINA',
          wallColor: '#14080f',
          wallTileColor: 'rgba(244, 143, 177, 0.05)',
          platform: {
            topColor: '#f8bbd0',
            highlightColor: '#ffffff',
            bodyColor: '#ec407a',
            trimColor: '#c2185b',
            subColor: '#f06292',
            style: 'pastry_icing'
          },
          ladder: {
            railColor: '#e84118',
            rungColor: '#ffffff',
            highlightColor: '#f5f6fa',
            shadowColor: '#c23616',
            style: 'candy_cane'
          },
          plate: {
            rimColor: '#f06292',
            bodyColor: '#ffffff',
            shadowColor: '#f8bbd0',
            style: 'cake_doily'
          }
        };

      case 7:
        return {
          id: 7,
          name: 'EL ASADOR DEL CASTILLO',
          wallColor: '#0f0502',
          wallTileColor: 'rgba(255, 87, 34, 0.05)',
          platform: {
            topColor: '#37474f',
            highlightColor: '#ff5722',
            bodyColor: '#212121',
            trimColor: '#ff9100',
            subColor: '#dd2c00',
            style: 'castle_grill'
          },
          ladder: {
            railColor: '#424242',
            rungColor: '#212121',
            highlightColor: '#757575',
            shadowColor: '#121212',
            style: 'iron_forge'
          },
          plate: {
            rimColor: '#e64a19',
            bodyColor: '#263238',
            shadowColor: '#ff6e40',
            style: 'iron_griddle'
          }
        };

      case 8:
        return {
          id: 8,
          name: 'EL HORNO DEL DRAGÓN',
          wallColor: '#140500',
          wallTileColor: 'rgba(255, 171, 0, 0.05)',
          platform: {
            topColor: '#d84315',
            highlightColor: '#ffab00',
            bodyColor: '#bf360c',
            trimColor: '#ffd600',
            subColor: '#ff6f00',
            style: 'dragon_brick'
          },
          ladder: {
            railColor: '#ff8f00',
            rungColor: '#ff6f00',
            highlightColor: '#ffe082',
            shadowColor: '#bf360c',
            style: 'lava_forge'
          },
          plate: {
            rimColor: '#ffab00',
            bodyColor: '#4e342e',
            shadowColor: '#ff6d00',
            style: 'lava_stone'
          }
        };

      case 9:
        return {
          id: 9,
          name: 'LA COCINA DE ALTA MAR',
          wallColor: '#021214',
          wallTileColor: 'rgba(0, 150, 136, 0.05)',
          platform: {
            topColor: '#00796b',
            highlightColor: '#80cbc4',
            bodyColor: '#004d40',
            trimColor: '#009688',
            subColor: '#26a69a',
            style: 'marine_steel'
          },
          ladder: {
            railColor: '#fbc02d',
            rungColor: '#f57f17',
            highlightColor: '#fff59d',
            shadowColor: '#bc5100',
            style: 'warning_yellow'
          },
          plate: {
            rimColor: '#00897b',
            bodyColor: '#e0f2f1',
            shadowColor: '#80cbc4',
            style: 'naval_mess'
          }
        };

      case 10:
        return {
          id: 10,
          name: 'LA HELADERÍA BAJO CERO',
          wallColor: '#030b14',
          wallTileColor: 'rgba(128, 222, 234, 0.06)',
          platform: {
            topColor: '#80deea',
            highlightColor: '#ffffff',
            bodyColor: '#00acc1',
            trimColor: '#00e5ff',
            subColor: '#b2ebf2',
            style: 'ice_crystal'
          },
          ladder: {
            railColor: '#b2ebf2',
            rungColor: '#e0f7fa',
            highlightColor: '#ffffff',
            shadowColor: '#4dd0e1',
            style: 'ice_ladder'
          },
          plate: {
            rimColor: '#00bcd4',
            bodyColor: '#e0f7fa',
            shadowColor: '#80deea',
            style: 'frosted_glass'
          }
        };

      case 11:
        return {
          id: 11,
          name: 'LA PANADERÍA CRUJIENTE',
          wallColor: '#120b04',
          wallTileColor: 'rgba(245, 205, 121, 0.05)',
          platform: {
            topColor: '#e58e26',
            highlightColor: '#fff9e6',
            bodyColor: '#b71540',
            trimColor: '#f8c291',
            subColor: '#fa983a',
            style: 'bakery_wood'
          },
          ladder: {
            railColor: '#f8c291',
            rungColor: '#e77f67',
            highlightColor: '#ffffff',
            shadowColor: '#cf6a87',
            style: 'rolling_pin'
          },
          plate: {
            rimColor: '#e58e26',
            bodyColor: '#fff8e7',
            shadowColor: '#f8c291',
            style: 'bread_basket'
          }
        };

      case 12:
        return {
          id: 12,
          name: 'EL WOK DEL PANDA GOURMET',
          wallColor: '#051208',
          wallTileColor: 'rgba(76, 175, 80, 0.05)',
          platform: {
            topColor: '#43a047',
            highlightColor: '#a5d6a7',
            bodyColor: '#2e7d32',
            trimColor: '#ffd700',
            subColor: '#c62828',
            style: 'panda_bamboo'
          },
          ladder: {
            railColor: '#81c784',
            rungColor: '#66bb6a',
            highlightColor: '#c8e6c9',
            shadowColor: '#388e3c',
            style: 'bamboo_ladder'
          },
          plate: {
            rimColor: '#c62828',
            bodyColor: '#fff9c4',
            shadowColor: '#ffd700',
            style: 'dim_sum_steamer'
          }
        };

      case 13:
        return {
          id: 13,
          name: 'EL COMEDOR CÓSMICO',
          wallColor: '#0c0217',
          wallTileColor: 'rgba(124, 77, 255, 0.06)',
          platform: {
            topColor: '#7c4dff',
            highlightColor: '#00e5ff',
            bodyColor: '#4a148c',
            trimColor: '#00f0ff',
            subColor: '#b388ff',
            style: 'cosmic_neon'
          },
          ladder: {
            railColor: '#00e5ff',
            rungColor: '#7c4dff',
            highlightColor: '#ffffff',
            shadowColor: '#3d5afe',
            style: 'neon_laser'
          },
          plate: {
            rimColor: '#00e5ff',
            bodyColor: '#311b92',
            shadowColor: '#7c4dff',
            style: 'antigrav_dish'
          }
        };

      case 14:
        return {
          id: 14,
          name: 'EL MESÓN JURÁSICO DE CARNES',
          wallColor: '#120b08',
          wallTileColor: 'rgba(141, 110, 99, 0.05)',
          platform: {
            topColor: '#795548',
            highlightColor: '#d7ccc8',
            bodyColor: '#4e342e',
            trimColor: '#bcaaa4',
            subColor: '#a1887f',
            style: 'jurassic_bone'
          },
          ladder: {
            railColor: '#558b2f',
            rungColor: '#d7ccc8',
            highlightColor: '#f1f8e9',
            shadowColor: '#33691e',
            style: 'jungle_vine'
          },
          plate: {
            rimColor: '#5d4037',
            bodyColor: '#d7ccc8',
            shadowColor: '#8d6e63',
            style: 'primitive_stone'
          }
        };

      case 15:
      default:
        return {
          id: 15,
          name: 'EL BANQUETE IMPERIAL DEL CHEF',
          wallColor: '#12020a',
          wallTileColor: 'rgba(255, 215, 0, 0.06)',
          platform: {
            topColor: '#ad1457',
            highlightColor: '#ffd700',
            bodyColor: '#880e4f',
            trimColor: '#fff9c4',
            subColor: '#ffd54f',
            style: 'imperial_gold'
          },
          ladder: {
            railColor: '#ffd700',
            rungColor: '#ad1457',
            highlightColor: '#ffffff',
            shadowColor: '#d4af37',
            style: 'royal_carpet'
          },
          plate: {
            rimColor: '#ffd700',
            bodyColor: '#ffffff',
            shadowColor: '#ad1457',
            style: 'imperial_platter'
          }
        };
    }
  }

  // Draw customized culinary platform matching the stage theme
  drawPlatform(ctx, f, theme) {
    const p = theme.platform;
    const w = f.x2 - f.x1;
    const x = f.x1;
    const y = f.y + 14;

    ctx.save();

    // 1. Solid underbody girder/shelf
    ctx.fillStyle = p.bodyColor;
    ctx.fillRect(x, y + 2, w, 6);

    // 2. Walkable countertop surface
    ctx.fillStyle = p.topColor;
    ctx.fillRect(x, y, w, 3);

    // 3. Top edge gleam / highlight
    ctx.fillStyle = p.highlightColor;
    ctx.fillRect(x, y, w, 1);

    // 4. Stylized Kitchen Patterns according to Theme Style
    if (p.style === 'stainless_steel') {
      // Modern kitchen stainless steel with rivets & clean tile seams every 16px
      for (let bx = x; bx < f.x2; bx += 16) {
        ctx.fillStyle = p.trimColor;
        ctx.fillRect(bx, y + 1, 1, 7);
        // Shiny metal rivet head
        ctx.fillStyle = p.highlightColor;
        ctx.fillRect(bx + 4, y + 4, 2, 2);
        ctx.fillStyle = p.trimColor;
        ctx.fillRect(bx + 5, y + 5, 1, 1);
      }
    } else if (p.style === 'spice_wood' || p.style === 'bakery_wood' || p.style === 'espresso_wood') {
      // Warm varnished wooden shelves with woodgrain lines
      ctx.fillStyle = p.trimColor;
      for (let bx = x + 8; bx < f.x2; bx += 24) {
        ctx.fillRect(bx, y + 3, 6, 1);
        ctx.fillRect(bx + 10, y + 5, 8, 1);
      }
      // Spice jar studs on the shelf ends
      ctx.fillStyle = p.highlightColor;
      ctx.fillRect(x + 1, y + 2, 3, 4);
      ctx.fillRect(f.x2 - 4, y + 2, 3, 4);
    } else if (p.style === 'black_marble') {
      // Polished luxury marble with gold inlay trims
      ctx.fillStyle = p.trimColor;
      ctx.fillRect(x, y + 6, w, 2); // Gold bottom trim
      // Golden marble veins
      for (let bx = x + 4; bx < f.x2; bx += 20) {
        ctx.fillRect(bx, y + 1, 3, 1);
        ctx.fillRect(bx + 2, y + 2, 2, 2);
      }
    } else if (p.style === 'pastry_icing') {
      // Sweet dripping frosting & candy sprinkles
      const colors = ['#ffffff', '#ffeb3b', '#00e5ff', '#ff4081'];
      for (let bx = x + 2; bx < f.x2; bx += 8) {
        ctx.fillStyle = colors[Math.floor(bx / 8) % colors.length];
        ctx.fillRect(bx, y + 1, 2, 2);
        // Dripping icing curve
        ctx.fillStyle = p.highlightColor;
        ctx.fillRect(bx + 1, y + 3, 2, 2);
      }
    } else if (p.style === 'castle_grill' || p.style === 'dragon_brick') {
      // Fiery glowing grill / brick with incandescent embers
      ctx.fillStyle = p.trimColor;
      for (let bx = x; bx < f.x2; bx += 6) {
        ctx.fillRect(bx, y + 3, 2, 4);
        // Fiery ember glow
        ctx.fillStyle = (bx % 12 === 0) ? '#ffeb3b' : '#ff3d00';
        ctx.fillRect(bx + 1, y + 6, 2, 2);
      }
    } else if (p.style === 'ice_crystal') {
      // Translucent arctic ice blocks with hanging icicles
      ctx.fillStyle = '#ffffff';
      for (let bx = x + 4; bx < f.x2; bx += 12) {
        ctx.fillRect(bx, y + 1, 4, 1);
        ctx.fillRect(bx + 1, y + 2, 2, 1);
        // Small icicle hanging from bottom
        ctx.fillRect(bx + 2, y + 7, 2, 3);
        ctx.fillRect(bx + 2, y + 10, 1, 1);
      }
    } else if (p.style === 'panda_bamboo') {
      // Natural bamboo stalks with segmented joints
      ctx.fillStyle = '#1b5e20';
      for (let bx = x + 16; bx < f.x2; bx += 16) {
        ctx.fillRect(bx, y, 2, 8);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(bx - 1, y + 2, 4, 2); // Golden bamboo ring
      }
    } else if (p.style === 'cosmic_neon') {
      // Futuristic neon energy pulsing rail
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(x, y + 2, w, 2);
      const pulse = Math.floor((Date.now() / 200) % w);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + pulse, y + 1, 6, 3);
    } else if (p.style === 'imperial_gold') {
      // Royal gold damask embroidery with velvet banner
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(x, y + 5, w, 3);
      for (let bx = x + 2; bx < f.x2; bx += 10) {
        ctx.fillRect(bx, y + 1, 2, 2);
        ctx.fillRect(bx + 1, y + 2, 2, 2);
      }
    }

    // Platform end caps (clean kitchen studs)
    ctx.fillStyle = p.trimColor;
    ctx.fillRect(x, y + 1, 2, 7);
    ctx.fillRect(f.x2 - 2, y + 1, 2, 7);

    ctx.restore();
  }

  // Draw customized ladders matching the stage theme
  drawLadder(ctx, l, theme) {
    const ld = theme.ladder;
    const x = l.x;
    const y1 = l.y1 + 4;
    const y2 = l.y2 + 14;

    ctx.save();

    // 1. Side Rails (left and right poles)
    ctx.fillStyle = ld.railColor;
    ctx.fillRect(x + 1, y1, 3, y2 - y1);
    ctx.fillRect(x + 12, y1, 3, y2 - y1);

    // Rail highlights
    ctx.fillStyle = ld.highlightColor;
    ctx.fillRect(x + 1, y1, 1, y2 - y1);
    ctx.fillRect(x + 12, y1, 1, y2 - y1);

    // Rail shadow
    ctx.fillStyle = ld.shadowColor;
    ctx.fillRect(x + 3, y1, 1, y2 - y1);
    ctx.fillRect(x + 14, y1, 1, y2 - y1);

    // 2. Ladder Rungs (Every 8 pixels)
    for (let ry = y1 + 4; ry < y2 - 2; ry += 8) {
      // Rung shadow
      ctx.fillStyle = ld.shadowColor;
      ctx.fillRect(x + 4, ry + 1, 8, 2);

      // Rung body
      ctx.fillStyle = ld.rungColor;
      ctx.fillRect(x + 4, ry, 8, 2);

      // Rung highlight
      ctx.fillStyle = ld.highlightColor;
      ctx.fillRect(x + 4, ry, 8, 1);

      // Unique ladder style touches
      if (ld.style === 'candy_cane') {
        // Red and white diagonal candy spiral
        ctx.fillStyle = '#e84118';
        ctx.fillRect(x + 2, ry - 1, 2, 2);
        ctx.fillRect(x + 12, ry + 2, 2, 2);
      } else if (ld.style === 'bamboo_ladder') {
        // Tied cord binding around rungs
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x + 3, ry, 2, 2);
        ctx.fillRect(x + 11, ry, 2, 2);
      } else if (ld.style === 'neon_laser') {
        // Glowing laser rung center
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(x + 6, ry, 4, 1);
      }
    }

    ctx.restore();
  }

  // Draw customized serving plates/trays
  drawPlate(ctx, p, theme) {
    const pl = theme.plate;
    const x = p.x;
    const y = p.y + 14;

    ctx.save();

    // Plate rim shadow
    ctx.fillStyle = pl.shadowColor;
    ctx.fillRect(x + 1, y + 2, 34, 4);

    // Plate body
    ctx.fillStyle = pl.bodyColor;
    ctx.fillRect(x + 2, y, 32, 4);

    // Plate ceramic rim
    ctx.fillStyle = pl.rimColor;
    ctx.fillRect(x, y + 1, 36, 2);
    ctx.fillRect(x + 2, y, 32, 1);

    // Gloss gleam
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, y, 12, 1);

    ctx.restore();
  }
}

window.stageThemesManager = new StageThemesManager();

