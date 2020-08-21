export interface Vector2 {
    x: number;
    y: number;
}

export function vectorAdd(vec1: Vector2, vec2: Vector2): Vector2 {
    return { x: vec1.x + vec2.x, y: vec1.y + vec2.y }
}

export function vectorScale(vec: Vector2, scale: number): Vector2{
    return { x: vec.x * scale, y: vec.y * scale }
}

export function vectorLength(vec: Vector2): number{
    return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
}