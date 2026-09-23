import { DrawingStroke } from '../types';

export function getBotDrawingStrokes(word: string): DrawingStroke[] {
  const clean = word.toUpperCase().trim();
  const idPrefix = `bot_st_${Date.now()}`;

  // Helper to build stroke
  const stroke = (
    index: number,
    color: string,
    size: number,
    points: { x: number; y: number }[],
    tool: 'pencil' | 'eraser' | 'fill' = 'pencil'
  ): DrawingStroke => ({
    id: `${idPrefix}_${index}`,
    tool,
    color,
    size,
    points,
  });

  // Circle generator helper
  const circlePoints = (cx: number, cy: number, r: number, steps = 16) => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  };

  switch (clean) {
    case 'CAT':
      return [
        // Head
        stroke(1, '#000000', 8, circlePoints(0.5, 0.42, 0.18)),
        // Left ear
        stroke(2, '#000000', 8, [
          { x: 0.35, y: 0.32 },
          { x: 0.32, y: 0.18 },
          { x: 0.44, y: 0.26 },
        ]),
        // Right ear
        stroke(3, '#000000', 8, [
          { x: 0.56, y: 0.26 },
          { x: 0.68, y: 0.18 },
          { x: 0.65, y: 0.32 },
        ]),
        // Left eye
        stroke(4, '#000000', 8, circlePoints(0.43, 0.39, 0.03)),
        // Right eye
        stroke(5, '#000000', 8, circlePoints(0.57, 0.39, 0.03)),
        // Nose & mouth
        stroke(6, '#ef4444', 6, [
          { x: 0.48, y: 0.45 },
          { x: 0.52, y: 0.45 },
          { x: 0.5, y: 0.48 },
          { x: 0.48, y: 0.45 },
        ]),
        stroke(7, '#000000', 6, [
          { x: 0.5, y: 0.48 },
          { x: 0.46, y: 0.52 },
        ]),
        stroke(8, '#000000', 6, [
          { x: 0.5, y: 0.48 },
          { x: 0.54, y: 0.52 },
        ]),
        // Whiskers
        stroke(9, '#000000', 5, [
          { x: 0.38, y: 0.46 },
          { x: 0.24, y: 0.44 },
        ]),
        stroke(10, '#000000', 5, [
          { x: 0.38, y: 0.49 },
          { x: 0.25, y: 0.52 },
        ]),
        stroke(11, '#000000', 5, [
          { x: 0.62, y: 0.46 },
          { x: 0.76, y: 0.44 },
        ]),
        stroke(12, '#000000', 5, [
          { x: 0.62, y: 0.49 },
          { x: 0.75, y: 0.52 },
        ]),
        // Body & tail
        stroke(13, '#000000', 8, [
          { x: 0.4, y: 0.58 },
          { x: 0.36, y: 0.8 },
          { x: 0.64, y: 0.8 },
          { x: 0.6, y: 0.58 },
        ]),
        stroke(14, '#000000', 8, [
          { x: 0.62, y: 0.78 },
          { x: 0.76, y: 0.72 },
          { x: 0.8, y: 0.62 },
        ]),
      ];

    case 'HOUSE':
      return [
        // Walls square
        stroke(1, '#000000', 8, [
          { x: 0.28, y: 0.45 },
          { x: 0.72, y: 0.45 },
          { x: 0.72, y: 0.82 },
          { x: 0.28, y: 0.82 },
          { x: 0.28, y: 0.45 },
        ]),
        // Triangle roof
        stroke(2, '#ef4444', 9, [
          { x: 0.22, y: 0.47 },
          { x: 0.5, y: 0.18 },
          { x: 0.78, y: 0.47 },
          { x: 0.22, y: 0.47 },
        ]),
        // Door
        stroke(3, '#78350f', 8, [
          { x: 0.44, y: 0.82 },
          { x: 0.44, y: 0.62 },
          { x: 0.56, y: 0.62 },
          { x: 0.56, y: 0.82 },
        ]),
        // Door knob
        stroke(4, '#eab308', 7, [{ x: 0.53, y: 0.72 }]),
        // Window left
        stroke(5, '#06b6d4', 6, [
          { x: 0.33, y: 0.52 },
          { x: 0.41, y: 0.52 },
          { x: 0.41, y: 0.62 },
          { x: 0.33, y: 0.62 },
          { x: 0.33, y: 0.52 },
        ]),
        // Window right
        stroke(6, '#06b6d4', 6, [
          { x: 0.59, y: 0.52 },
          { x: 0.67, y: 0.52 },
          { x: 0.67, y: 0.62 },
          { x: 0.59, y: 0.62 },
          { x: 0.59, y: 0.52 },
        ]),
        // Chimney
        stroke(7, '#64748b', 7, [
          { x: 0.62, y: 0.3 },
          { x: 0.62, y: 0.18 },
          { x: 0.69, y: 0.18 },
          { x: 0.69, y: 0.37 },
        ]),
      ];

    case 'SUN':
      return [
        // Center yellow sun
        stroke(1, '#eab308', 12, circlePoints(0.5, 0.5, 0.2)),
        // Fill sun yellow
        stroke(2, '#eab308', 0, [{ x: 0.5, y: 0.5 }], 'fill'),
        // Rays
        stroke(3, '#f97316', 8, [{ x: 0.5, y: 0.26 }, { x: 0.5, y: 0.12 }]),
        stroke(4, '#f97316', 8, [{ x: 0.5, y: 0.74 }, { x: 0.5, y: 0.88 }]),
        stroke(5, '#f97316', 8, [{ x: 0.26, y: 0.5 }, { x: 0.12, y: 0.5 }]),
        stroke(6, '#f97316', 8, [{ x: 0.74, y: 0.5 }, { x: 0.88, y: 0.5 }]),
        stroke(7, '#f97316', 8, [{ x: 0.33, y: 0.33 }, { x: 0.22, y: 0.22 }]),
        stroke(8, '#f97316', 8, [{ x: 0.67, y: 0.33 }, { x: 0.78, y: 0.22 }]),
        stroke(9, '#f97316', 8, [{ x: 0.33, y: 0.67 }, { x: 0.22, y: 0.78 }]),
        stroke(10, '#f97316', 8, [{ x: 0.67, y: 0.67 }, { x: 0.78, y: 0.78 }]),
        // Happy face on sun
        stroke(11, '#000000', 6, circlePoints(0.44, 0.46, 0.02)),
        stroke(12, '#000000', 6, circlePoints(0.56, 0.46, 0.02)),
        stroke(13, '#000000', 6, [
          { x: 0.44, y: 0.54 },
          { x: 0.5, y: 0.58 },
          { x: 0.56, y: 0.54 },
        ]),
      ];

    case 'CAR':
      return [
        // Car body
        stroke(1, '#ef4444', 9, [
          { x: 0.15, y: 0.6 },
          { x: 0.28, y: 0.6 },
          { x: 0.38, y: 0.42 },
          { x: 0.68, y: 0.42 },
          { x: 0.78, y: 0.6 },
          { x: 0.88, y: 0.6 },
          { x: 0.88, y: 0.72 },
          { x: 0.15, y: 0.72 },
          { x: 0.15, y: 0.6 },
        ]),
        // Color inside car
        stroke(2, '#ef4444', 0, [{ x: 0.5, y: 0.55 }], 'fill'),
        // Windows
        stroke(3, '#06b6d4', 6, [
          { x: 0.4, y: 0.45 },
          { x: 0.52, y: 0.45 },
          { x: 0.52, y: 0.58 },
          { x: 0.33, y: 0.58 },
          { x: 0.4, y: 0.45 },
        ]),
        stroke(4, '#06b6d4', 6, [
          { x: 0.55, y: 0.45 },
          { x: 0.66, y: 0.45 },
          { x: 0.74, y: 0.58 },
          { x: 0.55, y: 0.58 },
          { x: 0.55, y: 0.45 },
        ]),
        // Wheels
        stroke(5, '#000000', 10, circlePoints(0.32, 0.72, 0.08)),
        stroke(6, '#000000', 10, circlePoints(0.72, 0.72, 0.08)),
        // Wheel hubcaps
        stroke(7, '#ffffff', 5, circlePoints(0.32, 0.72, 0.03)),
        stroke(8, '#ffffff', 5, circlePoints(0.72, 0.72, 0.03)),
      ];

    case 'TREE':
      return [
        // Brown trunk
        stroke(1, '#78350f', 10, [
          { x: 0.44, y: 0.5 },
          { x: 0.42, y: 0.86 },
          { x: 0.58, y: 0.86 },
          { x: 0.56, y: 0.5 },
          { x: 0.44, y: 0.5 },
        ]),
        stroke(2, '#78350f', 0, [{ x: 0.5, y: 0.7 }], 'fill'),
        // Foliage clouds
        stroke(3, '#22c55e', 9, circlePoints(0.5, 0.34, 0.18)),
        stroke(4, '#22c55e', 9, circlePoints(0.36, 0.42, 0.14)),
        stroke(5, '#22c55e', 9, circlePoints(0.64, 0.42, 0.14)),
        stroke(6, '#22c55e', 0, [{ x: 0.5, y: 0.35 }], 'fill'),
        // Apples on tree
        stroke(7, '#ef4444', 8, circlePoints(0.42, 0.32, 0.025)),
        stroke(8, '#ef4444', 8, circlePoints(0.58, 0.35, 0.025)),
        stroke(9, '#ef4444', 8, circlePoints(0.48, 0.44, 0.025)),
      ];

    case 'STAR':
      return [
        stroke(1, '#eab308', 8, [
          { x: 0.5, y: 0.18 },
          { x: 0.59, y: 0.38 },
          { x: 0.82, y: 0.4 },
          { x: 0.65, y: 0.55 },
          { x: 0.71, y: 0.78 },
          { x: 0.5, y: 0.65 },
          { x: 0.29, y: 0.78 },
          { x: 0.35, y: 0.55 },
          { x: 0.18, y: 0.4 },
          { x: 0.41, y: 0.38 },
          { x: 0.5, y: 0.18 },
        ]),
        stroke(2, '#eab308', 0, [{ x: 0.5, y: 0.5 }], 'fill'),
        stroke(3, '#000000', 6, circlePoints(0.44, 0.48, 0.02)),
        stroke(4, '#000000', 6, circlePoints(0.56, 0.48, 0.02)),
        stroke(5, '#000000', 6, [
          { x: 0.45, y: 0.54 },
          { x: 0.5, y: 0.58 },
          { x: 0.55, y: 0.54 },
        ]),
      ];

    case 'APPLE':
      return [
        // Apple body
        stroke(1, '#ef4444', 10, [
          { x: 0.5, y: 0.32 },
          { x: 0.68, y: 0.34 },
          { x: 0.75, y: 0.55 },
          { x: 0.65, y: 0.78 },
          { x: 0.5, y: 0.75 },
          { x: 0.35, y: 0.78 },
          { x: 0.25, y: 0.55 },
          { x: 0.32, y: 0.34 },
          { x: 0.5, y: 0.32 },
        ]),
        stroke(2, '#ef4444', 0, [{ x: 0.5, y: 0.55 }], 'fill'),
        // Stem
        stroke(3, '#78350f', 8, [
          { x: 0.5, y: 0.32 },
          { x: 0.52, y: 0.2 },
        ]),
        // Green leaf
        stroke(4, '#22c55e', 7, [
          { x: 0.52, y: 0.24 },
          { x: 0.65, y: 0.22 },
          { x: 0.56, y: 0.3 },
          { x: 0.52, y: 0.24 },
        ]),
        stroke(5, '#22c55e', 0, [{ x: 0.57, y: 0.25 }], 'fill'),
      ];

    case 'FISH':
      return [
        // Fish body
        stroke(1, '#3b82f6', 9, [
          { x: 0.22, y: 0.5 },
          { x: 0.48, y: 0.32 },
          { x: 0.72, y: 0.5 },
          { x: 0.48, y: 0.68 },
          { x: 0.22, y: 0.5 },
        ]),
        // Tail
        stroke(2, '#3b82f6', 9, [
          { x: 0.72, y: 0.5 },
          { x: 0.86, y: 0.36 },
          { x: 0.82, y: 0.5 },
          { x: 0.86, y: 0.64 },
          { x: 0.72, y: 0.5 },
        ]),
        // Fill blue
        stroke(3, '#3b82f6', 0, [{ x: 0.5, y: 0.5 }], 'fill'),
        // Eye
        stroke(4, '#ffffff', 6, circlePoints(0.32, 0.48, 0.04)),
        stroke(5, '#000000', 6, circlePoints(0.31, 0.48, 0.02)),
        // Fin
        stroke(6, '#f59e0b', 7, [
          { x: 0.48, y: 0.45 },
          { x: 0.56, y: 0.5 },
          { x: 0.48, y: 0.55 },
        ]),
      ];

    case 'FLOWER':
      return [
        // Green stem & leaves
        stroke(1, '#22c55e', 9, [
          { x: 0.5, y: 0.48 },
          { x: 0.5, y: 0.85 },
        ]),
        stroke(2, '#22c55e', 7, [
          { x: 0.5, y: 0.68 },
          { x: 0.64, y: 0.62 },
          { x: 0.5, y: 0.72 },
        ]),
        // Flower petals
        stroke(3, '#ec4899', 8, circlePoints(0.5, 0.28, 0.09)),
        stroke(4, '#ec4899', 8, circlePoints(0.62, 0.36, 0.09)),
        stroke(5, '#ec4899', 8, circlePoints(0.58, 0.5, 0.09)),
        stroke(6, '#ec4899', 8, circlePoints(0.42, 0.5, 0.09)),
        stroke(7, '#ec4899', 8, circlePoints(0.38, 0.36, 0.09)),
        // Center yellow core
        stroke(8, '#eab308', 10, circlePoints(0.5, 0.4, 0.08)),
        stroke(9, '#eab308', 0, [{ x: 0.5, y: 0.4 }], 'fill'),
      ];

    case 'BOAT':
      return [
        // Hull
        stroke(1, '#78350f', 8, [
          { x: 0.18, y: 0.65 },
          { x: 0.82, y: 0.65 },
          { x: 0.72, y: 0.8 },
          { x: 0.28, y: 0.8 },
          { x: 0.18, y: 0.65 },
        ]),
        stroke(2, '#78350f', 0, [{ x: 0.5, y: 0.72 }], 'fill'),
        // Mast
        stroke(3, '#000000', 8, [
          { x: 0.5, y: 0.65 },
          { x: 0.5, y: 0.2 },
        ]),
        // Sail
        stroke(4, '#ffffff', 8, [
          { x: 0.5, y: 0.24 },
          { x: 0.76, y: 0.58 },
          { x: 0.5, y: 0.58 },
          { x: 0.5, y: 0.24 },
        ]),
        stroke(5, '#ef4444', 0, [{ x: 0.55, y: 0.45 }], 'fill'),
        // Water waves
        stroke(6, '#3b82f6', 6, [
          { x: 0.1, y: 0.83 },
          { x: 0.3, y: 0.86 },
          { x: 0.5, y: 0.83 },
          { x: 0.7, y: 0.86 },
          { x: 0.9, y: 0.83 },
        ]),
      ];

    default:
      // General fun cartoon face & shape for any other word
      return [
        // Big round head / shape
        stroke(1, '#000000', 8, circlePoints(0.5, 0.48, 0.26)),
        stroke(2, '#fef08a', 0, [{ x: 0.5, y: 0.48 }], 'fill'),
        // Left eye
        stroke(3, '#000000', 8, circlePoints(0.4, 0.44, 0.04)),
        // Right eye
        stroke(4, '#000000', 8, circlePoints(0.6, 0.44, 0.04)),
        // Big happy mouth
        stroke(5, '#ef4444', 7, [
          { x: 0.38, y: 0.56 },
          { x: 0.5, y: 0.68 },
          { x: 0.62, y: 0.56 },
          { x: 0.38, y: 0.56 },
        ]),
        // Sparkle 1
        stroke(6, '#eab308', 6, [
          { x: 0.2, y: 0.2 },
          { x: 0.24, y: 0.2 },
          { x: 0.22, y: 0.18 },
          { x: 0.22, y: 0.22 },
        ]),
        // Sparkle 2
        stroke(7, '#06b6d4', 6, [
          { x: 0.8, y: 0.25 },
          { x: 0.84, y: 0.25 },
          { x: 0.82, y: 0.23 },
          { x: 0.82, y: 0.27 },
        ]),
      ];
  }
}
