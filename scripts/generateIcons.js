const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ICON_SVG = path.join(ROOT, 'icons', 'app-icon.svg');

// iOS AppIcon 사이즈
const IOS_SIZES = [
    { size: 20, scale: 1 }, { size: 20, scale: 2 }, { size: 20, scale: 3 },
    { size: 29, scale: 1 }, { size: 29, scale: 2 }, { size: 29, scale: 3 },
    { size: 40, scale: 1 }, { size: 40, scale: 2 }, { size: 40, scale: 3 },
    { size: 60, scale: 2 }, { size: 60, scale: 3 },
    { size: 76, scale: 1 }, { size: 76, scale: 2 },
    { size: 83.5, scale: 2 },
    { size: 1024, scale: 1 },
];

// Android mipmap 사이즈
const ANDROID_SIZES = [
    { name: 'mipmap-mdpi',    size: 48  },
    { name: 'mipmap-hdpi',    size: 72  },
    { name: 'mipmap-xhdpi',   size: 96  },
    { name: 'mipmap-xxhdpi',  size: 144 },
    { name: 'mipmap-xxxhdpi', size: 192 },
];

const IOS_APPICONSET = path.join(ROOT, 'ios/sudokuLab/Images.xcassets/AppIcon.appiconset');

async function generate() {
    const svgBuffer = fs.readFileSync(ICON_SVG);

    // iOS
    const contentsImages = [];
    for (const { size, scale } of IOS_SIZES) {
        const px = Math.round(size * scale);
        const filename = `icon-${size}@${scale}x.png`;
        await sharp(svgBuffer).resize(px, px).png().toFile(path.join(IOS_APPICONSET, filename));
        contentsImages.push({
            filename,
            idiom: size === 76 || size === 83.5 ? 'ipad' : size === 1024 ? 'ios-marketing' : 'iphone',
            scale: `${scale}x`,
            size: `${size}x${size}`,
        });
        console.log(`✅ iOS ${filename} (${px}x${px})`);
    }

    // Contents.json 업데이트
    const contents = { images: contentsImages, info: { author: 'xcode', version: 1 } };
    fs.writeFileSync(path.join(IOS_APPICONSET, 'Contents.json'), JSON.stringify(contents, null, 2));
    console.log('✅ Contents.json 업데이트');

    // Android
    for (const { name, size } of ANDROID_SIZES) {
        const dir = path.join(ROOT, 'android/app/src/main/res', name);
        await sharp(svgBuffer).resize(size, size).png().toFile(path.join(dir, 'ic_launcher.png'));
        await sharp(svgBuffer).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_round.png'));
        console.log(`✅ Android ${name} (${size}x${size})`);
    }

    console.log('\n🎉 아이콘 생성 완료!');
}

generate().catch(console.error);
