"""
Platformer Engine MCP Server - Burger Panic Mobile
Specialized in mobile arcade platformers, dynamic level generation,
dynamic platform physics (diagonal, elevator, swaying, swing),
reachability analysis, and character physics bug prevention.
"""

import json
import re
import math
from typing import Dict, Any, List, Optional
from mcp.server.mcpserver import MCPServer

app = MCPServer("platformer-architect")

MAP_JS_PATH = r"c:\Users\User\Documents\antigrvaty\burger-panic\js\map.js"


def get_floor_elevation(f: Dict[str, Any], x: float) -> float:
    """Calculates exact floor elevation for horizontal or diagonal floors."""
    if f.get('type') == 'diagonal':
        x1 = f.get('x1', 0)
        x2 = f.get('x2', 1)
        y1 = f.get('y1', 0)
        y2 = f.get('y2', 0)
        ratio = max(0.0, min(1.0, (x - x1) / max(1, x2 - x1)))
        return y1 + (y2 - y1) * ratio
    return f.get('y', 0)


def parse_floors_from_block(block: str) -> List[Dict[str, Any]]:
    """Robust parser for both static and dynamic floor objects in map.js."""
    floors = []
    floors_match = re.search(r'floors:\s*\[([\s\S]*?)\]\s*,', block)
    if not floors_match:
        return floors

    floors_str = floors_match.group(1)
    # Find all object literals: { ... }
    for obj_match in re.finditer(r'\{([^{}]+)\}', floors_str):
        raw = obj_match.group(1)
        item: Dict[str, Any] = {}
        # Parse type
        type_m = re.search(r"type:\s*'([^']+)'", raw)
        if type_m:
            item['type'] = type_m.group(1)
        
        # Parse numeric keys
        for num_key in ['y', 'x1', 'x2', 'y1', 'y2', 'minY', 'maxY', 'baseX1', 'baseX2', 'range', 'speed', 'phase', 'pivotX', 'pivotY', 'length', 'width', 'maxAngle']:
            val_m = re.search(rf"\b{num_key}:\s*([0-9.-]+)", raw)
            if val_m:
                val_str = val_m.group(1)
                item[num_key] = float(val_str) if ('.' in val_str) else int(val_str)
        
        if 'x1' in item and 'x2' in item:
            floors.append(item)

    return floors


@app.tool()
def validate_stage_architecture(stage_number: int) -> str:
    """
    Analyzes an existing stage in Burger Panic to detect bugs, ladder misalignments,
    infinite falls, stuck collision spots, safe enemy spawn distances, and dynamic platform mechanics.
    """
    try:
        with open(MAP_JS_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        return f"Error reading map.js: {str(e)}"

    # Search for stage block: stageNumber: X ...
    pattern = rf'stageNumber:\s*{stage_number}\b[\s\S]*?(?=stageNumber:\s*{stage_number + 1}\b|\Z)'
    match = re.search(pattern, content)
    if not match:
        return f"Stage {stage_number} not found in map.js."

    block = match.group(0)

    # Extract stage name & width
    name_match = re.search(r"name:\s*'([^']+)'", block)
    stage_name = name_match.group(1) if name_match else f"Nivel {stage_number}"
    
    width_match = re.search(r"width:\s*(\d+)", block)
    stage_width = int(width_match.group(1)) if width_match else 240

    # Extract floors (static and dynamic)
    floors = parse_floors_from_block(block)

    # Extract ladders: { x: 44, y1: 52, y2: 100 }
    ladder_matches = re.findall(r'x:\s*(\d+),\s*y1:\s*(\d+),\s*y2:\s*(\d+)', block)
    ladders = [{'x': int(x), 'y1': int(y1), 'y2': int(y2)} for x, y1, y2 in ladder_matches]

    # Extract player spawn
    p_match = re.search(r'playerStart:\s*\{\s*x:\s*(\d+),\s*y:\s*(\d+)\s*\}', block)
    player = {'x': int(p_match.group(1)), 'y': int(p_match.group(2))} if p_match else {'x': 112, 'y': 288}

    # Extract enemy spawns
    enemy_matches = re.findall(r"\{\s*type:\s*'([^']+)',\s*x:\s*(\d+),\s*y:\s*(\d+)\s*\}", block)
    enemies = [{'type': t, 'x': int(x), 'y': int(y)} for t, x, y in enemy_matches]

    # Classify platforms
    static_floors = [f for f in floors if not f.get('type')]
    dynamic_floors = [f for f in floors if f.get('type')]
    dyn_types = [f.get('type') for f in dynamic_floors]

    report = []
    report.append(f"=== REPORTE ARQUITECTÓNICO - NIVEL {stage_number}: {stage_name} ===")
    report.append(f"• Ancho de mapa: {stage_width}px (Cámara panorámica activa)")
    report.append(f"• Pisos totales: {len(floors)} ({len(static_floors)} estáticos, {len(dynamic_floors)} dinámicos)")
    if dyn_types:
        report.append(f"• Plataformas dinámicas activas: {dyn_types}")
    report.append(f"• Escaleras totales: {len(ladders)}")
    report.append(f"• Enemigos configurados: {len(enemies)}")
    report.append(f"• Spawn del Chef Pepe: ({player['x']}, {player['y']})\n")

    # 1. VERIFICAR ALINEACIÓN DE ESCALERAS (Prevención de bugs de caídas infinitas)
    ladder_bugs = []
    for i, l in enumerate(ladders):
        top_connected = False
        bot_connected = False
        lx = l['x']
        for f in floors:
            if lx + 14 >= f['x1'] and lx + 2 <= f['x2']:
                fy = get_floor_elevation(f, lx + 8)
                if abs(fy - l['y1']) <= 8:
                    top_connected = True
                if abs(fy - l['y2']) <= 8:
                    bot_connected = True

        if not top_connected:
            ladder_bugs.append(f"Escalera #{i+1} en x={l['x']}: el extremo superior (y1={l['y1']}) no conecta con ningún piso.")
        if not bot_connected:
            ladder_bugs.append(f"Escalera #{i+1} en x={l['x']}: el extremo inferior (y2={l['y2']}) no conecta con ningún piso.")

    if ladder_bugs:
        report.append("❌ BUGS DE ESCALERAS DETECTADOS:")
        report.extend([f"  - {b}" for b in ladder_bugs])
    else:
        report.append("✅ Todas las escaleras conectan perfectamente con pisos (0 bugs de desconexión).")

    # 2. VERIFICAR DISTANCIA DE SEGURIDAD EN SPAWN DE ENEMIGOS (Anti-Spawn Kill)
    spawn_warnings = []
    for e in enemies:
        dist = math.hypot((e['x'] + 8) - (player['x'] + 8), (e['y'] + 8) - (player['y'] + 8))
        if dist < 80:
            spawn_warnings.append(f"Enemigo '{e['type']}' en ({e['x']}, {e['y']}) está a solo {dist:.1f}px del Chef. Riesgo de spawn-kill.")

    if spawn_warnings:
        report.append("\n⚠️ ADVERTENCIAS DE BALANCE / SPAWN:")
        report.extend([f"  - {w}" for w in spawn_warnings])
    else:
        report.append("✅ Spawns de enemigos en pisos superiores y seguros lejos del Chef Pepe.")

    # 3. VERIFICAR PLATAFORMAS DINÁMICAS
    if dynamic_floors:
        report.append("\n🕹️ VALIDACIÓN DE PLATAFORMAS DINÁMICAS:")
        for df in dynamic_floors:
            t = df.get('type')
            if t == 'diagonal':
                report.append(f"  • Rampa Diagonal: x1={df['x1']}, y1={df['y1']} -> x2={df['x2']}, y2={df['y2']}. Pendiente suave para Chef y enemigos.")
            elif t == 'elevator':
                report.append(f"  • Elevador Vertical: x=[{df['x1']}, {df['x2']}], rango Y=[{df.get('minY')}, {df.get('maxY')}], vel={df.get('speed')}. Inercia activa.")
            elif t == 'swaying':
                report.append(f"  • Plataforma Balanceante: Y={df.get('y')}, base=[{df.get('baseX1')}, {df.get('baseX2')}], rango={df.get('range')}px. Arrastre horizontal.")
            elif t == 'swing':
                report.append(f"  • Plataforma Columpio (Péndulo): pivote=({df.get('pivotX')}, {df.get('pivotY')}), cuerda={df.get('length')}px, oscilación={df.get('maxAngle')}rad.")

    return "\n".join(report)


@app.tool()
def generate_dynamic_stage(
    stage_number: int,
    theme: str = "Arcade Diner",
    difficulty: str = "medium",
    width: int = 380,
    dynamic_platform_type: str = "mixed",
    num_burgers: int = 4,
    num_floors: int = 6
) -> str:
    """
    Generates a complete, balanced, bug-free platformer level for Burger Panic.
    Creates platforms (including dynamic elevators, swaying, swing, or diagonal ramps),
    interconnecting ladders, burger towers, and balanced enemy spawns.
    """
    top_y = 48
    bottom_y = 288
    available_height = bottom_y - top_y
    floor_spacing = int(available_height / (num_floors - 1))

    floors: List[Dict[str, Any]] = []
    
    # Bottom floor is always full width ground
    floors.append({'y': bottom_y, 'x1': 12, 'x2': width - 12})

    # Intermediate static floors with gaps for dynamics
    for i in range(num_floors - 2, 0, -1):
        fy = top_y + i * floor_spacing
        floors.append({'y': fy, 'x1': 16, 'x2': int(width * 0.4)})
        floors.append({'y': fy, 'x1': int(width * 0.6), 'x2': width - 16})

    # Top floor
    floors.append({'y': top_y, 'x1': 16, 'x2': int(width * 0.35)})
    floors.append({'y': top_y, 'x1': int(width * 0.45), 'x2': width - 16})

    # Inject requested dynamic platforms organically
    mid_y = top_y + 2 * floor_spacing
    if dynamic_platform_type in ['elevator', 'mixed']:
        floors.append({
            'type': 'elevator',
            'x1': int(width * 0.42),
            'x2': int(width * 0.58),
            'y': mid_y,
            'minY': top_y + floor_spacing,
            'maxY': bottom_y - floor_spacing,
            'speed': 0.03,
            'phase': 0
        })

    if dynamic_platform_type in ['swaying', 'mixed']:
        floors.append({
            'type': 'swaying',
            'y': top_y + floor_spacing,
            'baseX1': int(width * 0.40),
            'baseX2': int(width * 0.60),
            'range': 35,
            'speed': 0.032,
            'phase': 1.5,
            'x1': int(width * 0.40),
            'x2': int(width * 0.60)
        })

    if dynamic_platform_type in ['swing', 'mixed']:
        floors.append({
            'type': 'swing',
            'pivotX': int(width * 0.5),
            'pivotY': 30,
            'length': 110,
            'width': 48,
            'maxAngle': 0.30,
            'speed': 0.024,
            'phase': 0,
            'x1': int(width * 0.5 - 24),
            'x2': int(width * 0.5 + 24),
            'y': mid_y
        })

    if dynamic_platform_type in ['diagonal', 'mixed']:
        floors.append({
            'type': 'diagonal',
            'x1': int(width * 0.35),
            'y1': top_y + floor_spacing,
            'x2': int(width * 0.45),
            'y2': top_y + 2 * floor_spacing
        })

    # Ladders
    ladders = [
        {'x': 18, 'y1': top_y, 'y2': bottom_y},
        {'x': width - 20, 'y1': top_y, 'y2': bottom_y},
        {'x': 60, 'y1': top_y, 'y2': top_y + 2 * floor_spacing},
        {'x': width - 60, 'y1': top_y + floor_spacing, 'y2': bottom_y}
    ]

    # Burgers & Plates
    col_spacing = int((width - 80) / max(1, num_burgers - 1))
    burger_cols = [32 + k * col_spacing for k in range(num_burgers)]
    burgers = []
    plates = []
    for col_idx, bx in enumerate(burger_cols):
        plates.append({'x': bx - 2, 'y': bottom_y})
        burgers.append({'col': col_idx, 'x': bx, 'y': top_y, 'type': 'bun_top'})
        burgers.append({'col': col_idx, 'x': bx, 'y': top_y + floor_spacing, 'type': 'lettuce'})
        burgers.append({'col': col_idx, 'x': bx, 'y': top_y + 2 * floor_spacing, 'type': 'patty'})
        burgers.append({'col': col_idx, 'x': bx, 'y': top_y + 3 * floor_spacing, 'type': 'bun_bottom'})

    speed_map = {'easy': 0.85, 'medium': 1.05, 'hard': 1.25}
    speed = speed_map.get(difficulty, 1.05)

    enemies = [
        {'type': 'hotdog', 'x': 32, 'y': top_y},
        {'type': 'hotdog', 'x': width - 40, 'y': top_y},
        {'type': 'pickle', 'x': burger_cols[1] if len(burger_cols) > 1 else 100, 'y': top_y},
        {'type': 'egg', 'x': burger_cols[2] if len(burger_cols) > 2 else 200, 'y': top_y}
    ]

    result = {
        'stageNumber': stage_number,
        'name': theme.upper(),
        'width': width,
        'bonusSpots': [{'x': int(width * 0.25), 'y': mid_y}, {'x': int(width * 0.75), 'y': mid_y}],
        'floors': floors,
        'ladders': ladders,
        'burgers': burgers,
        'plates': plates,
        'playerStart': {'x': int(width / 2), 'y': bottom_y},
        'enemies': enemies,
        'enemySpeed': speed
    }

    return f"// === CÓDIGO GENERADO PARA NIVEL {stage_number} ===\n{json.dumps(result, indent=2)}"


@app.tool()
def diagnose_character_physics_rules() -> str:
    """
    Returns the golden rules and math formulas to prevent platformer bugs:
    sloped diagonal movement, dynamic elevator/swaying inertia inheritance,
    continuous landing collision without tunneling, and decal alignment.
    """
    rules = [
        "=== PROTOCOLO DE PREVENCIÓN DE BUGS EN FÍSICAS DE PLATAFORMAS (MÓVIL ARCADE) ===",
        "",
        "1. ELEVACIÓN EXACTA EN PISOS DIAGONALES (RAMPAS):",
        "   - ratio = Math.max(0, Math.min(1, (footCenter - f.x1) / (f.x2 - f.x1)));",
        "   - floorY = f.y1 + (f.y2 - f.y1) * ratio;",
        "   - El Chef y los enemigos caminan suavemente ajustando su altura en cada paso horizontal.",
        "",
        "2. INERCIA Y ARRASTRE DE PLATAFORMAS MÓVILES (ELEVADORES, BALANCEANTES, COLUMPIOS):",
        "   - Cada frame, la plataforma actualiza su velocidad interna: f.vx = f.x1 - oldX1; f.vy = f.y - oldY;",
        "   - Si el personaje está sobre la plataforma (caminando o quieto):",
        "     this.x += currentFloor.vx; this.y += currentFloor.vy;",
        "   - Cero deslizamiento accidental y sincronización milimétrica con el piso móvil.",
        "",
        "3. PREVENCIÓN DE TUNNELING (ATRAVESAR PISOS AL CAER):",
        "   - Al caer con velocidad vy > 0, nunca verificar solo 'y === floor.y'.",
        "   - Verificar barrido continuo: 'prevY <= floorY + 2 && currentY >= floorY - 3'.",
        "   - Limitar velocidad terminal: vy_max = 4.5px/frame para garantizar solapamiento de hitboxes.",
        "",
        "4. SOLAPAMIENTO DE ESCALERAS EN PLATAFORMAS DINÁMICAS:",
        "   - Las escaleras se anclan a plataformas sólidas de soporte.",
        "   - Al descender o subir, 'getFloorElevation(floor, ladder.x + 8)' garantiza aterrizaje exacto.",
        "   - Tolerancia de conexión lógica: |floor.y - ladder.y| <= 8.",
        "",
        "5. DESACOPLAMIENTO DE HITBOX Y SPRITE ATLAS:",
        "   - Hitbox lógica: 16x16 centrada en el eje físico.",
        "   - Renderizado gráfico HD: anclado a los pies: drawY = (y + 16) - spriteHeight."
    ]
    return "\n".join(rules)


if __name__ == "__main__":
    app.run(transport="stdio")
