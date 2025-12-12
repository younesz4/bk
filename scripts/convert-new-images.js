const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'tall1.jpg',
  'box.jpg',
  'tall2.jpg',
  'box2.jpg',
  'tall3.jpg',
  'box3.jpg',
  'tall4.jpg',
  'box4.jpg',
  'tall6.jpg',
  'box6.jpg',
];

const publicDir = path.join(__dirname, '..', 'public');

async function convertImages() {
  console.log('🚀 Converting new images to WebP (maximum quality)...\n');
  
  let converted = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const img of images) {
    const inputPath = path.join(publicDir, img);
    const outputPath = path.join(publicDir, img.replace('.jpg', '.webp'));
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  File not found: ${img}`);
      skipped++;
      continue;
    }
    
    // Check if WebP already exists and is newer
    if (fs.existsSync(outputPath)) {
      const sourceStats = fs.statSync(inputPath);
      const webpStats = fs.statSync(outputPath);
      if (webpStats.mtime >= sourceStats.mtime) {
        console.log(`✓  WebP already exists and is up to date: ${img.replace('.jpg', '.webp')}`);
        skipped++;
        continue;
      }
    }
    
    try {
      console.log(`🔄 Converting ${img} → ${img.replace('.jpg', '.webp')}...`);
      
      await sharp(inputPath)
        .webp({ 
          quality: 100, // Maximum quality
          effort: 6, // Maximum compression effort
        })
        .toFile(outputPath);
      
      console.log(`✅ Converted: ${img.replace('.jpg', '.webp')}`);
      converted++;
    } catch (error) {
      console.error(`❌ Error converting ${img}:`, error.message);
      errors++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('\n✨ Conversion complete!');
}

convertImages().catch(console.error);









