import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

// Function to generate a crisp app icon PNG of size NxN
function generateIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });

  const cx = size / 2;
  const cy = size / 2;
  const padding = isMaskable ? size * 0.15 : size * 0.05;
  const borderRadius = isMaskable ? 0 : size * 0.22; // rounded square for standard icons

  // Colors
  // Background: Rich Indigo to Blue gradient
  // Emblem: Golden / White Academic Mortarboard Graduation Cap + Star/Sparkle

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Check rounded corner background (for standard icon)
      let inBackground = true;
      if (!isMaskable) {
        // Distance to rounded corners
        const dx = Math.max(0, Math.abs(x - cx) - (cx - borderRadius));
        const dy = Math.max(0, Math.abs(y - cy) - (cy - borderRadius));
        if (dx * dx + dy * dy > borderRadius * borderRadius) {
          inBackground = false;
        }
      }

      if (!inBackground) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0; // Transparent
        continue;
      }

      // Vertical gradient from Indigo (#4F46E5) to Deep Indigo/Blue (#1E1B4B)
      const t = y / size;
      const rBg = Math.round(79 * (1 - t) + 30 * t);
      const gBg = Math.round(70 * (1 - t) + 27 * t);
      const bBg = Math.round(229 * (1 - t) + 160 * t);

      let r = rBg;
      let g = gBg;
      let b = bBg;
      let a = 255;

      // Draw Academic Graduation Cap in center
      // Center coordinates normalized (-1 to 1) within inner content box
      const innerRadius = (size / 2) - padding;
      const nx = (x - cx) / innerRadius;
      const ny = (y - cy) / innerRadius;

      // 1. Graduation Cap Diamond Top:
      // Equation for diamond: |nx / 0.75| + |(ny + 0.15) / 0.35| <= 1
      const capTopDiamond = Math.abs(nx / 0.8) + Math.abs((ny + 0.15) / 0.32);
      // Cap base oval / skull cap
      const capBaseOval = Math.pow(nx / 0.45, 2) + Math.pow((ny - 0.15) / 0.2, 2);

      // Tassel line
      const isTasselLine = (nx >= 0.45 && nx <= 0.52 && ny >= -0.15 && ny <= 0.25);
      const isTasselBall = Math.pow((nx - 0.5) / 0.08, 2) + Math.pow((ny - 0.28) / 0.08, 2) <= 1;

      // Sparkle / Golden Star on upper right
      const starDist = Math.pow((nx - 0.48) / 0.15, 2) + Math.pow((ny + 0.45) / 0.15, 2);

      if (capTopDiamond <= 1) {
        // Pure White / Golden gradient cap top
        r = 255; g = 255; b = 255;
      } else if (capTopDiamond <= 1.08) {
        // Gold Border for cap top
        r = 245; g = 158; b = 11; // Amber Gold
      } else if (capBaseOval <= 1 && ny >= -0.1) {
        // Cap Skull Base
        r = 224; g = 231; b = 255; // Soft lavender white
      } else if (isTasselLine || isTasselBall || starDist <= 1) {
        // Gold Tassel & Star
        r = 251; g = 191; b = 36; // Warm Amber Gold
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return png;
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

sizes.forEach(size => {
  const icon = generateIcon(size, false);
  const buffer = PNG.sync.write(icon);
  
  fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.png`), buffer);
  fs.writeFileSync(path.join(publicDir, `pwa-${size}x${size}.png`), buffer);
  
  if (size === 180) {
    fs.writeFileSync(path.join(publicDir, `apple-touch-icon.png`), buffer);
  }
  if (size === 192) {
    fs.writeFileSync(path.join(publicDir, `favicon.png`), buffer);
  }
});

// Generate Maskable 512x512
const maskableIcon = generateIcon(512, true);
const maskableBuffer = PNG.sync.write(maskableIcon);
fs.writeFileSync(path.join(publicDir, `icon-maskable-512x512.png`), maskableBuffer);
fs.writeFileSync(path.join(publicDir, `pwa-maskable-512x512.png`), maskableBuffer);

console.log('All PWA icons generated successfully!');
