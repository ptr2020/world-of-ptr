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

export function vectorRotate(vec: Vector2, theta: number): Vector2{
    // Courtesy of: https://github.com/photonstorm/phaser/blob/fbceacf387fb5929b69da27afb992f92d00f8ae5/src/math/Vector2.js#L688
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    return {x: cos * vec.x - sin * vec.y, y: sin * vec.x + cos * vec.y};
}

export function vectorAngle(vec: Vector2): number{
    // Courtesy of: https://github.com/photonstorm/phaser/blob/v3.22.0/src/math/Vector2.js#L207
    var angle = Math.atan2(vec.y, vec.x);
        if (angle < 0)
        {
            angle += 2 * Math.PI;
        }
        return angle;
}
