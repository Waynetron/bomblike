export const [UP, DOWN, LEFT, RIGHT] = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]
export const add = (a, b) => ({x: a.x + b.x, y: a.y + b.y});
export const subtract = (a, b) => ({x: a.x - b.x, y: a.y - b.y});