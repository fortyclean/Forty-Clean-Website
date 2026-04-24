import { execSync } from 'child_process';
import { existsSync } from 'fs';

const src = 'public/images/forty-clean-logo.png';
const dest = 'public/images/forty-clean-logo.webp';

// Try using sharp if available
try {
  const { default: sharp } = await import('sharp');
  await sharp(src).webp({ quality: 85 }).toFile(dest);
  console.log('✅ Logo converted to WebP using sharp');
} catch {
  // sharp not available — use cwebp if installed
  try {
    execSync(`cwebp -q 85 "${src}" -o "${dest}"`, { stdio: 'pipe' });
    console.log('✅ Logo converted to WebP using cwebp');
  } catch {
    // Neither available — copy circle-logo-111.webp as fallback
    if (existsSync('public/images/circle-logo-111.webp')) {
      const { copyFileSync } = await import('fs');
      copyFileSync('public/images/circle-logo-111.webp', dest);
      console.log('✅ Used circle-logo-111.webp as WebP logo fallback');
    } else {
      console.log('⚠️  No WebP conversion tool available. Logo stays as PNG.');
      console.log('   Install sharp: npm install sharp');
      console.log('   Or convert manually and place at: public/images/forty-clean-logo.webp');
    }
  }
}
