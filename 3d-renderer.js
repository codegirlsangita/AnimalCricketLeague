// 3D Stadium Renderer with Three.js
class StadiumRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stadium = null;
        this.lights = [];
        this.animations = {};
        this.clock = new THREE.Clock();
        this.mixers = [];
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a472a); // Cricket pitch green
        this.scene.fog = new THREE.Fog(0x1a472a, 50, 100);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 30, 50);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.setupLights();
        
        // Create stadium
        this.createStadium();
        
        // Add ambient objects (clouds, trees, etc.)
        this.addAmbientObjects();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 80, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // Hemisphere light (sky/ground coloring)
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x38761d, 0.6);
        this.scene.add(hemisphereLight);
        
        // Stadium spotlights
        const spotlightPositions = [
            { x: 45, y: 40, z: 45 },
            { x: -45, y: 40, z: 45 },
            { x: 45, y: 40, z: -45 },
            { x: -45, y: 40, z: -45 }
        ];
        
        spotlightPositions.forEach(pos => {
            const spotlight = new THREE.SpotLight(0xffffff, 0.8);
            spotlight.position.set(pos.x, pos.y, pos.z);
            spotlight.target.position.set(0, 0, 0);
            spotlight.angle = Math.PI / 6;
            spotlight.penumbra = 0.3;
            spotlight.decay = 1.5;
            spotlight.distance = 200;
            spotlight.castShadow = true;
            spotlight.shadow.mapSize.width = 1024;
            spotlight.shadow.mapSize.height = 1024;
            this.scene.add(spotlight);
            this.scene.add(spotlight.target);
            this.lights.push(spotlight);
        });
    }
    
    createStadium() {
        // Create ground
        const groundGeometry = new THREE.CircleGeometry(80, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x38761d,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create cricket pitch
        const pitchGeometry = new THREE.PlaneGeometry(3, 20);
        const pitchMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd4bc8c,
            roughness: 0.5,
            metalness: 0.1
        });
        const pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
        pitch.rotation.x = -Math.PI / 2;
        pitch.position.y = 0.01; // Slightly above ground to prevent z-fighting
        pitch.receiveShadow = true;
        this.scene.add(pitch);
        
        // Create wickets
        this.createWickets(0, 0, 10);  // Batsman end
        this.createWickets(0, 0, -10); // Bowler end
        
        // Create stadium seating (circular stadium)
        this.createStadiumSeating();
    }
    
    createWickets(x, y, z) {
        const wicketMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xebdcb2,
            roughness: 0.3,
            metalness: 0.2
        });
        
        // Three stumps
        for (let i = -1; i <= 1; i++) {
            const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
            const stump = new THREE.Mesh(stumpGeometry, wicketMaterial);
            stump.position.set(x + i * 0.15, y + 0.4, z);
            stump.castShadow = true;
            this.scene.add(stump);
            
            // Add bails
            if (i < 1) {
                const bailGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.05);
                const bail = new THREE.Mesh(bailGeometry, wicketMaterial);
                bail.position.set(x + i * 0.15 + 0.075, y + 0.85, z);
                bail.castShadow = true;
                this.scene.add(bail);
            }
        }
    }
    
    createStadiumSeating() {
        // Create a circular stadium with seats
        const radius = 70;
        const height = 15;
        
        // Stadium outer shell
        const stadiumGeometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true);
        const stadiumMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            roughness: 0.8,
            metalness: 0.2,
            side: THREE.BackSide
        });
        const stadium = new THREE.Mesh(stadiumGeometry, stadiumMaterial);
        stadium.position.y = height / 2;
        this.scene.add(stadium);
        
        // Stadium seating levels (colored rows of seats)
        const seatColors = [0x1E88E5, 0x43A047, 0xFDD835, 0xE53935, 0x5E35B1];
        
        for (let level = 0; level < 5; level++) {
            const levelRadius = radius - 1; // Slightly inside the outer shell
            const levelHeight = 2;
            const levelY = level * levelHeight + 2; // Starting position
            
            const seatRowGeometry = new THREE.CylinderGeometry(
                levelRadius, 
                levelRadius - 0.5, 
                levelHeight, 
                64, 
                1, 
                true
            );
            
            const seatRowMaterial = new THREE.MeshStandardMaterial({ 
                color: seatColors[level],
                roughness: 0.8,
                metalness: 0.2,
                side: THREE.DoubleSide
            });
            
            const seatRow = new THREE.Mesh(seatRowGeometry, seatRowMaterial);
            seatRow.position.y = levelY;
            this.scene.add(seatRow);
        }
    }
    
    addAmbientObjects() {
        // Add trees around the stadium
        this.addTrees();
        
        // Add clouds in the sky
        this.addClouds();
        
        // Add particle effects
        this.addParticles();
    }
    
    addTrees() {
        // Simple tree implementation with cone + cylinder
        const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 85 + Math.random() * 10;
            const x = Math.sin(angle) * distance;
            const z = Math.cos(angle) * distance;
            
            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 3, 8);
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(x, 1.5, z);
            trunk.castShadow = true;
            this.scene.add(trunk);
            
            // Tree crown (cone)
            const treeHeight = 5 + Math.random() * 3;
            const treeGeometry = new THREE.ConeGeometry(2 + Math.random(), treeHeight, 8);
            const tree = new THREE.Mesh(treeGeometry, treeMaterial);
            tree.position.set(x, treeHeight/2 + 3, z);
            tree.castShadow = true;
            this.scene.add(tree);
        }
    }
    
    addClouds() {
        // Create clouds with spheres
        const cloudMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            roughness: 1.0,
            metalness: 0.0
        });
        
        for (let i = 0; i < 15; i++) {
            const cloudGroup = new THREE.Group();
            const numSpheres = 3 + Math.floor(Math.random() * 5);
            
            // Create cloud with multiple overlapping spheres
            for (let j = 0; j < numSpheres; j++) {
                const sphereSize = 2 + Math.random() * 3;
                const sphereGeometry = new THREE.SphereGeometry(sphereSize, 8, 8);
                const sphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                
                // Position spheres to form a cloud shape
                sphere.position.x = (Math.random() - 0.5) * 5;
                sphere.position.y = (Math.random() - 0.5) * 2;
                sphere.position.z = (Math.random() - 0.5) * 5;
                
                cloudGroup.add(sphere);
            }
            
            // Position cloud in sky
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 80;
            cloudGroup.position.set(
                Math.sin(angle) * distance,
                40 + Math.random() * 20,
                Math.cos(angle) * distance
            );
            
            // Animate cloud
            const speed = 0.2 + Math.random() * 0.3;
            const cloudObj = { group: cloudGroup, speed: speed, angle: angle, distance: distance };
            this.animations.clouds = this.animations.clouds || [];
            this.animations.clouds.push(cloudObj);
            
            this.scene.add(cloudGroup);
        }
    }
    
    addParticles() {
        // Add floating particles (dust, pollen, etc.)
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = 50 + Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 30;
            
            particlePositions[i3] = Math.sin(angle) * radius;
            particlePositions[i3 + 1] = height;
            particlePositions[i3 + 2] = Math.cos(angle) * radius;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.5,
            map: this.createParticleTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        
        // Store for animation
        this.animations.particles = particles;
    }
    
    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );
        
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update mixers (for animated models)
        this.mixers.forEach(mixer => mixer.update(delta));
        
        // Animate clouds
        if (this.animations.clouds) {
            this.animations.clouds.forEach(cloud => {
                cloud.angle += cloud.speed * delta * 0.05;
                cloud.group.position.x = Math.sin(cloud.angle) * cloud.distance;
                cloud.group.position.z = Math.cos(cloud.angle) * cloud.distance;
            });
        }
        
        // Animate particles
        if (this.animations.particles) {
            this.animations.particles.rotation.y += delta * 0.01;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Methods to create and control animal characters
    createAnimal(type, position) {
        // In a real implementation, load 3D models of animals
        // For this demo, we'll create simple placeholders
        
        let animalGroup = new THREE.Group();
        animalGroup.position.copy(position);
        
        // Different shapes based on animal type
        switch(type) {
            case 'lion':
                this.createLion(animalGroup);
                break;
            case 'elephant':
                this.createElephant(animalGroup);
                break;
            case 'tiger':
                this.createTiger(animalGroup);
                break;
            default:
                this.createGenericAnimal(animalGroup);
        }
        
        this.scene.add(animalGroup);
        return animalGroup;
    }
    
    // Example animal creation methods (simplified)
    createLion(group) {
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xDAA520 });
        const bodyGeometry = new THREE.SphereGeometry(1, 16, 16);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 0.8, 0.5);
        group.add(head);
        
        // Legs
        this.createLeg(group, 0.5, -0.3, 0.5);
        this.createLeg(group, -0.5, -0.3, 0.5);
        this.createLeg(group, 0.5, -0.3, -0.5);
        this.createLeg(group, -0.5, -0.3, -0.5);
    }
    
    createLeg(group, x, y, z) {
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0xDAA520 });
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(x, y, z);
        leg.rotation.x = Math.PI / 2;
        group.add(leg);
    }
    
    // Other animal creation methods would be similar
    createElephant(group) { /* Similar to lion but with elephant shape */ }
    createTiger(group) { /* Similar to lion but with tiger colors */ }
    createGenericAnimal(group) { /* Fallback generic animal */ }
    
    // Animation methods for cricket actions
    animateBowling(character) {
        const bowlingAnimation = gsap.timeline();
        bowlingAnimation.to(character.position, {
            y: '+= 0.5',
            duration: 0.3,
            ease: 'power2.out'
        }).to(character.position, {
            z: '-= 2',
            duration: 0.4,
            ease: 'power1.in'
        }).to(character.position, {
            y: '-= 0.5',
            duration: 0.3,
            ease: 'bounce.out'
        });
        
        return bowlingAnimation;
    }
    
    animateBatting(character) {
        const battingAnimation = gsap.timeline();
        battingAnimation.to(character.rotation, {
            y: '-= 0.5',
            duration: 0.2,
            ease: 'power2.out'
        }).to(character.rotation, {
            y: '+= 1',
            duration: 0.1,
            ease: 'power4.in'
        }).to(character.rotation, {
            y: '-= 0.5',
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
        });
        
        return battingAnimation;
    }
    
    // Methods to create and animate the cricket ball
    createBall() {
        const ballGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.castShadow = true;
        this.scene.add(ball);
        return ball;
    }
    
    animateBall(ball, start, end, speed = 1) {
        // Set initial position
        ball.position.copy(start);
        
        // Create animation path
        const midPoint = new THREE.Vector3(
            (start.x + end.x) / 2,
            start.y + 2, // Arc height
            (start.z + end.z) / 2
        );
        
        // Animate along path
        const ballAnimation = gsap.timeline();
        ballAnimation.to(ball.position, {
            x: midPoint.x,
            y: midPoint.y,
            z: midPoint.z,
            duration: speed * 0.5,
            ease: 'power1.out'
        }).to(ball.position, {
            x: end.x,
            y: end.y,
            z: end.z,
            duration: speed * 0.5,
            ease: 'power1.in'
        });
        
        // Add rotation
        gsap.to(ball.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: speed,
            ease: 'linear'
        });
        
        return ballAnimation;
    }
    
    // Special effects for boundaries, wickets, etc.
    createBoundaryEffect(position) {
        // Create colorful particles exploding outward
        const particleCount = 100;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const color = new THREE.Color();
            color.setHSL(Math.random(), 1, 0.5);
            
            const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: color });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random starting position near the boundary point
            particle.position.copy(position);
            particle.position.x += (Math.random() - 0.5) * 0.5;
            particle.position.y += (Math.random() - 0.5) * 0.5;
            particle.position.z += (Math.random() - 0.5) * 0.5;
            
            particles.add(particle);
            
            // Animate particle
            gsap.to(particle.position, {
                x: particle.position.x + (Math.random() - 0.5) * 5,
                y: particle.position.y + Math.random() * 5,
                z: particle.position.z + (Math.random() - 0.5) * 5,
                duration: 1 + Math.random(),
                ease: 'power1.out'
            });
            
            gsap.to(particle.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1 + Math.random(),
                ease: 'power1.out',
                onComplete: () => {
                    particle.geometry.dispose();
                    particle.material.dispose();
                    particles.remove(particle);
                }
            });
        }
        
        this.scene.add(particles);
        
        // Remove group after animations complete
        setTimeout(() => {
            this.scene.remove(particles);
        }, 3000);
    }
    
    // Method to move camera for different views
    setCameraView(view) {
        const views = {
            standard: { x: 0, y: 30, z: 50 },
            batsman: { x: 0, y: 2, z: 15 },
            bowler: { x: 0, y: 2, z: -15 },
            aerial: { x: 0, y: 60, z: 0 },
            boundary: { x: 50, y: 15, z: 50 }
        };
        
        if (views[view]) {
            gsap.to(this.camera.position, {
                x: views[view].x,
                y: views[view].y,
                z: views[view].z,
                duration: 1.5,
                ease: 'power2.inOut',
                onUpdate: () => this.camera.lookAt(0, 0, 0)
            });
        }
    }
}

// Export the renderer
window.StadiumRenderer = StadiumRenderer;