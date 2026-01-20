const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon template
function generateSVG(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#8B4513" rx="${size * 0.15}"/>

  <!-- Cake layers -->
  <g transform="translate(${size * 0.2}, ${size * 0.35})">
    <!-- Bottom layer -->
    <ellipse cx="${size * 0.3}" cy="${size * 0.35}" rx="${size * 0.25}" ry="${size * 0.06}" fill="#F4A460"/>
    <rect x="${size * 0.05}" y="${size * 0.25}" width="${size * 0.5}" height="${size * 0.1}" fill="#DEB887"/>

    <!-- Middle layer -->
    <ellipse cx="${size * 0.3}" cy="${size * 0.25}" rx="${size * 0.22}" ry="${size * 0.05}" fill="#F4A460"/>
    <rect x="${size * 0.08}" y="${size * 0.15}" width="${size * 0.44}" height="${size * 0.1}" fill="#DEB887"/>

    <!-- Top layer -->
    <ellipse cx="${size * 0.3}" cy="${size * 0.15}" rx="${size * 0.19}" ry="${size * 0.04}" fill="#F4A460"/>
    <rect x="${size * 0.11}" y="${size * 0.05}" width="${size * 0.38}" height="${size * 0.1}" fill="#DEB887"/>

    <!-- Cherry on top -->
    <circle cx="${size * 0.3}" cy="${size * 0.02}" r="${size * 0.03}" fill="#DC143C"/>
    <line x1="${size * 0.3}" y1="${size * 0.02}" x2="${size * 0.3}" y2="${size * 0.05}" stroke="#654321" stroke-width="${size * 0.005}"/>
  </g>

  <!-- Text -->
  <text x="${size * 0.5}" y="${size * 0.85}" font-family="Arial, sans-serif" font-size="${size * 0.12}" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MrCake</text>
</svg>`;
}

// Generate icons for all sizes
sizes.forEach(size => {
    const svg = generateSVG(size);
    const filename = `icon-${size}x${size}.png`;
    const svgFilename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, svgFilename);

    fs.writeFileSync(filepath, svg);
    console.log(`Generated ${svgFilename}`);
});

console.log('\nIcon generation complete!');
console.log('\nNote: SVG files have been generated. For production, you should:');
console.log('1. Convert SVG files to PNG using a tool like svg2png or online converters');
console.log('2. Or design custom high-quality icons using a design tool like Figma');
console.log('3. Ensure all sizes are optimized for web use');
