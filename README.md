# Neon Drift

A browser-native Three.js car racer built for Muhammad Hanan Raza's portfolio.

## Run locally

Install Node.js 20 or newer. Open this folder in VS Code or Antigravity, then:

```sh
npm install
npm run dev
```

Open http://localhost:3000. No API keys or external assets are needed.

## Deploy on Vercel

Push this folder to a GitHub repository and import it into Vercel.

- Framework preset: Other
- Build command: `npm run build`
- Output directory: `dist`

The included `vercel.json` supplies these settings. Vercel runs the source checks and serves the static game. You can also deploy using the Vercel CLI from this folder.

## Features

Three procedural 3D circuits, three original wheeled car models with distinct handling, three paint colors, three-lap races against three AI rivals, time trials, saved personal records, a replay ghost, drift scoring, boost energy, speed-responsive camera, three camera angles, procedural engine audio, minimap, pause/resume/restart and performance settings. Keyboard, simultaneous multi-touch buttons, mobile steering joystick and standard gamepad mappings are supported. GSAP animates the garage entrance. Physics runs at a fixed 120 Hz independent of rendering; city buildings are instanced.

Steering sensitivity (0.50×–2.00×) and audio volume are adjustable in the garage or pause menu and saved in this browser. Sensitivity scales keyboard, touch and gamepad steering. Steering response, acceleration and handbrake rotation are tuned for tight arcade corners. Layered engine tones and tire noise run through a master volume control and compressor. Click SOUND ON to enable audio.

Driving uses world-space position, heading and grip. You steer every corner; the road never rotates the player car. AI opponents follow their own paths. All three cars have modeled wheels, rims, headlights, brake lights, cabins and distinct silhouettes. They are original procedural designs, not manufacturer replicas or photorealistic licensed models.

Clean laps earn 1,000 points each; a three-lap perfect run adds 3,000. Crashes cost 10 points and speed, with impact flashes, camera shake and crash counts. Drifting earns 1× score (+10 drift points = +10 score) and boost energy. Each ordered checkpoint awards +100 score. Car collisions slow both drivers and push both vehicles apart, with gradual opponent recovery. T or RECOVER puts the car back on the circuit with a 500-point penalty and invalidates that lap's clean bonus. Eighteen ordered checkpoint gates validate the three-lap race. Records and world-space ghosts are saved separately per circuit and car in local storage. Older automatic-track records are retained but are not used by this driving version. There are no accounts or online leaderboards.

## Controls

| Action | PC | Mobile | Standard gamepad |
| --- | --- | --- | --- |
| Accelerate | W / Up arrow | Hold GO | RT |
| Brake | S / Down arrow | Hold BRAKE | LT |
| Steer | A/D / Left/right arrows | Left joystick | Left stick |
| Drift | Space | Hold DRIFT while steering | A |
| Boost | Either Shift / X | Hold BOOST | B |
| Pause/resume | P / Escape | Pause button / Resume | Start |
| Recover car | T | RECOVER / Pause menu | Use menu |
| Restart | R | Pause → Restart | Use menu |
| Camera | C | Pause → Change camera | Use menu |
| Audio | M | Sound button | Use menu |
| Fullscreen | F | Fullscreen button where supported | Use menu |

Hold acceleration and combine it with drift or boost. Touch controls accept multiple simultaneous pointers and release cleanly when fingers leave or are cancelled. The game pauses when the tab becomes hidden or loses focus. Gamepad and fullscreen support depend on browser permissions. Audio starts only after a user gesture.

## Mobile controls and custom layout

On a phone, choose LEFT / RIGHT BUTTONS or JOYSTICK in the garage. Accelerator, brake, drift and boost support simultaneous fingers. Turn the phone to landscape for the larger racing layout. The game prompts before starting in portrait and pauses if rotated back during a race. Fullscreen/orientation lock is attempted only after tapping the fullscreen button; manually rotate the phone when the browser cannot lock orientation. Portrait remains available through CONTINUE IN PORTRAIT.

Tap CUSTOMIZE CONTROLS in the garage or EDIT HUD during a race. Drag the steering controls, accelerator, brake, drift, boost, pause and recover anywhere within the screen. Adjust the size slider, switch steering style, and SAVE. CANCEL restores the previous layout; RESET restores the current orientation defaults. Portrait and landscape positions save separately in this browser. Editing pauses gameplay and does not send driving inputs. Keyboard and gamepad controls retain their existing mappings.

## Verification

`npm run check` verifies syntax, required assets, acceleration, braking, boost energy, drift scoring, manual left/right heading, collision boundaries and time formatting. A headless integration harness uses real Three.js geometry with a mock GPU renderer to check circuit construction, keyboard and touch events, countdowns, pause/resume, restart, race finish, result storage, ghost loading and garage selections.

Real GPU rendering, physical mobile controls and actual frame rates have not been browser-tested in the authoring environment. Start on LOW quality on an Intel HD 630; use AUTO on modern devices. Mobile landscape offers the most room for controls, while portrait is supported.

## Source layout

- `dist/index.html`: menus, race HUD, controls and dialog shell
- `dist/style.css`: responsive styling and mobile controls
- `dist/game.js`: procedural scene, manual driving, camera, opponents, input, race states and audio
- `dist/physics.js`: world-space manual steering, grip, drift and scoring
- `dist/cars.js`: procedural vehicle geometry
- `dist/mobile.js`: mobile controls, HUD editor, saved layout and rotation handling
- `dist/vendor`: locally bundled Three.js r170 and GSAP
- `scripts`: static server and behavioral checks

All track geometry, car models and effects are created in code. There are no external CDN, font or image requests at runtime.
