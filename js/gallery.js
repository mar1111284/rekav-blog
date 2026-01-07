// js/gallery.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gallery-grid');

    // Chill, neutral captions
    const captions = [
        'Quiet morning light',
        'City skyline at dusk',
        'Coffee and code',
        'Rain on the window',
        'Old book pages',
        'Minimal desk setup',
        'Forest path',
        'Neon lights reflection',
        'Terminal glow',
        'Evening walk',
        'Abstract shapes',
        'Black and white street',
        'Sunset over water',
        'Keyboard close-up',
        'Cozy room corner',
        'Train window view',
        'Plant on shelf',
        'Night drive',
        'Handwritten notes',
        'Soft shadows'
    ];

    // Keywords for variety (all calm/neutral themes)
    const keywords = [
        'nature', 'city', 'landscape', 'abstract', 'minimal',
        'coffee', 'rain', 'window', 'book', 'desk',
        'forest', 'neon', 'terminal', 'sunset', 'keyboard',
        'room', 'train', 'plant', 'night', 'street'
    ];

    const imageCount = 16; // Nice number for chaotic packing

    for (let i = 0; i < imageCount; i++) {
        // Random keyword for themed variety
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];

        // Better size range for visible impact
        const width = 600 + Math.floor(Math.random() * 600);  // 900-1500
        const height = 250 + Math.floor(Math.random() * 800); // 600-1400

        // More chance of larger items
        const sizes = ['normal', 'normal', 'wide', 'tall', 'big', 'wide'];
        const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];

        // Random caption
        const caption = captions[Math.floor(Math.random() * captions.length)];

        const item = document.createElement('div');
        item.className = `gallery-item ${sizeClass}`;

        // LoremFlickr URL format: https://loremflickr.com/{width}/{height}/{keyword}
        const imgUrl = `https://loremflickr.com/${width}/${height}/${keyword}`;

        item.innerHTML = `
            <img src="${imgUrl}" alt="${caption}" loading="lazy">
            <div class="gallery-caption">${caption}</div>
        `;

        grid.appendChild(item);
    }
});
