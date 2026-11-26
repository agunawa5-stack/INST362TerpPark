
const CURVE_SEGMENTS = 10;

// calculate a point along a quadratic Bezier curve
function bezierPoint(start, control, end, t) {
    const a = (1 - t) ** 2;
    const b = 2 * (1 - t) * t;
    const c = t ** 2;

    return [
        Number((
            a * start[0] +
            b * control[0] +
            c * end[0]
        ).toFixed(6)),

        Number((
            a * start[1] +
            b * control[1] +
            c * end[1]
        ).toFixed(6)),
    ];
}

// calculate the midpoint between two corners
export function getEdgeMidpoint(start, end) {
    return [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
    ];
}

// generate polygon coordinates, including curved edges
export function getCurvedPolygon(points, curveControls = {}) {
    if (points.length < 3) {
        return points;
    }

    const result = [];

    for (let i = 0; i < points.length; i++) {
        const start = points[i];
        const end = points[(i + 1) % points.length];
        const control = curveControls[i];

        result.push(start);

        // if this edge has a curve handle,
        // generate intermediate points
        if (control) {
            for (let step = 1; step < CURVE_SEGMENTS; step++) {
                result.push(
                    bezierPoint(
                        start,
                        control,
                        end,
                        step / CURVE_SEGMENTS
                    )
                );
            }
        }
    }

    return result;
}
