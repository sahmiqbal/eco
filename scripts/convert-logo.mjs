import sharp from 'sharp'
import fs from 'fs'

const input = './public/images/logo.png'
const output = './public/images/logo.png'

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input)
  process.exit(1)
}

async function convert() {
  try {
    await sharp(input)
      .webp({ quality: 90 })
      .toFile(output)
    console.log('Converted', input, '→', output)
  } catch (err) {
    console.error('Conversion failed:', err)
    process.exit(2)
  }
}

convert()
