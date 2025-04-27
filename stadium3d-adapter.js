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
    }
    
    createBatsman() {
        // Create batsman group
        const batsmanGroup = new THREE.Group();
        batsmanGroup.position.set(1, 0, 9.5);
        
        // Body - use capsule for human-like shape
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3B82F6,  // Blue jersey
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.3;
        batsmanGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE2C090,  // Skin tone
            roughness: 0.7 
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.2;
        batsmanGroup.add(head);
        
        // Helmet
        const helmetGeometry = new THREE.SphereGeometry(0.32, 16, 16);
        const helmetMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1E40AF,  // Dark blue helmet
            roughness: 0.4,
            metalness: 0.3
        });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.scale.set(1, 0.7, 1);
        helmet.position.y = 2.25;
        batsmanGroup.add(helmet);
        
        // Helmet visor
        const visorGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.3);
        const visorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.3,
            metalness: 0.5
        });
        const visor = new THREE.Mesh(visorGeometry, visorMaterial);
        visor.position.set(0, 2.2, 0.2);
        batsmanGroup.add(visor);
        
        // Arms
        const armGeometry = new THREE.CapsuleGeometry(0.12, 0.6, 8, 8);
        const armMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3B82F6  // Match jersey
        });
        
        // Left arm (slightly raised for batting position)
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(0.6, 1.5, 0);
        leftArm.rotation.z = -Math.PI / 4;
        batsmanGroup.add(leftArm);
        
        // Right arm (in batting position)
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(-0.6, 1.5, 0);
        rightArm.rotation.z = Math.PI / 3;
        batsmanGroup.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 8, 8);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF  // White cricket pants
        });
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(0.2, 0.5, 0);
        batsmanGroup.add(leftLeg);
        
        // Right leg (slightly bent for batting stance)
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(-0.2, 0.5, 0);
        rightLeg.rotation.x = Math.PI / 16;
        batsmanGroup.add(rightLeg);
        
        // Cricket bat
        const batGroup = new THREE.Group();
        
        // Bat handle
        const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x964B00,  // Brown handle
            roughness: 0.8
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.rotation.x = Math.PI / 2;
        batGroup.add(handle);
        
        // Bat blade
        const bladeGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.7);
        const bladeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xC19A6B,  // Light wood color
            roughness: 0.6
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.set(0, 0, 0.5);
        batGroup.add(blade);
        
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
        if (!this.isLoaded) return;
        
        // Reset ball and bowler positions
        this.ball.position.set(-1, 1, -8);
        
        // Store original bowler position for reset
        const originalBowlerPosition = {
            x: this.bowler.position.x,
            y: this.bowler.position.y,
            z: this.bowler.position.z
        };
        
        // Get the bowling arm (right arm is the second arm added to the bowler)
        const bowlingArm = this.bowler.children.find(child => 
            child.type === 'Mesh' && 
            child.geometry.type === 'CapsuleGeometry' &&
            child.position.x < 0
        );
        
        // Get the ball in bowler's hand
        const ballInHand = this.bowler.children.find(child => 
            child.type === 'Mesh' && 
            child.geometry.type === 'SphereGeometry'
        );
        
        // Create the bowling animation sequence
        const bowlingAnimation = gsap.timeline();
        
        // Step 1: Bowler run-up
        bowlingAnimation.to(this.bowler.position, {
            z: -8,
            duration: 0.5 / speed,
            ease: "power1.in"
        });
        
        // Step 2: Bowling action - arm goes up and over
        if (bowlingArm) {
            bowlingAnimation.to(bowlingArm.rotation, {
                x: -Math.PI, // Full rotation
                z: 0,
                duration: 0.3 / speed,
                ease: "power2.inOut",
                onStart: () => {
                    // Hide the ball in hand when the arm starts moving
                    if (ballInHand) ballInHand.visible = false;
                }
            }, "-=0.1");
        }
        
        // Step 3: Release ball and animate its path
        bowlingAnimation.to(this.ball.position, {
            x: 0, // Move to center of pitch
            y: 1 + Math.random() * 0.5, // Slight height variation
            z: 9.5, // Travel to batsman end
            duration: 0.8 / speed,
            ease: "power1.in",
            onStart: () => {
                // Make main ball visible at release point
                this.ball.visible = true;
                
                // Add rotation to the ball as it moves
                gsap.to(this.ball.rotation, {
                    x: Math.PI * 6, // Multiple rotations
                    y: Math.PI * 2,
                    duration: 0.8 / speed,
                    ease: "linear"
                });
            }
        }, "-=0.2");
        
        // Step 4: Bowler follows through and returns to position
        bowlingAnimation.to(this.bowler.position, {
            x: originalBowlerPosition.x,
            y: originalBowlerPosition.y,
            z: originalBowlerPosition.z,
            duration: 0.6 / speed,
            ease: "power1.out"
        }, "-=0.4");
        
        // Reset bowling arm position
        if (bowlingArm) {
            bowlingAnimation.to(bowlingArm.rotation, {
                x: Math.PI / 8,
                z: Math.PI / 3,
                duration: 0.3 / speed,
                ease: "power1.inOut",
                onComplete: () => {
                    // Show the ball in hand again after animation completes
                    if (ballInHand) ballInHand.visible = true;
                }
            }, "-=0.3");
        }
    }
    
    // Animation for batting shots (bridge to new API)
    playShot(shotType) {
        if (!this.isLoaded || !this.ball) return;
        
        // Calculate target position based on shot type
        let targetX, targetY, targetZ;
        let shotPower = 1.0;
        
        switch(shotType) {
            case 'defensive':
                targetX = this.ball.position.x + (Math.random() * 3 - 1.5);
                targetY = 0.5;
                targetZ = this.ball.position.z - (Math.random() * 6 + 1);
                shotPower = 0.5;
                break;
            case 'drive':
                targetX = 0;
                targetY = 1 + Math.random() * 2;
                targetZ = -15;
                shotPower = 1.2;
                break;
            case 'sweep':
                targetX = -15 - Math.random() * 10;
                targetY = 1 + Math.random() * 3;
                targetZ = 5 + Math.random() * 10;
                shotPower = 1.3;
                break;
            case 'pull':
                targetX = -15 - Math.random() * 5;
                targetY = 1 + Math.random() * 4;
                targetZ = -5 - Math.random() * 5;
                shotPower = 1.4;
                break;
            case 'hook':
                targetX = -10 - Math.random() * 10;
                targetY = 2 + Math.random() * 5;
                targetZ = -10 - Math.random() * 5;
                shotPower = 1.5;
                break;
            case 'helicopter':
                targetX = 0;
                targetY = 2 + Math.random() * 6;
                targetZ = -20 - Math.random() * 10;
                shotPower = 1.8;
                break;
            default:
                targetX = (Math.random() - 0.5) * 30;
                targetY = 1 + Math.random() * 3;
                targetZ = (Math.random() - 0.5) * 30;
                shotPower = 1.0;
        }
        
        // Get the bat from the batsman (should be the last child added)
        const bat = this.batsman.children.find(child => child.type === 'Group');
        
        // Create batting animation sequence
        const battingAnimation = gsap.timeline();
        
        // Step 1: Batsman prepares for the shot (slight backswing)
        battingAnimation.to(this.batsman.rotation, {
            y: Math.PI * 0.1, // Turn slightly
            duration: 0.2,
            ease: "power1.inOut"
        });
        
        // Step 2: Bat swing animation
        if (bat) {
            const swingDirection = shotType === 'sweep' ? Math.PI * 0.5 : -Math.PI * 0.3;
            battingAnimation.to(bat.rotation, {
                y: swingDirection,
                duration: 0.15,
                ease: "power2.in"
            }, "-=0.1");
            
            // Follow through
            battingAnimation.to(bat.rotation, {
                y: -swingDirection * 1.5,
                duration: 0.2,
                ease: "power1.out"
            });
        }
        
        // Step 3: Ball hit and trajectory
        const hitAnimation = gsap.timeline();
        
        // Ball makes contact with bat
        hitAnimation.to(this.ball.position, {
            duration: 0.1,
            ease: "power4.out",
            onComplete: () => {
                // Create a small "impact" effect
                const impactGroup = new THREE.Group();
                const impactGeometry = new THREE.SphereGeometry(0.2, 8, 8);
                const impactMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: 0.7
                });
                const impact = new THREE.Mesh(impactGeometry, impactMaterial);
                impactGroup.add(impact);
                impactGroup.position.copy(this.ball.position);
                this.scene.add(impactGroup);
                
                // Animate impact effect
                gsap.to(impact.scale, {
                    x: 2,
                    y: 2,
                    z: 2,
                    duration: 0.3,
                    ease: "power1.out",
                    onComplete: () => {
                        this.scene.remove(impactGroup);
                    }
                });
                
                gsap.to(impact.material, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power1.out"
                });
                
                // Ball trajectory after hit
                gsap.to(this.ball.position, {
                    x: targetX,
                    y: targetY,
                    z: targetZ,
                    duration: 1.5 * shotPower,
                    ease: "power2.out"
                });
                
                // Ball rotation after hit
                gsap.to(this.ball.rotation, {
                    x: Math.PI * 4 * shotPower,
                    y: Math.PI * 4 * shotPower,
                    z: Math.PI * 4 * shotPower,
                    duration: 1.5 * shotPower,
                    ease: "power1.inOut"
                });
            }
        });
        
        // Step 4: Return batsman to ready position
        battingAnimation.to(this.batsman.rotation, {
            y: 0,
            duration: 0.5,
            delay: 0.5,
            ease: "power1.inOut"
        });
        
        if (bat) {
            battingAnimation.to(bat.rotation, {
                y: Math.PI / 4,
                duration: 0.5,
                ease: "power1.inOut"
            }, "-=0.5");
        }
        
        // Create boundary effect for boundaries
        if (Math.abs(targetX) > 15 || Math.abs(targetZ) > 15) {
            setTimeout(() => {
                this.createBoundaryEffect(new THREE.Vector3(targetX, targetY, targetZ));
            }, 1000);
        }
    }
    
    // Create visual effects for boundaries
    createBoundaryEffect(position) {
        // Create colorful particles exploding outward
        const particleCount = 20;
        const particleGroup = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            // Create a random color with a bright hue
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.8, 0.6);
            
            // Create particle geometry
            const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Set initial position at boundary point
            particle.position.copy(position);
            
            // Add to group
            particleGroup.add(particle);
            
            // Animate each particle
            const angle = Math.random() * Math.PI * 2; // Random direction
            const elevation = Math.random() * Math.PI - Math.PI/2;
            const speed = 0.2 + Math.random() * 0.3;
            const distance = 3 + Math.random() * 5;
            
            const targetX = position.x + Math.cos(angle) * Math.cos(elevation) * distance;
            const targetY = position.y + Math.sin(elevation) * distance;
            const targetZ = position.z + Math.sin(angle) * Math.cos(elevation) * distance;
            
            // Move particle outward
            gsap.to(particle.position, {
                x: targetX,
                y: targetY,
                z: targetZ,
                duration: 1 / speed,
                ease: "power1.out"
            });
            
            // Fade out and scale down
            gsap.to(particle.material, {
                opacity: 0,
                duration: 1 / speed,
                ease: "power1.in"
            });
            
            gsap.to(particle.scale, {
                x: 0.1,
                y: 0.1,
                z: 0.1,
                duration: 1 / speed,
                ease: "power1.in"
            });
        }
        
        // Add particles to scene
        this.scene.add(particleGroup);
        
        // Clean up after animation completes
        setTimeout(() => {
            this.scene.remove(particleGroup);
            particleGroup.children.forEach(particle => {
                particle.geometry.dispose();
                particle.material.dispose();
            });
        }, 2000);
        
        // Create a light flash at boundary point
        const boundaryLight = new THREE.PointLight(0xFFFFFF, 2, 20);
        boundaryLight.position.copy(position);
        this.scene.add(boundaryLight);
        
        // Animate light intensity
        gsap.to(boundaryLight, {
            intensity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                this.scene.remove(boundaryLight);
            }
        });
    }
}

// Initialize the stadium when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stadium3D = new Stadium3D();
}); 