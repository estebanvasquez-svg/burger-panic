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
    const s = Math.max(1, Math.min(stageNum || 1, 16));
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
          name: 'EL COLOSO KILOBURNER',
          wallColor: '#0b0c10',
          wallTileColor: 'rgba(239, 68, 68, 0.05)',
          platform: {
            topColor: '#e0e6ed',
            highlightColor: '#38bdf8',
            bodyColor: '#1e293b',
            trimColor: '#ef4444',
            subColor: '#0284c7',
            style: 'cyber_furnace'
          },
          ladder: {
            railColor: '#38bdf8',
            rungColor: '#0284c7',
            highlightColor: '#ffffff',
            shadowColor: '#0c4a6e',
            style: 'industrial_scaffold'
          },
          plate: {
            rimColor: '#ef4444',
            bodyColor: '#0f172a',
            shadowColor: '#38bdf8',
            style: 'blast_dock'
          }
        };

      case 4:
        return {
          id: 4,
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

      case 5:
        return {
          id: 5,
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

      case 6:
        return {
          id: 6,
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

      case 7:
        return {
          id: 7,
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

      case 8:
        return {
          id: 8,
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

      case 9:
        return {
          id: 9,
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

      case 10:
        return {
          id: 10,
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

      case 11:
        return {
          id: 11,
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

      case 12:
        return {
          id: 12,
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

      case 13:
        return {
          id: 13,
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

      case 14:
        return {
          id: 14,
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

      case 15:
        return {
          id: 15,
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

      case 16:
      default:
        return {
          id: 16,
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
  // =========================================================================
  // DYNAMIC HIGH-FIDELITY MAP BACKDROPS & ARCHITECTURE
  // =========================================================================

  drawStageBackdrop(ctx, stageNum, theme, fullWidth, camX, time) {
    const w = fullWidth || 240;
    const viewL = Math.max(0, (camX || 0) - 40);
    const viewR = Math.min(w, (camX || 0) + 280);

    ctx.save();

    // 1. Base Wall Paint
    ctx.fillStyle = theme.wallColor || '#0a0d14';
    ctx.fillRect(viewL, 0, viewR - viewL, 320);

    // 2. Gourmet Beveled Subway Tile Pattern (Running Bond 24x12)
    const tileW = 24;
    const tileH = 12;
    const tileColor = theme.wallTileColor || 'rgba(255, 255, 255, 0.04)';

    ctx.fillStyle = tileColor;
    for (let ty = 36; ty < 296; ty += tileH) {
      const rowIdx = Math.floor((ty - 36) / tileH);
      const rowOffset = (rowIdx % 2 === 1) ? Math.floor(tileW / 2) : 0;
      const startX = Math.floor(viewL / tileW) * tileW - tileW + rowOffset;

      for (let tx = startX; tx < viewR + tileW; tx += tileW) {
        // Main tile body
        ctx.fillRect(tx, ty, tileW - 1, tileH - 1);

        // Subtle 3D bevel top-edge gleam on every tile
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.fillRect(tx, ty, tileW - 1, 1);
        ctx.fillStyle = tileColor;
      }
    }

    // 3. Wall Baseboard / Tile Skirting along bottom (y: 296 to 320)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(viewL, 296, viewR - viewL, 24);
    ctx.fillStyle = theme.platform.trimColor || '#2f3542';
    ctx.fillRect(viewL, 296, viewR - viewL, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(viewL, 297, viewR - viewL, 1);

    // 4. Overhead Industrial Kitchen Exhaust Hood & Ducts (y: 34 to 48)
    const hoodL = viewL;
    const hoodR = viewR;
    // Hood canopy body
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(hoodL, 34, hoodR - hoodL, 14);
    // Lower stainless steel trim lip
    ctx.fillStyle = '#64748b';
    ctx.fillRect(hoodL, 46, hoodR - hoodL, 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(hoodL, 46, hoodR - hoodL, 1);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(hoodL, 48, hoodR - hoodL, 1);

    // Stainless rivets & grease filter louvers along the hood
    for (let hx = Math.floor(viewL / 32) * 32; hx < viewR + 32; hx += 32) {
      // Rivet bolt
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(hx + 2, 44, 2, 2);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(hx + 3, 45, 1, 1);
      // Grease filter vent slot
      ctx.fillStyle = '#090d16';
      ctx.fillRect(hx + 10, 36, 14, 7);
      ctx.fillStyle = '#334155';
      ctx.fillRect(hx + 12, 38, 10, 1);
      ctx.fillRect(hx + 12, 40, 10, 1);
    }

    // 5. Overhead Chrome Duct Pipe running vertically into ceiling (at x: 120 and x: 280)
    for (const pipeX of [120, 360, 600, 840]) {
      if (pipeX + 24 < viewL || pipeX - 24 > viewR) continue;
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(pipeX - 12, 0, 24, 34);
      // Pipe cylinder body
      ctx.fillStyle = '#475569';
      ctx.fillRect(pipeX - 10, 0, 20, 34);
      // Highlight core
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(pipeX - 6, 0, 4, 34);
      // Rim highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pipeX - 5, 0, 1, 34);
      // Flange ring
      ctx.fillStyle = '#64748b';
      ctx.fillRect(pipeX - 12, 30, 24, 4);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pipeX - 12, 30, 24, 1);
    }

    // 6. Themed Wall Props & Culinary Equipment
    // A. Magnetic Chef Knife Strip (x: 70..106, y: 66)
    if (70 + 40 >= viewL && 70 <= viewR) {
      // Magnetic Bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(70, 66, 36, 5);
      ctx.fillStyle = '#475569';
      ctx.fillRect(71, 67, 34, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(71, 67, 34, 1);

      // Meat Cleaver (x: 74)
      ctx.fillStyle = '#78350f'; // Wood handle
      ctx.fillRect(74, 62, 3, 5);
      ctx.fillStyle = '#e2e8f0'; // Steel blade
      ctx.fillRect(73, 67, 6, 8);
      ctx.fillStyle = '#ffffff'; // Blade edge
      ctx.fillRect(73, 74, 6, 1);

      // Chef Knife (x: 84)
      ctx.fillStyle = '#0f172a'; // Black handle
      ctx.fillRect(84, 61, 2, 6);
      ctx.fillStyle = '#cbd5e1'; // Blade
      ctx.fillRect(83, 67, 3, 10);
      ctx.fillRect(84, 77, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(83, 67, 1, 11);

      // Santoku Knife (x: 94)
      ctx.fillStyle = '#92400e';
      ctx.fillRect(94, 62, 2, 5);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(93, 67, 4, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(93, 74, 4, 1);
    }

    // B. Hanging Copper Pans & Skillets (x: 146..188, y: 64)
    if (146 + 48 >= viewL && 146 <= viewR) {
      // Hanging rod
      ctx.fillStyle = '#334155';
      ctx.fillRect(146, 64, 42, 2);

      // Pan 1 (Copper Saute Pan at x: 154)
      ctx.fillStyle = '#475569'; // Hook & handle
      ctx.fillRect(154, 66, 2, 7);
      ctx.fillStyle = '#b45309'; // Copper pan rim
      ctx.beginPath();
      ctx.arc(155, 78, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d97706'; // Pan interior
      ctx.beginPath();
      ctx.arc(155, 78, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef3c7'; // Specular gleam
      ctx.fillRect(153, 75, 2, 2);

      // Pan 2 (Cast Iron Skillet at x: 174)
      ctx.fillStyle = '#475569';
      ctx.fillRect(174, 66, 2, 7);
      ctx.fillStyle = '#1e293b'; // Cast iron
      ctx.beginPath();
      ctx.arc(175, 79, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(175, 79, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(173, 76, 2, 2);
    }

    // C. Double Wooden Spice Rack Shelf (x: 16..54, y: 110)
    if (16 + 42 >= viewL && 16 <= viewR) {
      // Wooden shelf
      ctx.fillStyle = '#78350f';
      ctx.fillRect(16, 118, 38, 3);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(16, 120, 38, 1);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(16, 118, 38, 1);

      // Glass Spice Jars
      const spices = [
        { color: '#dc2626', name: 'paprika' },
        { color: '#16a34a', name: 'oregano' },
        { color: '#eab308', name: 'curry' },
        { color: '#f8fafc', name: 'salt' }
      ];
      spices.forEach((sp, idx) => {
        const jx = 19 + idx * 9;
        // Cork stopper
        ctx.fillStyle = '#d97706';
        ctx.fillRect(jx + 1, 109, 4, 2);
        // Glass jar body
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(jx, 111, 6, 7);
        // Spice powder contents
        ctx.fillStyle = sp.color;
        ctx.fillRect(jx + 1, 113, 4, 5);
        // Glass highlight
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(jx, 111, 1, 6);
      });
    }

    // D. Order Ticket Line wire (y: 49)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(viewL, 49, viewR - viewL, 1);

    ctx.restore();
  }

  // =========================================================================
  // DYNAMIC MAP ANIMATIONS (LIVING ARCADE ENVIRONMENT)
  // =========================================================================

  drawAnimatedMapProps(ctx, stageNum, theme, fullWidth, camX, time) {
    const w = fullWidth || 240;
    const viewL = Math.max(0, (camX || 0) - 40);
    const viewR = Math.min(w, (camX || 0) + 280);
    const t = time || performance.now();

    ctx.save();

    // 1. ANIMATED SPANNING VENTILATION EXHAUST FAN (at x: 34, y: 42)
    // High-speed rotating 4-blade industrial kitchen extractor
    for (const fanX of [34, 274, 514, 754]) {
      if (fanX + 24 < viewL || fanX - 24 > viewR) continue;
      const fanY = 41;

      // Dark circular recess
      ctx.fillStyle = '#050810';
      ctx.beginPath();
      ctx.arc(fanX, fanY, 11, 0, Math.PI * 2);
      ctx.fill();

      // Outer metal bezel
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // 4 Rapidly Rotating Blades (15 rad/s)
      const fanAngle = t * 0.015;
      ctx.save();
      ctx.translate(fanX, fanY);
      ctx.rotate(fanAngle);

      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2);
        // Blade shadow/body
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-3, 9);
        ctx.lineTo(3, 9);
        ctx.closePath();
        ctx.fill();

        // Blade metallic leading edge highlight
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-1, 2, 2, 7);
      }
      ctx.restore();

      // Center motor axle cap
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(fanX, fanY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(fanX - 1, fanY - 1, 2, 2);

      // Protective wire grille crossbars
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fanX - 11, fanY); ctx.lineTo(fanX + 11, fanY);
      ctx.moveTo(fanX, fanY - 11); ctx.lineTo(fanX, fanY + 11);
      ctx.stroke();
    }

    // 2. ANIMATED TICKING RESTAURANT WALL CLOCK (at x: 120, y: 40)
    for (const clockX of [120, 360, 600, 840]) {
      if (clockX + 20 < viewL || clockX - 20 > viewR) continue;
      const clockY = 41;

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(clockX + 1, clockY + 2, 11, 0, Math.PI * 2);
      ctx.fill();

      // Brass outer rim
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(clockX, clockY, 11, 0, Math.PI * 2);
      ctx.fill();

      // Clock face
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(clockX, clockY, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // 4 Cardinal Hour Ticks
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(clockX - 0.5, clockY - 7.5, 1, 2); // 12
      ctx.fillRect(clockX + 5.5, clockY - 0.5, 2, 1); // 3
      ctx.fillRect(clockX - 0.5, clockY + 5.5, 1, 2); // 6
      ctx.fillRect(clockX - 7.5, clockY - 0.5, 2, 1); // 9

      // Minute hand (smooth rotation)
      const minAngle = (t * 0.0001) % (Math.PI * 2);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.sin(minAngle) * 5.5, clockY - Math.cos(minAngle) * 5.5);
      ctx.stroke();

      // Hour hand
      const hourAngle = (minAngle / 12) + Math.PI / 4;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.sin(hourAngle) * 3.8, clockY - Math.cos(hourAngle) * 3.8);
      ctx.stroke();

      // Red Second Hand (Real-time stepping tick!)
      const secAngle = (Math.floor(t / 1000) % 60) * (Math.PI * 2 / 60);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(clockX - Math.sin(secAngle) * 2, clockY + Math.cos(secAngle) * 2);
      ctx.lineTo(clockX + Math.sin(secAngle) * 6.5, clockY - Math.cos(secAngle) * 6.5);
      ctx.stroke();

      // Center red pin
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(clockX - 1, clockY - 1, 2, 2);
    }

    // 3. ANIMATED SWAYING ORDER TICKETS (Clips on line at y: 49)
    const ticketPositions = [62, 86, 150, 178, 202];
    ticketPositions.forEach((tx, idx) => {
      if (tx + 16 < viewL || tx - 16 > viewR) return;
      // Gentle sway back and forth from fan wind
      const sway = Math.sin(t * 0.0032 + idx * 1.4) * 0.08;

      ctx.save();
      ctx.translate(tx, 49);
      ctx.rotate(sway);

      // Metal clip
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-2, -2, 4, 3);

      // Paper ticket body
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(-4.5, 2, 11, 14); // Shadow
      ctx.fillStyle = '#fefce8'; // Pale yellow ticket paper
      ctx.fillRect(-5, 1, 10, 13);

      // Red header line
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-4, 3, 8, 1);

      // Order items pencil scribbles
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-4, 6, 6, 1);
      ctx.fillRect(-4, 8, 7, 1);
      ctx.fillRect(-4, 10, 5, 1);

      ctx.restore();
    });

    // 4. ANIMATED VOLUMETRIC KITCHEN STEAM PUFFS (Rising from vents and grills)
    const steamVents = [
      { x: 56, baseY: 146 },
      { x: 182, baseY: 146 },
      { x: 114, baseY: 98 }
    ];
    steamVents.forEach((vent, vIdx) => {
      if (vent.x + 24 < viewL || vent.x - 24 > viewR) return;

      for (let p = 0; p < 4; p++) {
        const progress = ((t * 0.00075 + vIdx * 0.33 + p * 0.25) % 1);
        const sy = vent.baseY - progress * 42;
        const sx = vent.x + Math.sin(t * 0.004 + progress * 6 + p) * (progress * 8);
        const radius = 2.5 + progress * 6.5;
        const alpha = Math.sin(progress * Math.PI) * 0.26;

        ctx.fillStyle = `rgba(241, 245, 249, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. ANIMATED NEON RESTAURANT SIGN ("BURGER PANIC" / "HOT GRILL")
    // Mounted in central background (x: 120, y: 78)
    const signX = 120;
    const signY = 78;
    if (signX + 60 >= viewL && signX - 60 <= viewR) {
      // Realistic Neon Breathing Pulse + Subtle Arc Flicker
      const neonFlicker = (Math.sin(t * 0.004) * 0.12 + 0.88) * (Math.random() < 0.008 ? 0.45 : 1.0);

      // Sign backing metal plate
      ctx.fillStyle = '#090d16';
      ctx.fillRect(signX - 44, signY - 8, 88, 16);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(signX - 44, signY - 8, 88, 16);

      // Neon outer glow
      ctx.shadowColor = `rgba(239, 68, 68, ${0.45 * neonFlicker})`;
      ctx.shadowBlur = 6;

      // Neon Lettering: BURGER PANIC
      ctx.fillStyle = `rgba(254, 202, 202, ${neonFlicker})`;
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ BURGER PANIC ★', signX, signY + 3);

      // Neon Sub-text / Open 24h
      ctx.shadowColor = `rgba(56, 189, 248, ${0.40 * neonFlicker})`;
      ctx.fillStyle = `rgba(186, 230, 253, ${neonFlicker})`;
      ctx.font = '4px "Press Start 2P", monospace';
      ctx.fillText('HOT & FRESH • 24/7', signX, signY + 11);

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }

    // 6. ANIMATED SPECULAR STAR GLINTS (Twinkling on pans and knife blades)
    const glintLocations = [
      { x: 74, y: 74, phase: 0.0 },  // Cleaver edge
      { x: 154, y: 77, phase: 1.5 }, // Copper pan
      { x: 84, y: 76, phase: 2.8 }   // Chef knife
    ];
    glintLocations.forEach(gl => {
      if (gl.x + 8 < viewL || gl.x - 8 > viewR) return;
      const gCycle = ((t * 0.0009 + gl.phase) % 3.0);
      if (gCycle < 0.6) {
        const gProg = gCycle / 0.6;
        const gSize = Math.sin(gProg * Math.PI) * 3.5;
        ctx.fillStyle = '#ffffff';
        // 4-point diamond star glint
        ctx.beginPath();
        ctx.moveTo(gl.x, gl.y - gSize);
        ctx.lineTo(gl.x + gSize * 0.3, gl.y);
        ctx.lineTo(gl.x + gSize, gl.y);
        ctx.lineTo(gl.x + gSize * 0.3, gl.y);
        ctx.lineTo(gl.x, gl.y + gSize);
        ctx.lineTo(gl.x - gSize * 0.3, gl.y);
        ctx.lineTo(gl.x - gSize, gl.y);
        ctx.lineTo(gl.x - gSize * 0.3, gl.y);
        ctx.closePath();
        ctx.fill();
      }
    });

    ctx.restore();
  }

drawPlatform(ctx, f, theme) {
    const p = theme.platform;
    const w = f.x2 - f.x1;
    const x = f.x1;
    const y = f.y + 14;

    ctx.save();

    // 1. Soft Under-Shelf Wall Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.40)';
    ctx.fillRect(x, y + 8, w, 4);

    // 2. Triangular Wall Support Brackets with Hex Rivets (Every 36px)
    ctx.fillStyle = p.trimColor || '#1e293b';
    for (let bx = x + 12; bx + 8 <= f.x2; bx += 36) {
      ctx.beginPath();
      ctx.moveTo(bx, y + 7);
      ctx.lineTo(bx + 8, y + 7);
      ctx.lineTo(bx, y + 16);
      ctx.closePath();
      ctx.fill();

      // Steel Hex Bolt head
      ctx.fillStyle = p.highlightColor || '#94a3b8';
      ctx.fillRect(bx + 2, y + 9, 2, 2);
      ctx.fillStyle = p.trimColor || '#1e293b';
    }

    // 3. Solid Underbody Shelf Girder
    ctx.fillStyle = p.bodyColor;
    ctx.fillRect(x, y + 2, w, 6);

    // 4. Walkable Countertop Surface
    ctx.fillStyle = p.topColor;
    ctx.fillRect(x, y, w, 3);

    // 5. Top Edge Specular Gleam / Highlight
    ctx.fillStyle = p.highlightColor;
    ctx.fillRect(x, y, w, 1);

    // 6. Front Bevel Sub-trim Line
    ctx.fillStyle = p.subColor || p.highlightColor;
    ctx.fillRect(x, y + 2, w, 1);

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
    } else if (p.style === 'cyber_furnace') {
      // Industrial riveted steel truss girders with X-brace pattern (Matching Reference Art)
      // Steel surface plate with heavy rivets
      for (let bx = x; bx < f.x2; bx += 14) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(bx, y, 1, 3);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(bx + 4, y + 1, 2, 2);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx + 5, y + 2, 1, 1);
      }
      // Truss X-brace lattice underbody
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      for (let bx = x; bx + 12 <= f.x2; bx += 12) {
        ctx.beginPath();
        ctx.moveTo(bx, y + 3);
        ctx.lineTo(bx + 12, y + 9);
        ctx.moveTo(bx + 12, y + 3);
        ctx.lineTo(bx, y + 9);
        ctx.stroke();
      }
      // Safety rail on upper catwalk (y === 104)
      if (Math.abs(f.y - 104) <= 6) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(f.x2, y - 8);
        ctx.stroke();
        for (let bx = x + 4; bx < f.x2; bx += 16) {
          ctx.beginPath();
          ctx.moveTo(bx, y - 8);
          ctx.lineTo(bx, y);
          ctx.stroke();
        }
      }
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

    // 0. Wall Mount Flange Brackets with Hex Anchor Bolts (Top, Mid, Bottom)
    ctx.fillStyle = ld.shadowColor || '#1e293b';
    for (const my of [y1 + 2, Math.floor((y1 + y2) / 2), y2 - 4]) {
      ctx.fillRect(x - 2, my - 2, 20, 4);
      // Anchor bolts
      ctx.fillStyle = ld.highlightColor || '#ffffff';
      ctx.fillRect(x - 1, my - 1, 1, 2);
      ctx.fillRect(x + 16, my - 1, 1, 2);
      ctx.fillStyle = ld.shadowColor || '#1e293b';
    }

    // 1. 3D Cylindrical Chrome Side Rails (Left and Right Pipes)
    // Left Rail (x + 1 .. x + 4)
    ctx.fillStyle = ld.railColor;
    ctx.fillRect(x + 1, y1, 3, y2 - y1);
    ctx.fillStyle = ld.highlightColor; // Left specular gleam
    ctx.fillRect(x + 1, y1, 1, y2 - y1);
    ctx.fillStyle = ld.shadowColor;    // Right edge shadow
    ctx.fillRect(x + 3, y1, 1, y2 - y1);

    // Right Rail (x + 12 .. x + 15)
    ctx.fillStyle = ld.railColor;
    ctx.fillRect(x + 12, y1, 3, y2 - y1);
    ctx.fillStyle = ld.highlightColor;
    ctx.fillRect(x + 12, y1, 1, y2 - y1);
    ctx.fillStyle = ld.shadowColor;
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

    // 1. Soft Ceramic Table Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 4, 18, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Porcelain Plate Base (Crisp ceramic oval)
    ctx.fillStyle = pl.bodyColor || '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 2, 17, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Royal Blue / Gold Bistro Rim Ring
    ctx.strokeStyle = pl.rimColor || '#0984e3';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 4. Inner Concentric Ring
    ctx.strokeStyle = pl.shadowColor || '#74b9ff';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 2, 13, 2, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Specular Porcelain Luster Highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 10, y, 14, 1);

    ctx.restore();
  }
}

window.stageThemesManager = new StageThemesManager();

