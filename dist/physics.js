export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const formatTime = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(3).padStart(6, '0')}`;
export const CAR_SPECS = [
    { name: 'Apex R', type: 'MID-ENGINE SUPERCAR', top: 78, acceleration: 44, grip: 12, steering: 1.65 },
    { name: 'Vandal V8', type: 'REAR-DRIVE MUSCLE', top: 72, acceleration: 48, grip: 10, steering: 1.5 },
    { name: 'Vector GT', type: 'TRACK-READY COUPE', top: 75, acceleration: 41, grip: 14, steering: 1.8 }
];
export function newVehicle(x = 0, z = 0, yaw = 0) { return { x, z, yaw, vx: 0, vz: 0, speed: 0, steering: 0, lateral: 0, lateralVelocity: 0, distance: 0, energy: 100, driftScore: 0, driftChain: 0, driftRunScore: 0, crashes: 0, lapCrashes: 0, cleanLaps: 0, bonus: 0, penalty: 0, crashCooldown: 0, nextCheckpoint: 1 }; }
// World-space bicycle steering. Track geometry never changes the car's heading.
export function stepVehicle(v, input, dt, spec = CAR_SPECS[0]) {
    v.crashCooldown = Math.max(0, v.crashCooldown - dt);
    const boosting = input.boost && v.energy > 1 && v.speed > 8;
    const drifting = input.drift && Math.abs(input.steer) > .12 && v.speed > 9;
    v.speed = clamp(v.speed + ((input.accel ? spec.acceleration * (drifting ? clamp(1 - v.speed / 72, 0, 1) : 1) + (boosting ? 18 : 0) : 0) - (input.brake ? 70 : 0) - (drifting ? 14 : 0) - v.speed * .13 - 2) * dt, 0, spec.top + (boosting ? 19 : 0));
    v.steering += (clamp(input.steer, -1, 1) - v.steering) * Math.min(1, dt * 20);
    // Positive input is right: Three.js forward is -Z, so right turns reduce yaw.
    v.yaw -= v.steering * spec.steering * clamp(input.sensitivity ?? 1, .5, 2) * (v.speed / (8 + v.speed)) / (1 + v.speed * .006) * (drifting ? 1.85 : 1) * dt;
    const fx = -Math.sin(v.yaw), fz = -Math.cos(v.yaw), grip = drifting ? 3.8 : spec.grip;
    const response = 1 - Math.exp(-grip * dt); v.vx += (fx * v.speed - v.vx) * response; v.vz += (fz * v.speed - v.vz) * response;
    v.x += v.vx * dt; v.z += v.vz * dt; v.lateralVelocity = v.vx * Math.cos(v.yaw) - v.vz * Math.sin(v.yaw);
    v.energy = clamp(v.energy + (boosting ? -26 : drifting ? 24 : 9) * dt, 0, 100);
    if (drifting) { v.driftChain += dt; const points = Math.abs(v.lateralVelocity) * dt * 22; v.driftScore += points; v.driftRunScore += points; }
    return { boosting, drifting, collision: false };
}
export function registerCrash(v, impact) {
    if (impact < 3 || v.crashCooldown > 0) return false;
    v.crashes++; v.lapCrashes++; v.penalty += 10; v.crashCooldown = .9; v.driftChain = 0; return true;
}
export function bankLap(v) { const clean = v.lapCrashes === 0; if (clean) { v.cleanLaps++; v.bonus += 1000; } v.lapCrashes = 0; return clean; }
export const totalScore = v => Math.max(0, Math.round(v.driftScore + v.bonus - v.penalty));

// Both vehicles receive equal separation and an impact response; AI recovery is gradual.
export function resolveCarContact(v, r, position, basis) {
    const dx = v.x - position.x, dz = v.z - position.z, d = Math.hypot(dx, dz); if (d >= 2.7) return false;
    const nx = d > .001 ? dx / d : basis.normal.x, nz = d > .001 ? dz / d : basis.normal.z, overlap = 2.7 - d;
    v.x += nx * overlap * .5; v.z += nz * overlap * .5;
    r.lateralOffset = clamp((r.lateralOffset || 0) - (nx * basis.normal.x + nz * basis.normal.z) * overlap * .5, -4, 4);
    r.distance -= (nx * basis.tan.x + nz * basis.tan.z) * overlap * .5;
    if ((r.contactCooldown || 0) > 0) return false;
    r.contactCooldown = 1; r.stun = 1.2;
    const relative = Math.abs(v.speed - r.speed), loss = clamp(.12 + relative * .004, .12, .35);
    v.speed *= 1 - loss; r.speed *= 1 - loss; v.vx *= 1 - loss; v.vz *= 1 - loss;
    return registerCrash(v, relative + 5);
}
