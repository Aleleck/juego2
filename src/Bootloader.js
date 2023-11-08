class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader');
    }

    preload() {
        console.log('Bootloader');
        this.load.setPath('./assets/');
        this.load.image('particle_yellow', 'particula.png');
        this.load.image('cube', 'cubo.png');
        this.load.image('termo', 'termometro.png');
        this.load.image('subir', 'subir.png');
        this.load.image('bajar', 'bajar.png');
        this.load.image('puntero', 'puntero.png');
        this.load.video('fondo', 'fondo.mp4');
        this.load.audio('sonidoC', 'sound.wav');
    }

    create() {
        this.input.setDefaultCursor('url("assets/puntero.png"), pointer');
        this.add.video( 400, 300, 'fondo').setScale(0.43,0.56).play(true);
        
        this.physics.world.setBounds(220, 230, 170, 185); // Establece los límites del mundo
        this.add.image(350, 300, 'cube').setScale(1.5);

        const collisionSound = this.sound.add('sonidoC');
        const barraRoja = this.add.rectangle(700, 350, 10, 0, 0xff0000); // Punto de origen en (700, 350)
        barraRoja.setOrigin(0.5, 1); // Establece el punto de origen en la parte inferior

        let longitudBarra = 0;

        const longitudMinima = 0; // Longitud mínima permitida
        const longitudMaxima = 200; // Longitud máxima permitida

        const particles = this.physics.add.group({
            key: 'particle_yellow',
            frameQuantity: 10,
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1,
        });

        // Configura el comportamiento de las partículas
        particles.children.iterate((particle) => {
            particle.setPosition(
                Phaser.Math.Between(300, 500),
                Phaser.Math.Between(200, 400)
            );
            particle.setScale(0.3);
            particle.setVelocity(0, 0); // Inicialmente, las partículas están en reposo
            particle.setCollideWorldBounds(true);
            particle.setDepth(2);
        });

        // Función para actualizar la velocidad de las partículas
        const actualizarVelocidadParticulas = () => {
            const velocidadParticulas = Phaser.Math.Linear(50, 300, longitudBarra / longitudMaxima);
            particles.setVelocityX(velocidadParticulas);
            particles.setVelocityY(velocidadParticulas);
        };

        this.add.image(700, 100, 'subir')
            .setScale(1.3)
            .setInteractive()
            
            .on('pointerdown', () => {
                longitudBarra += 10; // Aumenta la longitud hacia arriba (ajusta este valor según lo desees)

                // Comprueba los límites
                if (longitudBarra > longitudMaxima) {
                    longitudBarra = longitudMaxima;
                }

                // Actualiza la longitud de la barra
                barraRoja.setSize(10, longitudBarra);

                // Actualiza la velocidad de las partículas
                actualizarVelocidadParticulas();
            });

        this.add.image(700, 500, 'bajar')
            .setScale(0.8)
            .setInteractive()
            
            .on('pointerdown', () => {
                longitudBarra -= 10; // Disminuye la longitud hacia abajo (ajusta este valor según lo desees)

                // Comprueba los límites
                if (longitudBarra < longitudMinima) {
                    longitudBarra = longitudMinima;
                }

                // Actualiza la longitud de la barra
                barraRoja.setSize(10, longitudBarra);

                // Actualiza la velocidad de las partículas
                actualizarVelocidadParticulas();
            });

        this.add.image(700, 300, 'termo').setScale(0.5, 0.7);

        

        // Configura la física del mundo en el modo "arcade"
        this.physics.world.setBoundsCollision(true, true, true, true);

        // Colisión entre las partículas dentro del grupo
        this.physics.add.collider(particles, particles);

        this.time.addEvent({
            delay: 1000, // 1000 milisegundos (1 segundo)
            callback: () => {
                // Reproduce el sonido cada segundo
                collisionSound.play();
            },
            loop: true, // Para que el evento se repita indefinidamente
        });
    }
}

export default Bootloader;
