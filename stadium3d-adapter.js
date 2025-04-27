/**
 * Stadium3D Adapter - Bridges the old Stadium3D API with the new StadiumRenderer
 * This allows existing code to continue working without major changes
 */
class Stadium3D {
    constructor() {
        this.container = document.getElementById('stadium-3d-container');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.cameraButtons = {
            standard: document.getElementById('view-standard'),
            batsman: document.getElementById('view-batsman'),
            bowler: document.getElementById('view-bowler'),
            aerial: document.getElementById('view-aerial')
        };
        
        // Initialize the new renderer
        this.renderer = new StadiumRenderer('stadium-3d-container');
        
        // Create references to the game elements
        this.scene = this.renderer.scene;
        this.camera = this.renderer.camera;
        this.controls = this.renderer.controls;
        this.isLoaded = false;
        
        // Add batting elements (will be created by the renderer)
        this.createPlayers();
        this.createBall();
        
        // Setup camera controls
        this.setupCameraControls();
        
        // Hide loading indicator after renderer initialization
        setTimeout(() => {
            if (this.loadingIndicator) {
                this.loadingIndicator.style.display = 'none';
            }
            this.isLoaded = true;
        }, 1500);
    }
    
    createPlayers() {
        this.createBatsman();
        this.createBowler();
        
        // Add environmental elements for a more immersive experience
        this.addEnvironmentalEffects();
    }
    
    createBatsman() {
        // Create batsman group
        const batsmanGroup = new THREE.Group();
        batsmanGroup.position.set(1, 0, 9.5);
        
        // Body - use capsule for human-like shape
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 12, 12);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3B82F6,  // Blue jersey
            roughness: 0.7,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.3;
        body.castShadow = true;
        batsmanGroup.add(body);
        
        // Add jersey details
        const jerseyDetailGeometry = new THREE.PlaneGeometry(0.8, 0.4);
        const jerseyDetailMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF, 
            transparent: true,
            side: THREE.DoubleSide
        });
        const jerseyDetail = new THREE.Mesh(jerseyDetailGeometry, jerseyDetailMaterial);
        jerseyDetail.position.set(0, 1.4, 0.41);
        jerseyDetail.rotation.x = Math.PI/2;
        body.add(jerseyDetail);
        
        // Player number
        const numberCanvas = document.createElement('canvas');
        numberCanvas.width = 64;
        numberCanvas.height = 32;
        const numberCtx = numberCanvas.getContext('2d');
        numberCtx.fillStyle = 'white';
        numberCtx.font = 'bold 28px Arial';
        numberCtx.textAlign = 'center';
        numberCtx.textBaseline = 'middle';
        numberCtx.fillText('7', 32, 16);
        
        const numberTexture = new THREE.CanvasTexture(numberCanvas);
        jerseyDetailMaterial.map = numberTexture;
        
        // Head with improved features
        const headGeometry = new THREE.SphereGeometry(0.3, 24, 24);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE2C090,  // Skin tone
            roughness: 0.7,
            metalness: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.2;
        head.castShadow = true;
        batsmanGroup.add(head);
        
        // Add face features
        this.addFaceFeatures(head);
        
        // Helmet with better detail
        const helmetGeometry = new THREE.SphereGeometry(0.32, 24, 24);
        const helmetMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1E40AF,  // Dark blue helmet
            roughness: 0.3,
            metalness: 0.7
        });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.scale.set(1, 0.7, 1);
        helmet.position.y = 2.25;
        helmet.castShadow = true;
        batsmanGroup.add(helmet);
        
        // Helmet visor
        const visorGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.3);
        const visorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.2,
            metalness: 0.8
        });
        const visor = new THREE.Mesh(visorGeometry, visorMaterial);
        visor.position.set(0, 2.2, 0.2);
        visor.castShadow = true;
        batsmanGroup.add(visor);
        
        // Add helmet logo
        const logoGeometry = new THREE.CircleGeometry(0.08, 16);
        const logoMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            side: THREE.DoubleSide
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, 2.4, 0.3);
        logo.rotation.x = Math.PI/2;
        batsmanGroup.add(logo);
        
        // Arms with improved shape
        const armGeometry = new THREE.CapsuleGeometry(0.12, 0.6, 12, 8);
        const armMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3B82F6  // Match jersey
        });
        
        // Left arm (slightly raised for batting position)
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(0.6, 1.5, 0);
        leftArm.rotation.z = -Math.PI / 4;
        leftArm.castShadow = true;
        batsmanGroup.add(leftArm);
        
        // Right arm (in batting position)
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(-0.6, 1.5, 0);
        rightArm.rotation.z = Math.PI / 3;
        rightArm.castShadow = true;
        batsmanGroup.add(rightArm);
        
        // Add gloves
        const gloveGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const gloveMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.9
        });
        
        // Left glove
        const leftGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
        leftGlove.position.set(0.25, 0, 0);
        leftGlove.scale.set(1, 0.7, 0.5);
        leftArm.add(leftGlove);
        
        // Right glove
        const rightGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
        rightGlove.position.set(-0.25, 0, 0);
        rightGlove.scale.set(1, 0.7, 0.5);
        rightArm.add(rightGlove);
        
        // Legs with better detail
        const legGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 12, 8);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,  // White cricket pants
            roughness: 0.8
        });
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(0.2, 0.5, 0);
        leftLeg.castShadow = true;
        batsmanGroup.add(leftLeg);
        
        // Right leg (slightly bent for batting stance)
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(-0.2, 0.5, 0);
        rightLeg.rotation.x = Math.PI / 16;
        rightLeg.castShadow = true;
        batsmanGroup.add(rightLeg);
        
        // Add shoes
        const shoeGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.3);
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9
        });
        
        // Left shoe
        const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        leftShoe.position.set(0, -0.45, 0.05);
        leftShoe.castShadow = true;
        leftLeg.add(leftShoe);
        
        // Right shoe
        const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        rightShoe.position.set(0, -0.45, 0.05);
        rightShoe.castShadow = true;
        rightLeg.add(rightShoe);
        
        // Enhanced cricket bat
        const batGroup = new THREE.Group();
        
        // Bat handle
        const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 16);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x964B00,  // Brown handle
            roughness: 0.8,
            metalness: 0.1
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.rotation.x = Math.PI / 2;
        handle.castShadow = true;
        batGroup.add(handle);
        
        // Handle grip texture
        const gripGeometry = new THREE.CylinderGeometry(0.032, 0.032, 0.35, 16);
        const gripMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 1.0,
            metalness: 0
        });
        const grip = new THREE.Mesh(gripGeometry, gripMaterial);
        grip.rotation.x = Math.PI / 2;
        batGroup.add(grip);
        
        // Bat blade with enhanced shape
        const bladeGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.7);
        const bladeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xC19A6B,  // Light wood color
            roughness: 0.6,
            metalness: 0.1
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.set(0, 0, 0.5);
        blade.castShadow = true;
        batGroup.add(blade);
        
        // Add bat stickers/logos
        const stickerGeometry = new THREE.PlaneGeometry(0.12, 0.2);
        const stickerMaterial = new THREE.MeshBasicMaterial({
            color: 0x0044AA,
            side: THREE.DoubleSide
        });
        const sticker = new THREE.Mesh(stickerGeometry, stickerMaterial);
        sticker.position.set(0, 0.03, 0.5);
        sticker.rotation.x = Math.PI / 2;
        blade.add(sticker);
        
        // Position the bat in the batsman's hands
        batGroup.position.set(-0.6, 1.4, 0.3);
        batGroup.rotation.set(0, Math.PI / 4, Math.PI / 2);
        batsmanGroup.add(batGroup);
        
        // Add batsman to scene and store reference
        this.scene.add(batsmanGroup);
        this.batsman = batsmanGroup;
    }
    
    createBowler() {
        // Create bowler group
        const bowlerGroup = new THREE.Group();
        bowlerGroup.position.set(-1, 0, -9.5);
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xEF4444,  // Red jersey
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.3;
        bowlerGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE2C090,  // Skin tone
            roughness: 0.7 
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.2;
        bowlerGroup.add(head);
        
        // Arms
        const armGeometry = new THREE.CapsuleGeometry(0.12, 0.7, 8, 8);
        const armMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xEF4444  // Match jersey
        });
        
        // Left arm (in bowling position, raised)
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(0.5, 1.7, 0);
        leftArm.rotation.z = -Math.PI / 3;
        bowlerGroup.add(leftArm);
        
        // Right arm (bowling arm, extended back for delivery stance)
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(-0.3, 1.7, -0.4);
        rightArm.rotation.set(Math.PI / 8, 0, Math.PI / 3);
        bowlerGroup.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 8, 8);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF  // White cricket pants
        });
        
        // Left leg (front leg in bowling action)
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(0.2, 0.5, 0.3);
        leftLeg.rotation.x = -Math.PI / 12;
        bowlerGroup.add(leftLeg);
        
        // Right leg (back leg, bent for delivery)
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(-0.2, 0.5, -0.3);
        rightLeg.rotation.x = Math.PI / 8;
        bowlerGroup.add(rightLeg);
        
        // Cricket ball in hand
        const ballGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const ballMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xDC2626,  // Red cricket ball
            roughness: 0.6
        });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(-0.7, 1.7, -0.5);
        bowlerGroup.add(ball);
        
        // Add seam to ball
        const seamGeometry = new THREE.TorusGeometry(0.08, 0.01, 8, 16);
        const seamMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            roughness: 0.5
        });
        const seam = new THREE.Mesh(seamGeometry, seamMaterial);
        seam.rotation.x = Math.PI / 2;
        ball.add(seam);
        
        // Add bowler to scene and store reference
        this.scene.add(bowlerGroup);
        this.bowler = bowlerGroup;
    }
    
    createBall() {
        // Create a detailed cricket ball
        const ballGroup = new THREE.Group();
        
        // Ball core
        const ballGeometry = new THREE.SphereGeometry(0.1, 24, 24);
        const ballMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xDC2626,  // Red cricket ball
            roughness: 0.6
        });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ballGroup.add(ball);
        
        // Add seam
        const seamGeometry = new THREE.TorusGeometry(0.1, 0.01, 8, 24);
        const seamMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,  // White seam
            roughness: 0.5
        });
        const seam = new THREE.Mesh(seamGeometry, seamMaterial);
        seam.rotation.x = Math.PI / 2;
        ballGroup.add(seam);
        
        // Add another seam at a different angle
        const crossSeamGeometry = new THREE.TorusGeometry(0.1, 0.01, 8, 24);
        const crossSeam = new THREE.Mesh(crossSeamGeometry, seamMaterial);
        crossSeam.rotation.y = Math.PI / 2;
        ballGroup.add(crossSeam);
        
        // Add ball to scene and store reference
        ballGroup.position.set(-1, 1, -8);
        this.scene.add(ballGroup);
        this.ball = ballGroup;
    }
    
    setupCameraControls() {
        if (this.cameraButtons.standard) {
            this.cameraButtons.standard.addEventListener('click', () => {
                this.renderer.setCameraView('standard');
            });
        }
        
        if (this.cameraButtons.batsman) {
            this.cameraButtons.batsman.addEventListener('click', () => {
                this.renderer.setCameraView('batsman');
            });
        }
        
        if (this.cameraButtons.bowler) {
            this.cameraButtons.bowler.addEventListener('click', () => {
                this.renderer.setCameraView('bowler');
            });
        }
        
        if (this.cameraButtons.aerial) {
            this.cameraButtons.aerial.addEventListener('click', () => {
                this.renderer.setCameraView('aerial');
            });
        }
    }
    
    // Animation for bowling (bridge to new API)
    bowlBall(speed = 1) {
        if (!this.isLoaded || !this.batsman || !this.bowler || !this.ball) return;
        
        // Reset any previous animations
        this.resetPlayerAnimations();
        
        // Reset ball position
        this.ball.position.set(-1, 1, -8);
        
        // Animate the bowler's action - enhanced with more dramatic movement
        this.bowler.userData.isAnimating = true;
        
        // Bowling run-up animation with improved dynamics
        gsap.timeline()
            .to(this.bowler.position, {
                z: -8,
                duration: 0.4 / speed,
                ease: "power1.in"
            })
            .to(this.bowler.rotation, {
                x: Math.PI * 0.05,
                y: Math.PI * 0.1,
                duration: 0.3 / speed,
                ease: "power1.in"
            }, "<")
            // Bowling arm windmill action
            .to(this.bowler.children[3].rotation, { // Right arm
                z: -Math.PI * 0.8, 
                duration: 0.3 / speed,
                ease: "power2.inOut"
            }, "<")
            // Return to position
            .to(this.bowler.position, {
                z: -9.5,
                duration: 0.5 / speed,
                ease: "power1.out"
            }, "+=0.2")
            .to(this.bowler.rotation, {
                x: 0,
                y: 0,
                duration: 0.4 / speed,
                ease: "power1.out"
            }, "<")
            .to(this.bowler.children[3].rotation, { // Right arm
                z: Math.PI / 3, 
                duration: 0.4 / speed,
                ease: "power1.out"
            }, "<");
        
        // Animate the ball with enhanced physics
        gsap.timeline()
            .to(this.ball.position, {
                x: 0,
                y: 1 + Math.random() * 1.5, // Higher arc for more dramatic effect
                z: 9.5,
                duration: 1 / speed,
                ease: "power1.in"
            })
            // Add ball spin
            .to(this.ball.rotation, {
                x: Math.PI * 3,
                y: Math.PI * 2,
                duration: 1 / speed,
                ease: "linear"
            }, "<");
        
        // Return promise that resolves when animation completes
        return new Promise(resolve => {
            setTimeout(() => resolve(), 1000 / speed);
        });
    }
    
    // Animation for batting shots (bridge to new API)
    playShot(shotType) {
        if (!this.isLoaded || !this.ball || !this.batsman) return;
        
        // Define shot parameters based on shot type
        let targetX, targetY, targetZ, shotPower, shotAngle;
        
        // Reset any previous animations
        this.resetPlayerAnimations();
        
        // Set up the batsman's stance for the specific shot
        this.prepareShot(shotType);
        
        // Determine shot trajectory based on shot type with more variety
        switch(shotType) {
            case 'defensive':
                targetX = (Math.random() - 0.5) * 5;
                targetY = 0.5 + Math.random() * 1;
                targetZ = (Math.random() - 0.5) * 10;
                shotPower = 0.7;
                shotAngle = Math.PI * 0.1;
                break;
            case 'straight':
            case 'drive':
                targetX = 0;
                targetY = 1 + Math.random() * 3;
                targetZ = -15 - Math.random() * 10;
                shotPower = 1.2;
                shotAngle = Math.PI * 0.05;
                break;
            case 'cover':
            case 'sweep':
                targetX = 15 + Math.random() * 10;
                targetY = 1 + Math.random() * 4;
                targetZ = 5 + Math.random() * 10;
                shotPower = 1.3;
                shotAngle = -Math.PI * 0.2;
                break;
            case 'pull':
            case 'hook':
                targetX = -15 - Math.random() * 10;
                targetY = 2 + Math.random() * 5;
                targetZ = 5 + Math.random() * 10;
                shotPower = 1.5;
                shotAngle = Math.PI * 0.3;
                break;
            case 'helicopter':
                targetX = (Math.random() - 0.5) * 30;
                targetY = 10 + Math.random() * 20; // Much higher for six
                targetZ = (Math.random() - 0.5) * 30;
                shotPower = 2.0;
                shotAngle = -Math.PI * 0.15;
                break;
            default:
                targetX = (Math.random() - 0.5) * 30;
                targetY = 1 + Math.random() * 3;
                targetZ = (Math.random() - 0.5) * 30;
                shotPower = 1.0;
                shotAngle = 0;
        }
        
        // Animate batsman swing with dramatic flair
        gsap.timeline()
            .to(this.batsman.rotation, {
                y: shotAngle,
                duration: 0.2,
                ease: "power2.in"
            })
            // Add slight body rotation for realism
            .to(this.batsman.children[0].rotation, { // Body rotation
                y: shotAngle * 0.7,
                duration: 0.2,
                ease: "power2.in"
            }, "<")
            // Rotate bat through swing arc
            .to(this.batsman.children[7].rotation, { // Bat
                y: shotAngle + Math.PI * 0.5,
                x: -Math.PI * 0.2,
                duration: 0.15,
                ease: "power3.in"
            }, "<")
            // Return to original position
            .to(this.batsman.rotation, {
                y: 0,
                duration: 0.3,
                ease: "power1.out"
            }, "+=0.1")
            .to(this.batsman.children[0].rotation, {
                y: 0,
                duration: 0.3,
                ease: "power1.out"
            }, "<")
            .to(this.batsman.children[7].rotation, {
                y: Math.PI / 4,
                x: 0,
                duration: 0.3,
                ease: "power1.out"
            }, "<");
        
        // Animate ball trajectory after being hit with more dynamic physics
        gsap.timeline()
            .to(this.ball.position, {
                x: targetX,
                y: targetY,
                z: targetZ,
                duration: 1.5 * shotPower,
                ease: "power2.out"
            })
            // Add ball spin based on shot type
            .to(this.ball.rotation, {
                x: Math.PI * 6, // Multiple rotations
                y: Math.PI * 4,
                z: Math.PI * 3,
                duration: 1.5 * shotPower,
                ease: "power1.out"
            }, "<");
        
        // Create boundary effect if the shot is powerful
        if (shotType === 'helicopter' || targetY > 5 || 
            Math.abs(targetX) > 20 || Math.abs(targetZ) > 20) {
            setTimeout(() => {
                this.createBoundaryEffect({x: targetX, y: targetY, z: targetZ});
            }, 1000);
        }
        
        // Return promise that resolves when animation completes
        return new Promise(resolve => {
            setTimeout(() => resolve(), 1500 * shotPower);
        });
    }
    
    // New method to set up batsman stance for different shots
    prepareShot(shotType) {
        if (!this.batsman) return;
        
        // Reset to default stance
        this.batsman.children.forEach(part => {
            part.rotation.set(0, 0, 0);
        });
        
        // Adjust stance based on shot type
        switch(shotType) {
            case 'defensive':
                // Defensive stance - more upright, bat closer to body
                this.batsman.children[7].rotation.set(0, Math.PI / 6, Math.PI / 2); // Bat more vertical
                break;
            case 'drive':
                // Drive stance - leaning forward slightly
                this.batsman.rotation.x = Math.PI * 0.05;
                this.batsman.children[7].rotation.set(0, Math.PI / 4, Math.PI / 2);
                break;
            case 'sweep':
                // Sweep stance - lower position
                this.batsman.position.y = -0.3;
                this.batsman.children[7].rotation.set(-Math.PI * 0.2, Math.PI / 3, Math.PI / 2);
                break;
            case 'pull':
            case 'hook':
                // Pull/hook stance - weight on back foot
                this.batsman.position.z = 9.8;
                this.batsman.children[7].rotation.set(0, Math.PI / 3, Math.PI / 2);
                break;
            case 'helicopter':
                // Helicopter stance - ready for a big swing
                this.batsman.children[7].rotation.set(0, -Math.PI / 6, Math.PI / 2.2);
                this.batsman.children[0].rotation.y = -Math.PI * 0.1; // Body slightly twisted
                break;
            default:
                // Default batting stance
                this.batsman.children[7].rotation.set(0, Math.PI / 4, Math.PI / 2);
        }
    }
    
    // Reset players to default position
    resetPlayerAnimations() {
        if (this.batsman) {
            // Reset batsman position
            gsap.to(this.batsman.position, {
                y: 0,
                z: 9.5,
                duration: 0.2
            });
            this.batsman.userData.isAnimating = false;
        }
        
        if (this.bowler) {
            this.bowler.userData.isAnimating = false;
        }
    }
    
    // New method to show reactions for batsman and bowler
    showReaction(character, reaction) {
        const player = character === 'batsman' ? this.batsman : this.bowler;
        if (!player) return;
        
        // Store animation state
        player.userData.isAnimating = true;
        
        // Create emoji bubble for reaction
        this.createEmojiBubble(player, reaction);
        
        // Different animations based on reaction type
        switch(reaction) {
            case 'celebrate':
                // Jump celebration
                gsap.timeline()
                    .to(player.position, {
                        y: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    .to(player.position, {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    })
                    .to(player.rotation, {
                        y: Math.PI * 2,
                        duration: 0.6,
                        ease: "power1.inOut"
                    }, 0);
                break;
                
            case 'wicket':
                // Fall down animation
                gsap.timeline()
                    .to(player.rotation, {
                        x: Math.PI / 2,
                        duration: 0.5,
                        ease: "power2.in"
                    })
                    .to(player.position, {
                        y: -0.5,
                        duration: 0.3,
                        ease: "power2.in"
                    }, "<");
                break;
                
            case 'boundary':
            case 'six':
                // Triumphant pose
                gsap.timeline()
                    .to(player.children[2].rotation, { // Left arm
                        z: -Math.PI / 2,
                        duration: 0.3
                    })
                    .to(player.children[3].rotation, { // Right arm
                        z: -Math.PI / 2,
                        duration: 0.3
                    }, "<")
                    .to(player.rotation, {
                        y: player.rotation.y + Math.PI / 4,
                        duration: 0.4,
                        yoyo: true,
                        repeat: 1
                    });
                break;
                
            case 'disappointed':
            case 'angry':
                // Head down disappointment
                gsap.timeline()
                    .to(player.children[1].rotation, { // Head
                        x: Math.PI / 8,
                        duration: 0.4
                    })
                    .to(player.position, {
                        y: -0.2,
                        duration: 0.3
                    }, "<")
                    .to(player.rotation, {
                        x: Math.PI * 0.05,
                        duration: 0.3
                    }, "<");
                break;
        }
        
        // Reset player after animation
        setTimeout(() => {
            this.resetPlayerAnimations();
            
            // Return to normal poses
            gsap.to(player.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5
            });
            
            // Reset all body parts
            player.children.forEach(part => {
                gsap.to(part.rotation, {
                    x: 0,
                    y: 0,
                    z: part.userData.originalRotation?.z || 0,
                    duration: 0.5
                });
            });
            
            player.userData.isAnimating = false;
        }, 2000);
    }
    
    // Create emoji reaction bubble above player
    createEmojiBubble(player, reaction) {
        if (!player) return;
        
        // Remove any existing bubbles
        const existingBubbles = this.scene.children.filter(obj => obj.userData.isBubble);
        existingBubbles.forEach(bubble => this.scene.remove(bubble));
        
        // Create canvas for emoji texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.fill();
        
        // Add emoji based on reaction
        ctx.font = '180px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let emoji;
        switch(reaction) {
            case 'celebrate': emoji = '🎉'; break;
            case 'wicket': emoji = '😵'; break;
            case 'boundary': emoji = '😄'; break;
            case 'six': emoji = '🤩'; break;
            case 'disappointed': emoji = '😒'; break;
            case 'angry': emoji = '😡'; break;
            default: emoji = '😐';
        }
        
        ctx.fillText(emoji, 128, 128);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create bubble plane
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const bubble = new THREE.Mesh(geometry, material);
        bubble.userData.isBubble = true;
        
        // Position above player's head
        bubble.position.set(
            player.position.x,
            player.position.y + 3,
            player.position.z
        );
        
        // Always face camera
        bubble.lookAt(this.camera.position);
        
        // Add to scene
        this.scene.add(bubble);
        
        // Animation
        gsap.from(bubble.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
        
        // Remove after delay
        setTimeout(() => {
            gsap.to(bubble.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.2,
                onComplete: () => {
                    if (this.scene.children.includes(bubble)) {
                        this.scene.remove(bubble);
                    }
                }
            });
        }, 1800);
    }
    
    // Create visual effect for boundaries
    createBoundaryEffect(position) {
        // Create particle explosion at boundary point
        const particleCount = 50; // Increased particle count
        const colors = position.y > 5 ? 
            [0xFFD700, 0xFFA500, 0xFF4500, 0xFF8C00] : // Gold/orange for sixes
            [0x00BFFF, 0x1E90FF, 0x0000FF, 0x4169E1];  // Blue for fours
        
        for (let i = 0; i < particleCount; i++) {
            // Create particle geometry with more detail
            const size = 0.2 + Math.random() * 0.4;
            const geometry = new THREE.SphereGeometry(size, 12, 12);
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Set initial position at impact point
            particle.position.set(position.x, position.y, position.z);
            
            // Add to scene
            this.scene.add(particle);
            
            // Random direction for the particle with more dynamic movement
            const speed = 0.5 + Math.random() * 2;
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = Math.random() * Math.PI * 2;
            
            const dx = speed * Math.sin(angle1) * Math.cos(angle2);
            const dy = speed * Math.sin(angle1) * Math.sin(angle2);
            const dz = speed * Math.cos(angle1);
            
            // Add light to some particles
            if (Math.random() > 0.7) {
                const pointLight = new THREE.PointLight(
                    particle.material.color.getHex(),
                    0.5,
                    3
                );
                particle.add(pointLight);
            }
            
            // More dynamic animation with bouncing
            gsap.timeline()
                .to(particle.position, {
                    x: particle.position.x + dx * 5,
                    y: particle.position.y + dy * 5 - Math.random() * 2, // Add gravity effect
                    z: particle.position.z + dz * 5,
                    duration: 1 + Math.random() * 1.5,
                    ease: "power2.out"
                })
                .to(particle.scale, {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1,
                    duration: 1,
                    ease: "power1.in",
                    delay: 0.5 + Math.random() * 0.5
                }, "<0.5");
            
            gsap.to(particle.material, {
                opacity: 0,
                duration: 1 + Math.random() * 0.5,
                delay: 1 + Math.random(),
                ease: "power2.in",
                onComplete: () => {
                    // Remove the particle from scene when animation completes
                    this.scene.remove(particle);
                    geometry.dispose();
                    material.dispose();
                }
            });
            
            // Add rotation for more dynamic effect
            gsap.to(particle.rotation, {
                x: Math.random() * Math.PI * 4,
                y: Math.random() * Math.PI * 4,
                z: Math.random() * Math.PI * 4,
                duration: 1.5 + Math.random(),
                ease: "power1.inOut"
            });
        }
        
        // Add explosion flash
        const flashGeometry = new THREE.SphereGeometry(2, 32, 32);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: position.y > 5 ? 0xFFFF00 : 0x00FFFF,
            transparent: true,
            opacity: 0.7
        });
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        flash.position.set(position.x, position.y, position.z);
        this.scene.add(flash);
        
        // Animate flash
        gsap.to(flash.scale, {
            x: 3,
            y: 3,
            z: 3,
            duration: 0.5,
            ease: "power1.out"
        });
        
        gsap.to(flash.material, {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out",
            onComplete: () => {
                this.scene.remove(flash);
                flashGeometry.dispose();
                flashMaterial.dispose();
            }
        });
    }
    
    // Add environmental elements for a more immersive experience
    addEnvironmentalEffects() {
        // Create stadium lights
        this.addStadiumLights();
        
        // Add crowd in stands
        this.addCrowdAnimation();
        
        // Add atmospheric effects
        this.addAtmosphericEffects();
    }
    
    // Add stadium lighting for more realistic visuals
    addStadiumLights() {
        // Main field floodlights
        const floodlightPositions = [
            { x: 25, y: 30, z: 30 },
            { x: -25, y: 30, z: 30 },
            { x: 25, y: 30, z: -30 },
            { x: -25, y: 30, z: -30 }
        ];
        
        floodlightPositions.forEach(pos => {
            // Create floodlight pole
            const poleGeometry = new THREE.CylinderGeometry(0.5, 0.7, 30, 8);
            const poleMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x888888,
                roughness: 0.7,
                metalness: 0.6
            });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.set(pos.x, pos.y/2, pos.z);
            this.scene.add(pole);
            
            // Create light fixture
            const fixtureGeometry = new THREE.BoxGeometry(4, 2, 6);
            const fixtureMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.8,
                metalness: 0.5
            });
            const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
            fixture.position.set(pos.x, pos.y, pos.z);
            fixture.lookAt(0, 0, 0);
            this.scene.add(fixture);
            
            // Add spotlight
            const spotlight = new THREE.SpotLight(0xFFFFAA, 1.5, 100, Math.PI/4, 0.5, 1);
            spotlight.position.set(pos.x, pos.y, pos.z);
            spotlight.target.position.set(0, 0, 0);
            this.scene.add(spotlight);
            this.scene.add(spotlight.target);
            
            // Add light glow effect
            const glowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFFCC,
                transparent: true,
                opacity: 0.4
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(pos.x, pos.y, pos.z);
            this.scene.add(glow);
        });
    }
    
    // Add animated crowd in the stadium for atmosphere
    addCrowdAnimation() {
        // Create crowd in stands
        const crowdGeometry = new THREE.PlaneGeometry(80, 15);
        const crowdTexture = this.createCrowdTexture();
        const crowdMaterial = new THREE.MeshBasicMaterial({
            map: crowdTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        // Create crowd rings around the stadium
        const crowdPositions = [
            { radius: 40, height: 8, startAngle: 0, endAngle: Math.PI * 2 }
        ];
        
        crowdPositions.forEach(pos => {
            // Create a circular crowd
            const segments = 12;
            const angleStep = (pos.endAngle - pos.startAngle) / segments;
            
            for (let i = 0; i < segments; i++) {
                const angle = pos.startAngle + i * angleStep;
                const nextAngle = pos.startAngle + (i + 1) * angleStep;
                
                const x1 = Math.cos(angle) * pos.radius;
                const z1 = Math.sin(angle) * pos.radius;
                const x2 = Math.cos(nextAngle) * pos.radius;
                const z2 = Math.sin(nextAngle) * pos.radius;
                
                const segmentGeometry = new THREE.BufferGeometry();
                const vertices = new Float32Array([
                    x1, pos.height, z1,
                    x2, pos.height, z2,
                    x1, pos.height + 15, z1,
                    x2, pos.height + 15, z2
                ]);
                
                const indices = [0, 1, 2, 2, 1, 3];
                const uvs = new Float32Array([
                    0, 0,
                    1, 0,
                    0, 1,
                    1, 1
                ]);
                
                segmentGeometry.setIndex(indices);
                segmentGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                segmentGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
                
                const crowdSegment = new THREE.Mesh(segmentGeometry, crowdMaterial.clone());
                crowdSegment.lookAt(0, pos.height + 7.5, 0);
                this.scene.add(crowdSegment);
                
                // Add crowd animation
                if (Math.random() > 0.3) {
                    this.animateCrowdSection(crowdSegment);
                }
            }
        });
    }
    
    // Create dynamic crowd texture that changes over time
    createCrowdTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Fill background with stadium color
        ctx.fillStyle = '#1A2456';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw crowd with different colors
        const colors = ['#FF5555', '#5555FF', '#55FF55', '#FFFF55', '#FF55FF'];
        
        for (let i = 0; i < 400; i++) {
            const x = Math.random() * canvas.width;
            const y = 20 + Math.random() * (canvas.height - 40);
            const width = 8 + Math.random() * 12;
            const height = 10 + Math.random() * 30;
            
            // Person figure
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillRect(x, y, width, height);
            
            // Head
            ctx.beginPath();
            ctx.arc(x + width / 2, y - 5, width / 2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFC8A0';
            ctx.fill();
        }
        
        // Create animated crowd effect
        const texture = new THREE.CanvasTexture(canvas);
        
        // Update crowd texture periodically for animation effect
        setInterval(() => {
            // Slightly modify the crowd pattern
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * canvas.width;
                const y = 20 + Math.random() * (canvas.height - 40);
                const width = 8 + Math.random() * 12;
                const height = 10 + Math.random() * 20;
                
                // Erase previous figure
                ctx.fillStyle = '#1A2456';
                ctx.fillRect(x, y, width, height);
                
                // Draw new figure
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.fillRect(x - 5 + Math.random() * 10, y, width, height);
                
                // Head
                ctx.beginPath();
                ctx.arc(x + width / 2, y - 5, width / 2, 0, Math.PI * 2);
                ctx.fillStyle = '#FFC8A0';
                ctx.fill();
            }
            
            // Update texture
            texture.needsUpdate = true;
        }, 1000);
        
        return texture;
    }
    
    // Animate crowd section for wave effect
    animateCrowdSection(crowdSection) {
        // Random interval for crowd movement
        const interval = 5000 + Math.random() * 10000;
        
        setInterval(() => {
            if (Math.random() > 0.5) {
                // Create a wave effect
                gsap.to(crowdSection.scale, {
                    y: 1.2,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }
        }, interval);
    }
    
    // Add atmospheric effects for better ambiance
    addAtmosphericEffects() {
        // Add subtle fog for depth
        this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);
        
        // Add particle system for ambient dust/light particles
        const particleCount = 1000;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 100;
            particlePositions[i3 + 1] = Math.random() * 30;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 100;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true,
            opacity: 0.2
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        
        // Animate particles
        gsap.to(particles.rotation, {
            y: Math.PI * 2,
            duration: 400,
            repeat: -1,
            ease: "none"
        });
    }
    
    // Add face features to player heads
    addFaceFeatures(head) {
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.04, 12, 12);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.06, 12, 12);
        const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        // Left eye white
        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        leftEyeWhite.position.set(0.12, 0.05, 0.25);
        head.add(leftEyeWhite);
        
        // Left eye
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(0.01, 0, 0.02);
        leftEyeWhite.add(leftEye);
        
        // Right eye white
        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        rightEyeWhite.position.set(-0.12, 0.05, 0.25);
        head.add(rightEyeWhite);
        
        // Right eye
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(-0.01, 0, 0.02);
        rightEyeWhite.add(rightEye);
        
        // Mouth
        const mouthGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.01);
        const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, -0.10, 0.28);
        head.add(mouth);
    }

    /**
     * Notifies the Stadium3D component that its container is now visible.
     * This triggers necessary resizing or updates for the underlying renderer.
     */
    notifyVisible() {
        console.log("Stadium container visible, notifying renderer...");
        if (this.renderer && typeof this.renderer.resize === 'function') {
            // Call the assumed resize method of the underlying StadiumRenderer
            this.renderer.resize();
            console.log("Called renderer.resize()");
        } else {
            // Fallback: Trigger a window resize event if a specific method is unknown.
            // The underlying renderer likely listens for this.
            console.warn("StadiumRenderer resize method not found. Triggering window resize event as fallback.");
            window.dispatchEvent(new Event('resize'));
        }
        // Optionally, ensure the first frame is rendered if needed
        // if (this.renderer && typeof this.renderer.render === 'function') {
        //     this.renderer.render();
        // }
    }
}

// Initialize the stadium when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stadium3D = new Stadium3D();
}); 