const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="400" fill="#F5F5F5"/>

  <!-- Icon -->
  <g transform="translate(200, 200)">
    <!-- Image icon -->
    <rect x="-60" y="-60" width="120" height="120" fill="#D1D5DB" rx="8"/>
    <circle cx="-25" cy="-25" r="15" fill="#9CA3AF"/>
    <path d="M -60 20 L -20 -20 L 20 20 L 60 -20 L 60 60 L -60 60 Z" fill="#9CA3AF"/>
  </g>

  <!-- Text -->
  <text x="200" y="320" font-family="Arial, sans-serif" font-size="18" fill="#9CA3AF" text-anchor="middle">No Image Available</text>
</svg>`;

const placeholderPath = path.join(__dirname, '..', 'public', 'placeholder.png');

async function createPlaceholder() {
    try {
        await sharp(Buffer.from(svg))
            .resize(400, 400)
            .png()
            .toFile(placeholderPath);

        console.log('✓ Placeholder image created successfully at public/placeholder.png');
    } catch (error) {
        console.error('✗ Error creating placeholder:', error);
    }
}

createPlaceholder();
