# Reglas del Proyecto - Burger Panic

## Sincronización Automática
- **Subir cambios siempre**: Cada vez que se realice un cambio, corrección, nueva funcionalidad o modificación de archivos en el proyecto, realiza inmediatamente un commit con un mensaje descriptivo y haz `git push origin main`.
- **Trabajo entre múltiples PCs**: Al iniciar una nueva sesión o tarea, si se detecta que hay cambios remotos, haz `git pull origin main` para mantener ambas máquinas (casa y oficina) sincronizadas.

## Arquitectura de Plataformas y Prevención de Bugs (MCP Platformer Architect)
- **Validación geométrica obligatoria**: Al crear o modificar niveles en `js/map.js`, verificar siempre que los extremos de las escaleras coincidan con pisos (`|floor.y - ladder.y| <= 8`) y que los enemigos aparezcan a más de 100px del Chef en pisos superiores.
- **Físicas sin tunneling**: Mantener la detección continua `prevY <= f.y + 2 && currentY >= f.y - 3` y velocidad terminal máxima de 4.5px/frame para evitar que los personajes atraviesen pisos al caer.
- **Desacoplamiento visual y lógico**: Mantener la hitbox lógica en 16x16 centrada, anclando los sprites HD del atlas a los pies (`drawY = (y + 16) - spriteHeight`).

