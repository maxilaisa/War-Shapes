# SHAPE ARENA

A physics-based fighting game with combo mechanics, featuring 6 unique shapes with balanced gameplay.

## Features

- **Physics-Based Combat**: Knockback depends on movement speed, angle of impact, momentum, and wall interaction
- **Combo System**: 4 combo tiers (Light Chain, Momentum Chain, Impact Chain, Overdrive Chain)
- **Ultimate Bar**: Hit-based charging system (10 hits = ultimate ready)
- **6 Balanced Shapes**: Each shape has 2 counters, 2 weaknesses, and 1 neutral matchup
- **Counter Hit System**: Bonus damage and ultimate charge for hitting dodging opponents
- **Wall Bounce Mechanics**: Enhanced combos using wall interactions

## Game Rules

- All shapes start with 100 HP (standardized for fairness)
- Only physical contact deals damage; ranged attacks only affect movement
- Win by reducing opponent HP to 0 or knocking them out of bounds
- Combos must be extended within 2.5 seconds

## Project Structure

```
War-Shapes/
├── server.js              # Express server with API routes
├── frontend/
│   ├── index.html         # Main HTML file
│   ├── style.css          # Styling
│   └── js/
│       ├── config.js      # Configuration constants
│       ├── shapes.js      # Shape definitions
│       ├── physics.js     # Physics engine
│       ├── ability.js     # Ability system
│       ├── fighter.js     # Fighter class
│       ├── game.js        # Game class
│       ├── input.js       # Input handler
│       └── main.js        # Initialization
├── package.json
└── README.md
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Online Multiplayer

The game now supports real-time online multiplayer using Socket.io:

- **Lobby System**: Enter your name and select your shape to find a match
- **Matchmaking**: Automatically pairs waiting players
- **Real-time Sync**: Movement and combat state synchronized across clients
- **Room-based**: Each game is isolated in its own room

**To Play Online:**
1. Open the game in your browser
2. Enter your name in the lobby
3. Select your shape from the dropdown
4. Click "Find Match"
5. Wait for an opponent to join
6. Battle in real-time!

**Note**: On Render's free tier, the server may spin down after 15 minutes of inactivity. Use an uptime service to keep it alive for multiplayer.

## Controls

### Player 1 (WASD)
- W/S - Move Up/Down
- A/D - Move Left/Right
- Q - Light Ability
- E - Medium Ability
- R - Heavy Ability
- F - Activate Ultimate
- Space - Dodge

### Player 2 (Arrow Keys)
- Arrow Keys - Movement
- / - Light Ability
- . - Medium Ability
- ' - Heavy Ability
- Enter - Activate Ultimate
- Shift - Dodge

## API Endpoints

- `GET /api/health` - Server health check
- `POST /api/games` - Create a new game
- `GET /api/games/:gameId` - Get game state
- `PUT /api/games/:gameId` - Update game state
- `DELETE /api/games/:gameId` - Delete game
- `GET /api/games` - Get all active games
- `POST /api/stats` - Update player stats
- `GET /api/stats/:playerId` - Get player stats

## Deployment on Render

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Deploy!

The server will automatically start and serve the frontend at your Render URL.

## Shapes

### 2D Shapes (Base Forms - 16 total)

- **Circle (Momentum Fighter)**: Rolling Momentum Control
  - Ability: Rolling Charge (build speed, ram damage)
  - Counters: Triangle, Parallelogram
  - Weaknesses: Star, Heart

- **Oval (Speed Skater)**: Acceleration Control
  - Ability: Fast Dash Chains
  - Counters: Square, Hexagon
  - Weaknesses: Triangle, Rectangle

- **Ellipse (Curve Fighter)**: Curved Trajectory Control
  - Ability: Orbit Dash
  - Counters: Triangle, Rectangle
  - Weaknesses: Square, Star

- **Triangle (Assassin)**: Precision Impact Damage
  - Ability: Piercing Dash (high burst damage)
  - Counters: Square, Oval
  - Weaknesses: Circle, Star

- **Square (Tank Brawler)**: Stability & Knockback Resistance
  - Ability: Heavy Slam
  - Counters: Spiral, Oval
  - Weaknesses: Triangle, Circle

- **Rectangle (Linear Striker)**: Straight-Line Force
  - Ability: Charge Rush
  - Counters: Spiral, Parallelogram
  - Weaknesses: Ellipse, Kite

- **Parallelogram (Evasive Fighter)**: Angle Evasion
  - Ability: Slip Dodge Counter
  - Counters: Triangle, Hexagon
  - Weaknesses: Circle, Rectangle

- **Rhombus (Counter Specialist)**: Reflection Timing
  - Ability: Reflect Strike
  - Counters: Square, Star
  - Weaknesses: Heart, Triangle

- **Trapezoid (Unstable Fighter)**: Unpredictable Movement
  - Ability: Random Angle Bounce
  - Counters: Circle, Diamond
  - Weaknesses: Square, Pentagon

- **Kite (Air Mobility Fighter)**: Air Control
  - Ability: Glide Dash
  - Counters: Square, Rectangle
  - Weaknesses: Hexagon, Triangle

- **Pentagon (Balanced Fighter)**: Adaptive Balance
  - Ability: Mixed Combo Strike
  - Counters: None (all neutral matchups)
  - Weaknesses: None

- **Hexagon (Defense Controller)**: Multi-Angle Defense
  - Ability: Shield Pulse
  - Counters: Spiral, Triangle
  - Weaknesses: Oval, Parallelogram

- **Star (Burst Aggressor)**: Spike Impact Damage
  - Ability: Star Impact
  - Counters: Rhombus, Square
  - Weaknesses: Square, Spiral

- **Heart (Sustain Fighter)**: Recovery & Survival
  - Ability: Heal Pulse (self-regeneration)
  - Counters: Triangle, Rhombus
  - Weaknesses: Star, Square

- **Crescent (Trick Fighter)**: Curved Attack Flow
  - Ability: Moon Slash
  - Counters: Square, Hexagon
  - Weaknesses: Triangle, Diamond

- **Diamond (Precision Fighter)**: Critical Angle Hits
  - Ability: Prism Strike
  - Counters: Spiral, Oval
  - Weaknesses: Trapezoid, Crescent

- **Spiral (Vortex Chain)**: Movement Loop Control
  - Ability: Vortex Dash
  - Counters: Circle, Star
  - Weaknesses: Triangle, Heart

### 3D Shapes (Evolved Forms - 8 total)

Same identity as 2D forms with enhanced control + stability.

- **Sphere (Evolved Circle)**: Enhanced Momentum
- **Cube (Evolved Square)**: Enhanced Stability
- **Cone (Evolved Triangle)**: Enhanced Precision
- **Cylinder (Evolved Rectangle)**: Enhanced Linear Force
- **Torus (Evolved Spiral)**: Enhanced Loop Control
- **Capsule (Evolved Heart)**: Enhanced Recovery
- **Icosahedron (Evolved Diamond)**: Ultimate Precision
- **Dodecahedron (Evolved Hexagon)**: Ultimate Defense

## License

MIT
