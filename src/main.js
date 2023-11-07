import Bootloader from './Bootloader.js';

const config = {
    title: "Cubo",
    version: "0.0.1",
    type: Phaser.AUTO,
    scale: {
        parent: "phaser_container",
        width: 800,
        height: 600,    
    },
    pixelArt: false,
    scene: [
        Bootloader
    ],
    physics: {default: 'arcade'}
};

new Phaser.Game(config);