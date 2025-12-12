const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images used in project detail pages from lib/data.ts
const projectImages = [
  '/key.webp',
  '/le keyage2.webp',
  '/le keyage3.webp',
  '/le keyage4.webp',
  '/atlantic.webp',
  '/hotel atlantic2.webp',
  '/hotel atlantic3.webp',
  '/hotel atlantic4.webp',
  '/nom1.webp',
  '/nomai2.webp',
  '/nom2.webp',
  '/nomai4.webp',
  '/raff.webp',
  '/raffinity2.webp',
  '/raffinity3.webp',
  '/vi.webp',
  '/visa2.webp',
  '/hero0.webp',
  '/projet2.webp',
  '/projet3.webp',
  '/projet4.webp',
];

// Map of WebP references to potential source files
const sourceImageMap = {
  '/nomai2.webp': '/nomai2.png',
  '/nomai4.webp': '/nomai4.png',
  '/raffinity2.webp': '/raffinity2.png',
  '/raffinity3.webp': '/raffinity3.png',
  '/visa2.webp': '/visa2.png',
  '/projet2.webp': '/projet2.png',
  '/projet3.webp': '/projet3.png',
  '/projet4.webp': '/projet4.png',
};

const publicDir = path.join(__dirname, '..', 'public');

async function convertToWebP(sourcePath, outputPath) {
  try {
    const fullSourcePath = path.join(publicDir, sourcePath);
    const fullOutputPath = path.join(publicDir, outputPath);
    
    // Check if source file exists
    if (!fs.existsSync(fullSourcePath)) {
      console.log(`⚠️  Source file not found: ${sourcePath}`);
      return false;
    }
    
    // Check if WebP already exists and is newer
    if (fs.existsSync(fullOutputPath)) {
      const sourceStats = fs.statSync(fullSourcePath);
      const webpStats = fs.statSync(fullOutputPath);
      if (webpStats.mtime >= sourceStats.mtime) {
        console.log(`✓  WebP already exists and is up to date: ${outputPath}`);
        return true;
      }
    }
    
    console.log(`🔄 Converting ${sourcePath} → ${outputPath}...`);
    
    await sharp(fullSourcePath)
      .webp({ 
        quality: 100, // Maximum quality
        effort: 6, // Maximum compression effort (0-6)
        lossless: false, // Use lossy compression for smaller files, but at max quality
      })
      .toFile(fullOutputPath);
    
    console.log(`✅ Converted: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${sourcePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting image conversion to WebP (maximum quality)...\n');
  
  let converted = 0;
  let skipped = 0;
  let errors = 0;
  
  // Convert source images to WebP
  for (const [webpPath, sourcePath] of Object.entries(sourceImageMap)) {
    const result = await convertToWebP(sourcePath, webpPath);
    if (result === true) {
      converted++;
    } else if (result === false) {
      errors++;
    } else {
      skipped++;
    }
  }
  
  // Also check for any other PNG/JPG files that might be used
  const allFiles = fs.readdirSync(publicDir);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
  
  for (const file of allFiles) {
    const ext = path.extname(file);
    if (imageExtensions.includes(ext)) {
      const baseName = path.basename(file, ext);
      const webpPath = `/${baseName}.webp`;
      
      // Skip if WebP already exists
      if (fs.existsSync(path.join(publicDir, webpPath))) {
        continue;
      }
      
      // Convert to WebP
      const result = await convertToWebP(file, webpPath);
      if (result === true) {
        converted++;
      } else if (result === false) {
        errors++;
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('\n✨ Conversion complete!');
}

main().catch(console.error);









