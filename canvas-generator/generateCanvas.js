const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const TILE_SIZE = 10; // Scale factor for better visibility
const CANVAS_DIMENSION = 25; // 25x25 pixels
const OUTPUT_DIR = path.join(__dirname, '..', 'images');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'canvas.png');
const TILES_ENDPOINT = 'https://gabe-place.onrender.com/get_tiles'; // Replace with your actual server URL

async function fetchTiles() {
  try {
    const response = await axios.get(TILES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching tiles:', error.message);
    throw error;
  }
}

function generateImage(tiles) {
  const canvas = createCanvas(CANVAS_DIMENSION * TILE_SIZE, CANVAS_DIMENSION * TILE_SIZE);
  const ctx = canvas.getContext('2d');

  // Initialize canvas with a default color (e.g., white)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  tiles.forEach(tile => {
    ctx.fillStyle = tile.color;
    ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });

  return canvas.toBuffer('image/png');
}

async function main() {
  try {
    const tiles = await fetchTiles();
    const imageBuffer = generateImage(tiles);

    // Ensure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFileSync(OUTPUT_FILE, imageBuffer);
    console.log('Canvas image generated successfully.');
  } catch (error) {
    console.error('Failed to generate canvas image:', error.message);
    process.exit(1);
  }
}

main();
