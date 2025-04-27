class Stadium3D {
    constructor() {
        this.container = document.getElementById('stadium-3d-container');
        this.loadingIndicator = document.getElementById('stadium-loading');
        this.cameraButtons = {
            standard: document.getElementById('camera-standard'),
            batsman: document.getElementById('camera-batsman'),
            bowler: document.getElementById('camera-bowler'),
            aerial: document.getElementById('camera-aerial')
        };
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.stadium = null;
        this.batsman = null;
        this.bowler = null;
        this.ball = null;
        this.isLoaded = false;
        
        // Initialize the scene
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 20);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        
        // Add controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Load stadium model
        this.loadStadium();
        
        // Add event listeners for camera angles
        this.setupCameraControls();
        
        // Add window resize handler
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    }
    
    loadStadium() {
        // Show loading indicator
        this.loadingIndicator.style.display = 'flex';
        
        // Create a ground plane for now (will be replaced with actual stadium model)
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x355E3B, // Cricket field green
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create pitch (center strip)
        const pitchGeometry = new THREE.PlaneGeometry(3, 20);
        const pitchMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xD2B48C, // Tan color for pitch
            side: THREE.DoubleSide
        });
        const pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
        pitch.rotation.x = -Math.PI / 2;
        pitch.position.y = 0.01; // Slightly above ground to prevent z-fighting
        this.scene.add(pitch);
        
        // Add stumps at both ends
        this.addStumps(0, 0, 10);  // Batsman end
        this.addStumps(0, 0, -10); // Bowler end
        
        // Add simple stadium seating (temporary)
        this.addStadiumSeating();
        
        // Create batsman and bowler placeholders
        this.createPlayers();
        
        // Create ball
        this.createBall();
        
        // Hide loading indicator after a delay (simulating load time)
        setTimeout(() => {
            this.loadingIndicator.style.display = 'none';
            this.isLoaded = true;
        }, 1500);
    }
    
    addStumps(x, y, z) {
        const stumpsGroup = new THREE.Group();
        
        // Create three stumps
        for (let i = -1; i <= 1; i++) {
            const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8);
            const stumpMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFAFA });
            const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
            stump.position.set(i * 0.15, 0.375, 0); // Position stumps side by side
            stump.castShadow = true;
            
            // Add bails
            if (i < 1) {
                const bailGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
                const bailMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFAFA });
                const bail = new THREE.Mesh(bailGeometry, bailMaterial);
                bail.position.set(i * 0.15 + 0.075, 0.75, 0);
                bail.castShadow = true;
                stumpsGroup.add(bail);
            }
            
            stumpsGroup.add(stump);
        }
        
        stumpsGroup.position.set(x, y, z);
        this.scene.add(stumpsGroup);
    }
    
    addStadiumSeating() {
        // Create a circular stadium seating
        const radius = 40;
        const height = 15;
        
        // Stadium outer wall
        const stadiumGeometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true);
        const stadiumMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E3A8A,
            side: THREE.DoubleSide
        });
        
        const stadium = new THREE.Mesh(stadiumGeometry, stadiumMaterial);
        stadium.position.y = height / 2;
        this.scene.add(stadium);
        
        // Add seats (simplified as colored sections)
        const seatColors = [0xEF4444, 0xF59E0B, 0x10B981, 0x3B82F6];
        const seatSections = 4;
        
        for (let i = 0; i < seatSections; i++) {
            const sectionAngle = (Math.PI * 2) / seatSections;
            const startAngle = i * sectionAngle;
            const endAngle = (i + 1) * sectionAngle;
            
            const seatGeometry = new THREE.CylinderGeometry(
                radius - 1, // Outer radius
                radius - 10, // Inner radius (creates a slope)
                height - 2, // Slightly shorter than the outer wall
                32, // Segments
                10, // Height segments
                true, // Open-ended
                startAngle, // Start angle
                sectionAngle // Angle length
            );
            
            const seatMaterial = new THREE.MeshStandardMaterial({
                color: seatColors[i],
                side: THREE.DoubleSide
            });
            
            const seatSection = new THREE.Mesh(seatGeometry, seatMaterial);
            seatSection.position.y = (height - 2) / 2 + 1; // Position above ground
            this.scene.add(seatSection);
        }
    }
    
    createPlayers() {
        // Create batsman placeholder
        const batsmanGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
        const batsmanMaterial = new THREE.MeshStandardMaterial({ color: 0x3B82F6 }); // Blue uniform
        this.batsman = new THREE.Mesh(batsmanGeometry, batsmanMaterial);
        this.batsman.position.set(1, 1.25, 9.5); // Positioned at batsman end
        this.batsman.castShadow = true;
        this.scene.add(this.batsman);
        
        // Add bat
        const batGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.2);
        const batMaterial = new THREE.MeshStandardMaterial({ color: 0x964B00 }); // Brown bat
        const bat = new THREE.Mesh(batGeometry, batMaterial);
        bat.position.set(0.7, 0, 0);
        this.batsman.add(bat);
        
        // Create bowler placeholder
        const bowlerGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
        const bowlerMaterial = new THREE.MeshStandardMaterial({ color: 0xEF4444 }); // Red uniform
        this.bowler = new THREE.Mesh(bowlerGeometry, bowlerMaterial);
        this.bowler.position.set(-1, 1.25, -9.5); // Positioned at bowler end
        this.bowler.castShadow = true;
        this.scene.add(this.bowler);
    }
    
    createBall() {
        const ballGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xDC2626 }); // Red cricket ball
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.set(-1, 1, -8); // Initial position near bowler
        this.ball.castShadow = true;
        this.scene.add(this.ball);
    }
    
    setupCameraControls() {
        this.cameraButtons.standard.addEventListener('click', () => {
            gsap.to(this.camera.position, {
                x: 0,
                y: 10,
                z: 20,
                duration: 1,
                onUpdate: () => this.camera.lookAt(0, 0, 0)
            });
        });
        
        this.cameraButtons.batsman.addEventListener('click', () => {
            gsap.to(this.camera.position, {
                x: 2,
                y: 2,
                z: 12,
                duration: 1,
                onUpdate: () => this.camera.lookAt(0, 1, 0)
            });
        });
        
        this.cameraButtons.bowler.addEventListener('click', () => {
            gsap.to(this.camera.position, {
                x: -2,
                y: 2,
                z: -12,
                duration: 1,
                onUpdate: () => this.camera.lookAt(0, 1, 0)
            });
        });
        
        this.cameraButtons.aerial.addEventListener('click', () => {
            gsap.to(this.camera.position, {
                x: 0,
                y: 30,
                z: 0,
                duration: 1,
                onUpdate: () => this.camera.lookAt(0, 0, 0)
            });
        });
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Animation for bowling
    bowlBall(speed = 1) {
        if (!this.isLoaded) return;
        
        // Reset ball position
        this.ball.position.set(-1, 1, -8);
        
        // Animate the bowler's action
        gsap.to(this.bowler.position, {
            z: -8,
            duration: 0.5 / speed,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
        });
        
        // Animate the ball
        gsap.to(this.ball.position, {
            x: 0,
            y: 1 + Math.random() * 0.5, // Random height variation
            z: 9.5,
            duration: 1 / speed,
            ease: "power1.in",
            onComplete: () => {
                // Ball reaches the batsman
                console.log("Ball reached batsman");
            }
        });
    }
    
    // Animation for batting shots
    playShot(shotType) {
        if (!this.isLoaded || !this.ball) return;
        
        let targetX, targetY, targetZ;
        
        // Determine shot trajectory based on shot type
        switch(shotType) {
            case 'straight':
                targetX = 0;
                targetY = 1 + Math.random() * 3;
                targetZ = -15;
                break;
            case 'cover':
                targetX = 15 + Math.random() * 10;
                targetY = 1 + Math.random() * 4;
                targetZ = 0;
                break;
            case 'square':
                targetX = -15 - Math.random() * 10;
                targetY = 1 + Math.random() * 2;
                targetZ = 0;
                break;
            case 'sweep':
                targetX = -15 - Math.random() * 10;
                targetY = 1 + Math.random() * 5;
                targetZ = 15 + Math.random() * 10;
                break;
            default:
                targetX = (Math.random() - 0.5) * 30;
                targetY = 1 + Math.random() * 3;
                targetZ = (Math.random() - 0.5) * 30;
        }
        
        // Animate batsman swing
        gsap.to(this.batsman.rotation, {
            y: Math.PI * 0.25,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        // Animate ball trajectory after being hit
        gsap.to(this.ball.position, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: 1.5,
            ease: "power2.out"
        });
    }
}

// Initialize the stadium when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stadium3D = new Stadium3D();
}); 