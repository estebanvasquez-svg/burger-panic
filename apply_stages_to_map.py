import json
from generate_all_wide_stages import build_stages_4_to_15

stages = build_stages_4_to_15()

def format_stage(s):
    lines = []
    lines.append("      // ==========================================")
    lines.append(f"      // STAGE {s['stageNumber']}: {s['name']} (Wide Screen: {s['width']}px)")
    lines.append("      // ==========================================")
    lines.append("      {")
    lines.append(f"        stageNumber: {s['stageNumber']},")
    lines.append(f"        name: '{s['name']}',")
    lines.append(f"        width: {s['width']},")
    
    # bonusSpots
    lines.append("        bonusSpots: [")
    for spot in s['bonusSpots']:
        lines.append(f"          {{ x: {spot['x']}, y: {spot['y']} }},")
    # remove trailing comma from last item
    lines[-1] = lines[-1].rstrip(',')
    lines.append("        ],")

    # floors
    lines.append("        floors: [")
    for f in s['floors']:
        lines.append(f"          {{ y: {f['y']}, x1: {f['x1']}, x2: {f['x2']} }},")
    lines[-1] = lines[-1].rstrip(',')
    lines.append("        ],")

    # ladders
    lines.append("        ladders: [")
    for l in s['ladders']:
        lines.append(f"          {{ x: {l['x']}, y1: {l['y1']}, y2: {l['y2']} }},")
    lines[-1] = lines[-1].rstrip(',')
    lines.append("        ],")

    # burgers
    lines.append("        burgers: [")
    for b in s['burgers']:
        lines.append(f"          {{ col: {b['col']}, x: {b['x']}, y: {b['y']}, type: '{b['type']}' }},")
    lines[-1] = lines[-1].rstrip(',')
    lines.append("        ],")

    # plates
    lines.append("        plates: [")
    for p in s['plates']:
        lines.append(f"          {{ x: {p['x']}, y: {p['y']} }},")
    lines[-1] = lines[-1].rstrip(',')
    lines.append("        ],")

    # playerStart
    p = s['playerStart']
    lines.append(f"        playerStart: {{ x: {p['x']}, y: {p['y']} }},")

    # enemies
    lines.append("        enemies: [")
    for e in s['enemies']:
        lines.append(f"          {{ type: '{e['type']}', x: {e['x']}, y: {e['y']} }},")
    lines[-1] = lines[-1].rstrip(',')
    lines.append("        ],")

    lines.append(f"        enemySpeed: {s['enemySpeed']}")
    lines.append("      },")
    return "\n".join(lines)

all_stages_js = []
for s in stages:
    all_stages_js.append(format_stage(s))

# Remove trailing comma on last stage
all_stages_js[-1] = all_stages_js[-1][:-1] # remove trailing ','

joined_stages_js = "\n\n".join(all_stages_js)

with open('js/map.js', 'r', encoding='utf-8') as f:
    map_text = f.read()

# Locate where stage 4 starts
marker_start = "      // ==========================================\n      // STAGE 4:"
idx_start = map_text.find(marker_start)
if idx_start == -1:
    marker_start = "// STAGE 4"
    idx_start = map_text.find(marker_start)

# Find the end of defineLevels array: ];\n  }\n\n  getLevel
idx_end = map_text.find("    ];\n  }\n\n  getLevel")
if idx_end == -1:
    idx_end = map_text.find("    ];\n  }\n  getLevel")

print(f"Replacing map.js from index {idx_start} to {idx_end}...")

new_map_text = map_text[:idx_start] + joined_stages_js + "\n    " + map_text[idx_end:]

with open('js/map.js', 'w', encoding='utf-8') as f:
    f.write(new_map_text)

print("Successfully replaced stages 4 to 15 in js/map.js!")

