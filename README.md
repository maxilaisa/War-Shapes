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
   - **Start Command**: `node backend/server.js`
5. Deploy!

The server will automatically start and serve the frontend at your Render URL.

## Shapes

- **Circle (Rolling Loop)**: Wall bounce farming combos
  - Counters: Triangle, Square
  - Weaknesses: Star, Heart

- **Triangle (Edge Cut)**: Dash + angle + wall + re-hit chains
  - Counters: Square, Spiral
  - Weaknesses: Circle, Star

- **Square (Ground Lock)**: Trap between wall and body
  - Counters: Star, Heart
  - Weaknesses: Triangle, Circle

- **Spiral (Vortex Chain)**: Movement loop control combos
  - Counters: Circle, Star
  - Weaknesses: Triangle, Heart

- **Star (Burst Link)**: Fast multi-hit spike combos
  - Counters: Heart, Triangle
  - Weaknesses: Square, Spiral

- **Heart (Survival Chain)**: Defensive counter-based combos
  - Counters: Spiral, Circle
  - Weaknesses: Star, Square

## License

MIT
