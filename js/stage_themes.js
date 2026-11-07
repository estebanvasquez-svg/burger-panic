/**
 * GBA Metroid Stage Themes & Architectural Tileset Engine for Burger Panic
 * Recreates the iconic visual atmosphere of Game Boy Advance classics
 * (Metroid Fusion / Metroid: Zero Mission) across all 15 stages.
 * Renders high-tech sci-fi girders, magnetic lift rails, anti-gravity teleporters,
 * and atmospheric BSL / Zebes backgrounds.
 */

class StageThemesManager {
  constructor() {
    this.cache = {};
  }

  getTheme(stageNum) {
    const s = Math.max(1, Math.min(stageNum || 1, 15));
    switch (s) {
      case 1:
        // Sector 0 / BSL Main Deck - Classic Culinary Lab
        return {
          id: 1,
          name: 'SECTOR 0: BSL RESEARCH DECK',
          subName: 'La Cocina Clásica',
          wallColor: '#070a12',
          wallGridColor: 'rgba(0, 240, 255, 0.05)',
          bgType: 'bsl_deck',
          bgAccent: '#00f0ff',
          platform: {
            topColor: '#38bdf8',
            highlightColor: '#ffffff',
            bodyColor: '#111827',
            trimColor: '#0284c7',
            subColor: '#00f0ff',
            style: 'metroid_titanium',
            glowColor: '#00f0ff'
          },
          ladder: {
            railColor: '#0284c7',
            rungColor: '#38bdf8',
            highlightColor: '#ffffff',
            shadowColor: '#0c2340',
            style: 'metroid_magrail'
          },
          plate: {
            rimColor: '#00f0ff',
            bodyColor: '#0b1329',
            shadowColor: '#0369a1',
            style: 'metroid_dock'
          }
        };

      case 2:
        // Sector 3 (PYR) - Geothermal Magma Refinery (La Despensa de Especias)
        return {
          id: 2,
          name: 'SECTOR 3: PYR MAGMA CORE',
          subName: 'Despensa de Especias',
          wallColor: '#120502',
          wallGridColor: 'rgba(255, 85, 0, 0.06)',
          bgType: 'norfair_magma',
          bgAccent: '#ff5500',
          platform: {
            topColor: '#f97316',
            highlightColor: '#fed7aa',
            bodyColor: '#1f0d06',
            trimColor: '#c2410c',
            subColor: '#ea580c',
            style: 'norfair_obsidian',
            glowColor: '#ff5500'
          },
          ladder: {
            railColor: '#ea580c',
            rungColor: '#fb923c',
            highlightColor: '#ffedd5',
            shadowColor: '#431407',
            style: 'thermal_magrail'
          },
          plate: {
            rimColor: '#f97316',
            bodyColor: '#270e04',
            shadowColor: '#9a3412',
            style: 'thermal_dock'
          }
        };

      case 3:
        // Sector 1 (SRX) - Biosphere & Alien Nursery (El Gran Bistró Gourmet)
        return {
          id: 3,
          name: 'SECTOR 1: SRX BIOSPHERE',
          subName: 'Bistró Gourmet',
          wallColor: '#040d0a',
          wallGridColor: 'rgba(16, 185, 129, 0.06)',
          bgType: 'sr388_bio',
          bgAccent: '#10b981',
          platform: {
            topColor: '#10b981',
            highlightColor: '#a7f3d0',
            bodyColor: '#062016',
            trimColor: '#059669',
            subColor: '#34d399',
            style: 'bio_containment',
            glowColor: '#10b981'
          },
          ladder: {
            railColor: '#059669',
            rungColor: '#34d399',
            highlightColor: '#ecfdf5',
            shadowColor: '#022c22',
            style: 'bio_magrail'
          },
          plate: {
            rimColor: '#34d399',
            bodyColor: '#041f16',
            shadowColor: '#047857',
            style: 'bio_dock'
          }
        };

      case 4:
        // Sector 4 (AQA) - Subaquatic Reactor (Marisquería del Pulpo)
        return {
          id: 4,
          name: 'SECTOR 4: AQA WATER REACTOR',
          subName: 'Marisquería del Pulpo',
          wallColor: '#020b14',
          wallGridColor: 'rgba(6, 182, 212, 0.06)',
          bgType: 'aqa_subaquatic',
          bgAccent: '#06b6d4',
          platform: {
            topColor: '#06b6d4',
            highlightColor: '#cffafe',
            bodyColor: '#081c2e',
            trimColor: '#0891b2',
            subColor: '#22d3ee',
            style: 'aquatic_alloy',
            glowColor: '#06b6d4'
          },
          ladder: {
            railColor: '#0891b2',
            rungColor: '#22d3ee',
            highlightColor: '#ecfeff',
            shadowColor: '#083344',
            style: 'aquatic_magrail'
          },
          plate: {
            rimColor: '#22d3ee',
            bodyColor: '#08253a',
            shadowColor: '#0e7490',
            style: 'aquatic_dock'
          }
        };

      case 5:
        // Sector 2 (TRO) - Bio-Arboretum (Barista / Boss: Root Pack)
        return {
          id: 5,
          name: 'SECTOR 2: TRO BIO-ARBORETUM',
          subName: '👑 Boss: The Root Pack',
          wallColor: '#0c0a04',
          wallGridColor: 'rgba(234, 179, 8, 0.06)',
          bgType: 'overgrown_lab',
          bgAccent: '#eab308',
          platform: {
            topColor: '#eab308',
            highlightColor: '#fef08a',
            bodyColor: '#231a06',
            trimColor: '#ca8a04',
            subColor: '#facc15',
            style: 'overgrown_truss',
            glowColor: '#eab308'
          },
          ladder: {
            railColor: '#ca8a04',
            rungColor: '#fde047',
            highlightColor: '#fefce8',
            shadowColor: '#422006',
            style: 'vine_magrail'
          },
          plate: {
            rimColor: '#facc15',
            bodyColor: '#261b05',
            shadowColor: '#a16207',
            style: 'amber_dock'
          }
        };

      case 6:
        // Sector 5 (ARC) - Sub-Zero Cryo Lab (La Pastelería Felina)
        return {
          id: 6,
          name: 'SECTOR 5: ARC CRYO-CHAMBER',
          subName: 'Pastelería Felina',
          wallColor: '#050a14',
          wallGridColor: 'rgba(147, 197, 253, 0.06)',
          bgType: 'cryo_station',
          bgAccent: '#93c5fd',
          platform: {
            topColor: '#60a5fa',
            highlightColor: '#eff6ff',
            bodyColor: '#0d1b33',
            trimColor: '#3b82f6',
            subColor: '#93c5fd',
            style: 'cryo_crystal',
            glowColor: '#60a5fa'
          },
          ladder: {
            railColor: '#3b82f6',
            rungColor: '#93c5fd',
            highlightColor: '#ffffff',
            shadowColor: '#172554',
            style: 'cryo_magrail'
          },
          plate: {
            rimColor: '#93c5fd',
            bodyColor: '#0f2244',
            shadowColor: '#1d4ed8',
            style: 'cryo_dock'
          }
        };

      case 7:
        // Sector 3 (PYR CORE) - Volcanic Citadel (El Castillo / Boss: Goopy)
        return {
          id: 7,
          name: 'PYR CORE: VOLCANIC CITADEL',
          subName: '👑 Boss: Goopy Le Grande',
          wallColor: '#140406',
          wallGridColor: 'rgba(239, 68, 68, 0.06)',
          bgType: 'norfair_magma',
          bgAccent: '#ef4444',
          platform: {
            topColor: '#ef4444',
            highlightColor: '#fee2e2',
            bodyColor: '#26090c',
            trimColor: '#dc2626',
            subColor: '#f87171',
            style: 'tourian_armor',
            glowColor: '#ef4444'
          },
          ladder: {
            railColor: '#dc2626',
            rungColor: '#fca5a5',
            highlightColor: '#ffffff',
            shadowColor: '#450a0a',
            style: 'thermal_magrail'
          },
          plate: {
            rimColor: '#f87171',
            bodyColor: '#2b0b10',
            shadowColor: '#b91c1c',
            style: 'thermal_dock'
          }
        };

      case 8:
        // Heavy Industrial Dragon Forge (La Forja del Dragón)
        return {
          id: 8,
          name: 'SECTOR 3: HEAVY ARMOR FORGE',
          subName: 'La Forja del Dragón',
          wallColor: '#120b04',
          wallGridColor: 'rgba(245, 158, 11, 0.06)',
          bgType: 'forge_industrial',
          bgAccent: '#f59e0b',
          platform: {
            topColor: '#f59e0b',
            highlightColor: '#fef3c7',
            bodyColor: '#221508',
            trimColor: '#d97706',
            subColor: '#fbbf24',
            style: 'heavy_hazard',
            glowColor: '#f59e0b'
          },
          ladder: {
            railColor: '#d97706',
            rungColor: '#fcd34d',
            highlightColor: '#ffffff',
            shadowColor: '#451a03',
            style: 'heavy_magrail'
          },
          plate: {
            rimColor: '#fbbf24',
            bodyColor: '#2c1a08',
            shadowColor: '#b45309',
            style: 'hazard_dock'
          }
        };

      case 9:
        // Deep Space Flagship Hangar (Cocina Alta Mar)
        return {
          id: 9,
          name: 'FEDERATION FLAGSHIP HANGAR',
          subName: 'Cocina Alta Mar',
          wallColor: '#060a12',
          wallGridColor: 'rgba(14, 165, 233, 0.06)',
          bgType: 'starship_hangar',
          bgAccent: '#0ea5e9',
          platform: {
            topColor: '#0ea5e9',
            highlightColor: '#e0f2fe',
            bodyColor: '#0b1626',
            trimColor: '#0284c7',
            subColor: '#38bdf8',
            style: 'hangar_bulkhead',
            glowColor: '#0ea5e9'
          },
          ladder: {
            railColor: '#0284c7',
            rungColor: '#7dd3fc',
            highlightColor: '#ffffff',
            shadowColor: '#082f49',
            style: 'metroid_magrail'
          },
          plate: {
            rimColor: '#38bdf8',
            bodyColor: '#0d1d33',
            shadowColor: '#0369a1',
            style: 'metroid_dock'
          }
        };

      case 10:
        // Sector 6 (NOC) - Dark Matter Quarantine (Heladería / Boss: Baroness)
        return {
          id: 10,
          name: 'SECTOR 6: NOC QUARANTINE',
          subName: '👑 Boss: Baroness Von Bon Bon',
          wallColor: '#0d0414',
          wallGridColor: 'rgba(217, 70, 239, 0.06)',
          bgType: 'x_quarantine',
          bgAccent: '#d946ef',
          platform: {
            topColor: '#d946ef',
            highlightColor: '#fae8ff',
            bodyColor: '#22082b',
            trimColor: '#c026d3',
            subColor: '#e879f9',
            style: 'dark_matter_grid',
            glowColor: '#d946ef'
          },
          ladder: {
            railColor: '#c026d3',
            rungColor: '#f0abfc',
            highlightColor: '#ffffff',
            shadowColor: '#4a044e',
            style: 'void_magrail'
          },
          plate: {
            rimColor: '#e879f9',
            bodyColor: '#290b33',
            shadowColor: '#a21caf',
            style: 'void_dock'
          }
        };

      case 11:
        // High-Speed Orbital Maglev (El Tren Bento)
        return {
          id: 11,
          name: 'ORBITAL MAGLEV MONORAIL',
          subName: 'Tren Bento Express',
          wallColor: '#040d0e',
          wallGridColor: 'rgba(20, 184, 166, 0.06)',
          bgType: 'maglev_tunnel',
          bgAccent: '#14b8a6',
          platform: {
            topColor: '#14b8a6',
            highlightColor: '#ccfbf1',
            bodyColor: '#071f1d',
            trimColor: '#0d9488',
            subColor: '#2dd4bf',
            style: 'maglev_composite',
            glowColor: '#14b8a6'
          },
          ladder: {
            railColor: '#0d9488',
            rungColor: '#5eead4',
            highlightColor: '#ffffff',
            shadowColor: '#042f2e',
            style: 'maglev_rail'
          },
          plate: {
            rimColor: '#2dd4bf',
            bodyColor: '#0a2926',
            shadowColor: '#0f766e',
            style: 'maglev_dock'
          }
        };

      case 12:
        // Ancient Chozo Temple Ruins (Wok Panda / Boss: Grim Matchstick)
        return {
          id: 12,
          name: 'CHOZO SANCTUARY RUINS',
          subName: '👑 Boss: Grim Matchstick',
          wallColor: '#080d0d',
          wallGridColor: 'rgba(45, 212, 191, 0.06)',
          bgType: 'chozo_temple',
          bgAccent: '#2dd4bf',
          platform: {
            topColor: '#2dd4bf',
            highlightColor: '#f0fdfa',
            bodyColor: '#0e1f1c',
            trimColor: '#0f766e',
            subColor: '#5eead4',
            style: 'chozo_carving',
            glowColor: '#2dd4bf'
          },
          ladder: {
            railColor: '#0f766e',
            rungColor: '#99f6e4',
            highlightColor: '#ffffff',
            shadowColor: '#134e4a',
            style: 'chozo_magrail'
          },
          plate: {
            rimColor: '#5eead4',
            bodyColor: '#102622',
            shadowColor: '#115e59',
            style: 'chozo_dock'
          }
        };

      case 13:
        // Deep Space Observation Deck (El Diner Cósmico)
        return {
          id: 13,
          name: 'COSMIC OBSERVATION DOCK',
          subName: 'Diner Cósmico',
          wallColor: '#090514',
          wallGridColor: 'rgba(168, 85, 247, 0.06)',
          bgType: 'deep_space',
          bgAccent: '#a855f7',
          platform: {
            topColor: '#a855f7',
            highlightColor: '#f3e8ff',
            bodyColor: '#190a2b',
            trimColor: '#9333ea',
            subColor: '#c084fc',
            style: 'forcefield_neon',
            glowColor: '#a855f7'
          },
          ladder: {
            railColor: '#9333ea',
            rungColor: '#d8b4fe',
            highlightColor: '#ffffff',
            shadowColor: '#3b0764',
            style: 'laser_magrail'
          },
          plate: {
            rimColor: '#c084fc',
            bodyColor: '#200e36',
            shadowColor: '#7e22ce',
            style: 'antigrav_dish'
          }
        };

      case 14:
        // Leviathan Subterranean Fossils (El Mesón Jurásico)
        return {
          id: 14,
          name: 'LEVIATHAN FOSSIL CORE',
          subName: 'Mesón Jurásico de Carnes',
          wallColor: '#0f0a06',
          wallGridColor: 'rgba(180, 83, 9, 0.06)',
          bgType: 'alien_cavern',
          bgAccent: '#b45309',
          platform: {
            topColor: '#d97706',
            highlightColor: '#fef3c7',
            bodyColor: '#261609',
            trimColor: '#b45309',
            subColor: '#f59e0b',
            style: 'leviathan_bone',
            glowColor: '#d97706'
          },
          ladder: {
            railColor: '#b45309',
            rungColor: '#fde68a',
            highlightColor: '#ffffff',
            shadowColor: '#451a03',
            style: 'bio_magrail'
          },
          plate: {
            rimColor: '#f59e0b',
            bodyColor: '#2e1b0c',
            shadowColor: '#92400e',
            style: 'bone_dock'
          }
        };

      case 15:
      default:
        // Mother Brain Tourian Core (Banquete Imperial / Boss: King Dice)
        return {
          id: 15,
          name: 'TOURIAN: MOTHER BRAIN CORE',
          subName: '👑 Final Boss: King Dice',
          wallColor: '#140308',
          wallGridColor: 'rgba(255, 0, 85, 0.08)',
          bgType: 'mother_brain_core',
          bgAccent: '#ff0055',
          platform: {
            topColor: '#ff0055',
            highlightColor: '#ffe4ed',
            bodyColor: '#2b0510',
            trimColor: '#d00045',
            subColor: '#ff4d88',
            style: 'tourian_supreme',
            glowColor: '#ff0055'
          },
          ladder: {
            railColor: '#ffd700',
            rungColor: '#ff0055',
            highlightColor: '#ffffff',
            shadowColor: '#500018',
            style: 'royal_carpet'
          },
          plate: {
            rimColor: '#ffd700',
            bodyColor: '#360614',
            shadowColor: '#ff0055',
            style: 'imperial_platter'
          }
        };
    }
  }

  // Draw customized GBA Metroid Platform
  drawPlatform(ctx, f, theme) {
    const p = theme.platform;
    const w = f.x2 - f.x1;
    const x = f.x1;
    const y = f.y + 14;

    ctx.save();

    // 1. High-Tech Dark Alloy Girder Base
    ctx.fillStyle = p.bodyColor;
    ctx.fillRect(x, y + 2, w, 6);

    // 2. Walkable Armor Deck Surface
    ctx.fillStyle = p.topColor;
    ctx.fillRect(x, y, w, 3);

    // 3. Specular Top Highlight Edge
    ctx.fillStyle = p.highlightColor;
    ctx.fillRect(x, y, w, 1);

    // 4. Subtle Bottom Shadow Bevel
    ctx.fillStyle = p.trimColor;
    ctx.fillRect(x, y + 7, w, 1);

    // 5. High-Tech GBA Metroid Modular Plating Details
    const now = Date.now();

    // Modular Seams & Rivets every 16px
    for (let bx = x; bx < f.x2; bx += 16) {
      // Joint seam line
      ctx.fillStyle = p.trimColor;
      ctx.fillRect(bx, y + 1, 1, 7);

      // Sci-Fi Metallic Rivet
      ctx.fillStyle = p.highlightColor;
      ctx.fillRect(bx + 4, y + 4, 2, 2);
      ctx.fillStyle = p.trimColor;
      ctx.fillRect(bx + 5, y + 5, 1, 1);

      // Metroid Energy Conduit / Neon Pulsing Seam
      const conduitPhase = Math.sin((now / 220) + (bx * 0.15));
      if (conduitPhase > 0.2) {
        ctx.fillStyle = p.subColor;
        ctx.fillRect(bx + 8, y + 3, 5, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx + 9, y + 3, 3, 1);
      } else {
        ctx.fillStyle = p.trimColor;
        ctx.fillRect(bx + 8, y + 3, 5, 1);
      }
    }

    // Hazard chevrons on ends
    ctx.fillStyle = p.subColor;
    ctx.fillRect(x, y + 1, 2, 7);
    ctx.fillRect(f.x2 - 2, y + 1, 2, 7);

    // Corner reinforcement brackets
    ctx.fillStyle = p.highlightColor;
    ctx.fillRect(x, y, 2, 2);
    ctx.fillRect(f.x2 - 2, y, 2, 2);

    ctx.restore();
  }

  // Draw customized GBA Metroid Magnetic Lift Ladder
  drawLadder(ctx, l, theme) {
    const ld = theme.ladder;
    const x = l.x;
    const y1 = l.y1 + 4;
    const y2 = l.y2 + 14;
    const now = Date.now();

    ctx.save();

    // 1. Dual Outer Magnetic Guide Rails (Metroid Tech)
    // Left Rail
    ctx.fillStyle = ld.railColor;
    ctx.fillRect(x + 1, y1, 3, y2 - y1);
    ctx.fillStyle = ld.highlightColor;
    ctx.fillRect(x + 1, y1, 1, y2 - y1);
    ctx.fillStyle = ld.shadowColor;
    ctx.fillRect(x + 3, y1, 1, y2 - y1);

    // Right Rail
    ctx.fillStyle = ld.railColor;
    ctx.fillRect(x + 12, y1, 3, y2 - y1);
    ctx.fillStyle = ld.highlightColor;
    ctx.fillRect(x + 12, y1, 1, y2 - y1);
    ctx.fillStyle = ld.shadowColor;
    ctx.fillRect(x + 14, y1, 1, y2 - y1);

    // 2. Center Energy Beam / Magnetic Plasma Field (Soft Backing)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x + 4, y1, 8, y2 - y1);

    // 3. Magnetic Floating Rungs (Every 8 pixels)
    for (let ry = y1 + 4; ry < y2 - 2; ry += 8) {
      // Magnetic bracket mounts on side rails
      ctx.fillStyle = ld.highlightColor;
      ctx.fillRect(x + 1, ry, 3, 2);
      ctx.fillRect(x + 12, ry, 3, 2);

      // Rung shadow
      ctx.fillStyle = ld.shadowColor;
      ctx.fillRect(x + 4, ry + 2, 8, 1);

      // Rung glowing plasma body
      ctx.fillStyle = ld.rungColor;
      ctx.fillRect(x + 4, ry, 8, 2);

      // High-energy core
      ctx.fillStyle = ld.highlightColor;
      ctx.fillRect(x + 6, ry, 4, 1);

      // Subtle vertical plasma pulse traveling up the ladder
      const pulseY = Math.floor((now / 150) % (y2 - y1)) + y1;
      if (Math.abs(ry - pulseY) < 6) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 5, ry, 6, 2);
      }
    }

    // Top and Bottom magnetic terminal couplers
    ctx.fillStyle = ld.highlightColor;
    ctx.fillRect(x, y1 - 2, 5, 3);
    ctx.fillRect(x + 11, y1 - 2, 5, 3);
    ctx.fillRect(x, y2 - 1, 5, 3);
    ctx.fillRect(x + 11, y2 - 1, 5, 3);

    ctx.restore();
  }

  // Draw customized GBA Metroid Matter Teleporter / Catching Dock Plate
  drawPlate(ctx, p, theme) {
    const pl = theme.plate;
    const x = p.x;
    const y = p.y + 14;
    const now = Date.now();

    ctx.save();

    // 1. Heavy Anti-Gravity Docking Cradle Base
    ctx.fillStyle = pl.bodyColor;
    ctx.fillRect(x + 2, y + 2, 32, 5);

    // 2. High-Tech Beveled Trim
    ctx.fillStyle = pl.shadowColor;
    ctx.fillRect(x + 1, y + 5, 34, 2);
    ctx.fillRect(x + 4, y + 7, 28, 1);

    // 3. Radiant Energy Catch Basin (Glowing Surface)
    ctx.fillStyle = pl.rimColor;
    ctx.fillRect(x + 3, y + 1, 30, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, y + 1, 24, 1);

    // 4. Side Containment Pylons
    ctx.fillStyle = pl.rimColor;
    ctx.fillRect(x, y - 1, 3, 7);
    ctx.fillRect(x + 33, y - 1, 3, 7);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 1, y - 1, 1, 4);
    ctx.fillRect(x + 34, y - 1, 1, 4);

    // 5. Pulsing Docking Beacon LEDs
    const blink = Math.floor(now / 300) % 2 === 0;
    ctx.fillStyle = blink ? '#00ff88' : pl.rimColor;
    ctx.fillRect(x + 1, y + 1, 1, 2);
    ctx.fillRect(x + 34, y + 1, 1, 2);

    // Center holographic receptor glyph
    ctx.fillStyle = pl.rimColor;
    ctx.fillRect(x + 16, y + 3, 4, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 17, y + 3, 2, 1);

    ctx.restore();
  }

  // Draw Atmospheric GBA Metroid Background (BSL / Zebes Deep Sci-Fi Layer)
  drawBackground(ctx, theme, width, height, cameraX = 0) {
    ctx.save();

    // 1. Deep Space / Bio-Station Atmospheric Base Gradient
    ctx.fillStyle = theme.wallColor;
    ctx.fillRect(0, 0, width, height);

    const now = Date.now();
    const accent = theme.bgAccent || '#00f0ff';

    // 2. Parallax Grid & Modular Wall Panels
    const parallaxX = -Math.round(cameraX * 0.35);
    ctx.translate(parallaxX, 0);

    const worldW = Math.max(width, 450);

    // Structural Vertical Bulkhead Pillars every 80px
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let px = 20; px < worldW; px += 80) {
      ctx.fillRect(px, 36, 12, height - 36);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(px + 10, 36, 2, height - 36);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';

      // Vertical coolant conduit inside pillar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(px + 3, 40, 6, height - 44);

      // Energy fluid pulse flowing through conduit
      const pulsePos = (now / 20 + px * 3) % (height - 60) + 40;
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.45;
      ctx.fillRect(px + 4, pulsePos, 4, 16);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 5, pulsePos + 4, 2, 8);
      ctx.globalAlpha = 1.0;
    }

    // Horizontal Diagnostic Wire Traces & Girder Shadows every 48px (matching floor grid)
    for (let py = 48; py < height; py += 48) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, py - 4, worldW, 3);
      ctx.fillStyle = theme.wallGridColor;
      ctx.fillRect(0, py - 2, worldW, 1);
    }

    // High-Tech Diagnostic Computer Terminals / Biosensors in the background
    const terminals = [
      { x: 50, y: 70, w: 28, h: 22 },
      { x: 190, y: 118, w: 32, h: 20 },
      { x: 90, y: 166, w: 26, h: 18 },
      { x: 230, y: 214, w: 30, h: 22 },
      { x: 60, y: 262, w: 32, h: 20 }
    ];

    for (let t of terminals) {
      if (t.x + t.w < worldW) {
        // Monitor Bezel
        ctx.fillStyle = '#05070d';
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(t.x, t.y, t.w, t.h);

        // Screen Glow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(t.x + 2, t.y + 2, t.w - 4, t.h - 4);

        // Animated Oscilloscope / Electrocardiogram Waveform on Screen
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let sx = 0; sx < t.w - 6; sx += 2) {
          const sy = Math.sin((now / 180) + (sx * 0.4) + t.x) * 4;
          const drawX = t.x + 3 + sx;
          const drawY = t.y + Math.floor(t.h / 2) + sy;
          if (sx === 0) ctx.moveTo(drawX, drawY);
          else ctx.lineTo(drawX, drawY);
        }
        ctx.stroke();

        // Terminal Status Diode
        const diodeBlink = Math.floor(now / 400 + t.x) % 2 === 0;
        ctx.fillStyle = diodeBlink ? '#00ff88' : '#005522';
        ctx.fillRect(t.x + t.w - 5, t.y + 2, 2, 2);
      }
    }

    // Warning / Hazard Strobes on ceiling (flashing softly)
    const strobeBlink = Math.floor(now / 500) % 2 === 0;
    if (strobeBlink) {
      for (let bx = 60; bx < worldW; bx += 120) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(bx, 40, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx - 1, 38, 3, 3);
      }
    }

    ctx.restore();
  }
}

window.stageThemesManager = new StageThemesManager();
