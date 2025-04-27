document.addEventListener('DOMContentLoaded', () => {
    // Game screens
    const welcomeScreen = document.getElementById('welcome-screen');
    const teamSelectionScreen = document.getElementById('team-selection-screen');
    const gameplayScreen = document.getElementById('gameplay-screen');
    const resultScreen = document.getElementById('result-screen');
    
    // Game elements
    const startGameBtn = document.getElementById('start-game');
    const teamCards = document.querySelectorAll('.team-card');
    const shotButtons = document.querySelectorAll('.shot-btn');
    const playAgainBtn = document.getElementById('play-again');
    const ball = document.getElementById('ball');
    const bat = document.getElementById('bat');
    const stadium = document.querySelector('.stadium');
    
    // Game display elements
    const playerTeamLogo = document.getElementById('player-team-icon');
    const playerTeamName = document.getElementById('player-team-name');
    const playerScore = document.getElementById('player-score');
    const opponentTeamLogo = document.getElementById('opponent-team-icon');
    const opponentTeamName = document.getElementById('opponent-team-name');
    const opponentScore = document.getElementById('opponent-score');
    const commentaryText = document.getElementById('commentary-text');
    const currentOver = document.getElementById('current-over');
    const resultTitle = document.getElementById('result-title');
    const resultDetails = document.getElementById('result-details');
    const resultIcon = document.getElementById('result-icon');
    
    // Create star background
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 1}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            
            // Style the stars
            star.style.backgroundColor = '#fff';
            star.style.borderRadius = '50%';
            star.style.position = 'absolute';
            star.style.opacity = Math.random() * 0.8 + 0.2;
            star.style.animation = 'pulse 2s infinite ease-in-out';
            
            starsContainer.appendChild(star);
        }
    }
    
    // Create crowd animation with icons
    const crowdContainers = document.querySelectorAll('.crowd-animation');
    const crowdIcons = [
        'fa-user', 'fa-child', 'fa-user-friends', 'fa-user-tie', 
        'fa-running', 'fa-walking', 'fa-smile', 'fa-laugh'
    ];
    
    crowdContainers.forEach(container => {
        for (let i = 0; i < 25; i++) {
            const person = document.createElement('div');
            const randomIcon = crowdIcons[Math.floor(Math.random() * crowdIcons.length)];
            person.classList.add('crowd-person', 'mx-1', 'text-lg');
            person.innerHTML = `<i class="fas ${randomIcon}"></i>`;
            person.style.color = `hsl(${Math.random() * 360}, 70%, 70%)`;
            person.style.animation = `pulse ${Math.random() * 2 + 1}s infinite ease-in-out`;
            person.style.animationDelay = `${Math.random()}s`;
            container.appendChild(person);
        }
    });
    
    // Game state
    let gameState = {
        playerTeam: null,
        opponentTeam: null,
        playerRuns: 0,
        playerWickets: 0,
        opponentRuns: 0,
        opponentWickets: 0,
        currentBall: 0,
        currentOver: 0,
        totalOvers: 5,
        isPlayerBatting: true,
        target: 0,
        gamePhase: 'first-innings',
    };
    
    // Team data with icons
    const teams = {
        csk: {
            name: 'Chennai Lions',
            shortName: 'Lions',
            icon: 'fa-crown',
            color: 'yellow',
            strength: 85,
            animal: 'lion',
            sound: 'roar'
        },
        mi: {
            name: 'Mumbai Elephants',
            shortName: 'Elephants',
            icon: 'fa-water',
            color: 'blue',
            strength: 85,
            animal: 'elephant',
            sound: 'trumpet'
        },
        rcb: {
            name: 'Bangalore Tigers',
            shortName: 'Tigers',
            icon: 'fa-fire',
            color: 'red',
            strength: 80,
            animal: 'tiger',
            sound: 'growl'
        },
        kkr: {
            name: 'Kolkata Monkeys',
            shortName: 'Monkeys',
            icon: 'fa-horse',
            color: 'purple',
            strength: 80,
            animal: 'monkey',
            sound: 'chatter'
        },
        srh: {
            name: 'Hyderabad Eagles',
            shortName: 'Eagles',
            icon: 'fa-sun',
            color: 'orange',
            strength: 75,
            animal: 'eagle',
            sound: 'screech'
        },
        dc: {
            name: 'Delhi Panthers',
            shortName: 'Panthers',
            icon: 'fa-bolt',
            color: 'blue',
            strength: 75,
            animal: 'panther',
            sound: 'roar'
        },
        rr: {
            name: 'Rajasthan Rhinos',
            shortName: 'Rhinos',
            icon: 'fa-chess-rook',
            color: 'pink',
            strength: 75,
            animal: 'rhino',
            sound: 'grunt'
        },
        pbks: {
            name: 'Punjab Foxes',
            shortName: 'Foxes',
            icon: 'fa-shield-alt',
            color: 'red',
            strength: 70,
            animal: 'fox',
            sound: 'bark'
        }
    };
    
    // Commentary templates
    const commentaryTemplates = {
        wicket: [
            "Oh no! That's out! The animal has to walk back to the jungle!",
            "HOWZAT! The referee monkey raises his finger!",
            "That's the end of that! Another animal heads back to the den!",
            "Clean bowled! The animal looks stunned!",
            "Caught! What a catch by that agile creature!"
        ],
        boundary4: [
            "FOUR! Beautifully played through the jungle!",
            "That's a powerful shot for FOUR! The animal strength showing!",
            "The ball races away to the boundary for FOUR! Too quick for the fielders!",
            "FOUR RUNS! That was expertly placed between the trees!",
            "Exquisite timing! That's FOUR! The animal is in great form!"
        ],
        boundary6: [
            "SIX! That's gone all the way into the treetops!",
            "What power! SIX runs! That ball might hit a coconut!",
            "MAXIMUM! The ball soars over the jungle canopy!",
            "That's huge! SIX runs! The animal crowd goes wild!",
            "SIX! All the animals in the jungle are cheering!"
        ],
        dot: [
            "Good defensive move. No run. Cautious like a fox.",
            "And that's played with precision. No run. Smart animal play.",
            "Beaten! No run on that delivery. Quick as a cheetah!",
            "The animal leaves that one. No run. Showing jungle wisdom.",
            "Dot ball. Good bowling from the predator."
        ],
        runs: [
            "Quick single taken! Fast as a jungle cat!",
            "They've run TWO! Look at those animal legs move!",
            "Good running between the stumps for THREE! Jungle agility at its best!",
            "And they push for a quick run! The animal instincts are sharp!",
            "That's well played for a couple of runs! Showing excellent animal reflexes!"
        ]
    };
    
    // Event listeners
    startGameBtn.addEventListener('click', () => {
        showScreen(teamSelectionScreen);
    });
    
    teamCards.forEach(card => {
        card.addEventListener('click', () => {
            const teamId = card.getAttribute('data-team');
            selectTeam(teamId);
        });
    });
    
    shotButtons.forEach(button => {
        button.addEventListener('click', () => {
            const shotType = button.getAttribute('data-shot');
            playShot(shotType);
        });
    });
    
    playAgainBtn.addEventListener('click', resetGame);
    
    // Game functions
    function showScreen(screen) {
        // Hide all screens
        welcomeScreen.classList.add('hidden');
        teamSelectionScreen.classList.add('hidden');
        gameplayScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        
        // Show the requested screen
        screen.classList.remove('hidden');
    }
    
    function selectTeam(teamId) {
        // Set player team
        gameState.playerTeam = teams[teamId];
        
        // Choose a random opponent (different from player)
        const availableOpponents = Object.keys(teams).filter(id => id !== teamId);
        const randomOpponentId = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
        gameState.opponentTeam = teams[randomOpponentId];
        
        // Update UI with team info
        if (playerTeamLogo.querySelector('i')) {
            playerTeamLogo.querySelector('i').className = `fas ${gameState.playerTeam.icon} fa-3x`;
        } else {
            playerTeamLogo.innerHTML = `<i class="fas ${gameState.playerTeam.icon} fa-3x"></i>`;
        }
        playerTeamLogo.style.color = getTeamColor(gameState.playerTeam.color);
        playerTeamName.textContent = gameState.playerTeam.shortName;
        playerScore.textContent = `${gameState.playerRuns}/${gameState.playerWickets}`;
        
        // Set animal batsman icon
        const animalBatsman = document.getElementById('animal-batsman');
        if (animalBatsman) {
            animalBatsman.innerHTML = `<i class="fas fa-running fa-4x"></i>`;
            animalBatsman.style.color = getTeamColor(gameState.playerTeam.color);
        }
        
        if (opponentTeamLogo.querySelector('i')) {
            opponentTeamLogo.querySelector('i').className = `fas ${gameState.opponentTeam.icon} fa-3x`;
        } else {
            opponentTeamLogo.innerHTML = `<i class="fas ${gameState.opponentTeam.icon} fa-3x"></i>`;
        }
        opponentTeamLogo.style.color = getTeamColor(gameState.opponentTeam.color);
        opponentTeamName.textContent = gameState.opponentTeam.shortName;
        opponentScore.textContent = `${gameState.opponentRuns}/${gameState.opponentWickets}`;
        
        // Set animal bowler icon
        const animalBowler = document.getElementById('animal-bowler');
        if (animalBowler) {
            animalBowler.innerHTML = `<i class="fas fa-baseball-ball fa-4x"></i>`;
            animalBowler.style.color = getTeamColor(gameState.opponentTeam.color);
        }
        
        // Decide who bats first (coin toss)
        gameState.isPlayerBatting = Math.random() >= 0.5;
        
        // Show gameplay screen
        showScreen(gameplayScreen);
        
        // Update commentary
        if (gameState.isPlayerBatting) {
            updateCommentary(`The ${gameState.playerTeam.name} won the toss and elected to bat first!`);
        } else {
            updateCommentary(`The ${gameState.opponentTeam.name} won the toss and will bat first!`);
            
            // If opponent bats first, swap the icon colors
            if (animalBatsman) animalBatsman.style.color = getTeamColor(gameState.opponentTeam.color);
            if (animalBowler) animalBowler.style.color = getTeamColor(gameState.playerTeam.color);
            
            // If opponent bats first, simulate their innings
            simulateOpponentInnings();
        }
    }
    
    function getTeamColor(color) {
        // Convert team color name to a CSS color
        const colorMap = {
            'yellow': '#FBBF24',
            'blue': '#3B82F6',
            'red': '#EF4444',
            'purple': '#8B5CF6',
            'orange': '#F97316',
            'pink': '#EC4899'
        };
        return colorMap[color] || '#FFFFFF';
    }
    
    function updateCommentary(text) {
        commentaryText.textContent = text;
    }
    
    function updateScoreDisplay() {
        if (gameState.isPlayerBatting) {
            playerScore.textContent = `${gameState.playerRuns}/${gameState.playerWickets}`;
        } else {
            opponentScore.textContent = `${gameState.opponentRuns}/${gameState.opponentWickets}`;
        }
        
        currentOver.textContent = `Over: ${gameState.currentOver}.${gameState.currentBall}`;
    }
    
    function playShot(shotType) {
        // Disable buttons during animation
        disableShotButtons();
        
        // Set the active class on the clicked button
        const shotButtons = document.querySelectorAll('.shot-btn');
        shotButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.shot === shotType) {
                btn.classList.add('active');
            }
        });
        
        // Animate the ball and bat
        animateCricketAction(() => {
            // After animation, calculate result
            const result = calculateShotResult(shotType);
            
            // Apply the result
            applyResult(result);
            
            // Check if the over/innings/match is complete
            checkGameProgress();
            
            // Re-enable buttons if game is still on
            if (gameState.gamePhase !== 'game-over') {
                enableShotButtons();
            }
        });
    }
    
    function animateCricketAction(callback) {
        // For 3D rendering, use the stadium3D object if available
        if (window.stadium3D && window.stadium3D.isLoaded) {
            // Get the shot type from the last clicked button
            const activeShot = document.querySelector('.shot-btn.active')?.dataset?.shot || 'straight';
            
            // Check if we're bowling or batting
            if (gameState.isPlayerBatting) {
                // Bowl the ball first, then wait to play the shot
                window.stadium3D.bowlBall();
                
                // After delay, play the shot
                setTimeout(() => {
                    window.stadium3D.playShot(activeShot);
                    
                    // Execute callback after animation completes
                    setTimeout(callback, 2000);
                }, 1000);
            } else {
                // We're bowling, just animate the bowl
                window.stadium3D.bowlBall();
                
                // Execute callback after animation completes
                setTimeout(callback, 1000);
            }
            return;
        }
        
        // Fallback to 2D animation if 3D not available
        // Show animal characters if they exist
        const batsman = document.getElementById('animal-batsman');
        const bowler = document.getElementById('animal-bowler');
        
        if (batsman) batsman.classList.remove('hidden');
        if (bowler) bowler.classList.remove('hidden');
        
        // Show ball and bat
        if (ball) ball.classList.remove('hidden');
        if (bat) bat.classList.remove('hidden');
        
        // Position ball at bowler's end
        if (ball) {
            ball.style.bottom = '0';
            ball.style.left = '50%';
            ball.style.transform = 'translateX(-50%)';
        }
        
        // Position bat at batsman's end
        if (bat) {
            bat.style.bottom = '50%';
            bat.style.left = '50%';
            bat.style.transform = 'translateX(-50%) rotate(45deg)';
        }
        
        // Add ball trail effect
        if (ball) addBallTrailEffect();
        
        // Bowler animation
        if (bowler) bowler.classList.add('bowling-action');
        
        // Animate ball coming in
        setTimeout(() => {
            if (!ball) {
                callback();
                return;
            }
            
            ball.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            ball.style.bottom = '50%';
            
            // Ball spin animation
            const randomSpin = Math.random() > 0.5 ? 'spin-clockwise' : 'spin-counterclockwise';
            ball.classList.add(randomSpin);
            
            // Add camera shake effect to stadium
            setTimeout(() => {
                if (stadium) stadium.classList.add('camera-shake');
                
                // Batsman animation
                if (batsman) batsman.classList.add('batting-action');
                
                // Bat swing with enhanced animation
                if (bat) {
                    bat.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    bat.style.transform = 'translateX(-50%) rotate(90deg) scale(1.2)';
                }
                
                // Play animal sound based on batting team
                if (gameState.isPlayerBatting) {
                    playAnimalSound(gameState.playerTeam.animal);
                } else {
                    playAnimalSound(gameState.opponentTeam.animal);
                }
                
                // Ball result direction (random)
                setTimeout(() => {
                    // Remove spin class
                    if (ball) ball.classList.remove('spin-clockwise', 'spin-counterclockwise');
                    
                    const randomDirection = Math.random() * 360;
                    const distance = 60 + Math.random() * 60;
                    
                    if (ball) {
                        ball.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                        ball.style.transform = `translateX(-50%) translate(${Math.cos(randomDirection) * distance}px, ${Math.sin(randomDirection) * distance}px)`;
                    }
                    
                    // Add trail to the ball
                    if (ball) createBallTrail(10);
                    
                    // Add crowd reaction
                    triggerCrowdReaction();
                    
                    // Remove camera shake
                    if (stadium) stadium.classList.remove('camera-shake');
                    
                    // Hide ball and bat after animation
                    setTimeout(() => {
                        if (ball) fadeOutElement(ball);
                        if (bat) fadeOutElement(bat);
                        
                        // Remove animations from animals
                        if (batsman) batsman.classList.remove('batting-action');
                        if (bowler) bowler.classList.remove('bowling-action');
                        
                        setTimeout(() => {
                            if (ball) ball.classList.add('hidden');
                            if (bat) bat.classList.add('hidden');
                            if (batsman) batsman.classList.add('hidden');
                            if (bowler) bowler.classList.add('hidden');
                            
                            if (ball) ball.style.transition = '';
                            if (bat) {
                                bat.style.transition = '';
                                bat.style.transform = 'translateX(-50%) rotate(45deg)';
                            }
                            
                            // Reset any added classes
                            if (ball) ball.classList.remove('spin-clockwise', 'spin-counterclockwise');
                            
                            // Execute callback
                            callback();
                        }, 400);
                    }, 700);
                }, 200);
            }, 600);
        }, 200);
    }
    
    function fadeOutElement(element) {
        element.style.transition = 'opacity 0.4s ease';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.opacity = '1';
        }, 500);
    }
    
    function addBallTrailEffect() {
        const trailCount = 5;
        
        // Clear any existing trails
        const existingTrails = document.querySelectorAll('.ball-trail');
        existingTrails.forEach(trail => trail.remove());
        
        for (let i = 0; i < trailCount; i++) {
            setTimeout(() => {
                const trail = document.createElement('div');
                trail.classList.add('ball-trail');
                trail.style.width = ball.offsetWidth + 'px';
                trail.style.height = ball.offsetHeight + 'px';
                trail.style.position = 'absolute';
                trail.style.borderRadius = '50%';
                trail.style.backgroundColor = 'rgba(255, 60, 60, 0.4)';
                trail.style.left = ball.style.left;
                trail.style.bottom = ball.style.bottom;
                trail.style.transform = ball.style.transform;
                trail.style.zIndex = '10';
                trail.style.animation = 'fadeOut 0.6s forwards';
                
                stadium.appendChild(trail);
                
                // Remove trail after animation
                setTimeout(() => {
                    trail.remove();
                }, 600);
            }, i * 100);
        }
    }
    
    function createBallTrail(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const trail = document.createElement('div');
                trail.classList.add('ball-trail');
                trail.style.width = ball.offsetWidth * (1 - i/count * 0.8) + 'px';
                trail.style.height = ball.offsetHeight * (1 - i/count * 0.8) + 'px';
                trail.style.position = 'absolute';
                trail.style.borderRadius = '50%';
                trail.style.backgroundColor = 'rgba(255, 60, 60, ' + (0.5 - i/count * 0.5) + ')';
                trail.style.left = (ball.offsetLeft - (trail.offsetWidth - ball.offsetWidth)/2) + 'px';
                trail.style.top = (ball.offsetTop - (trail.offsetHeight - ball.offsetHeight)/2) + 'px';
                trail.style.zIndex = '10';
                
                stadium.appendChild(trail);
                
                // Animate and remove trail
                setTimeout(() => {
                    trail.style.transition = 'opacity 0.4s ease';
                    trail.style.opacity = '0';
                    
                    setTimeout(() => {
                        trail.remove();
                    }, 400);
                }, 200);
            }, i * 50);
        }
    }
    
    function triggerCrowdReaction() {
        const crowdPersons = document.querySelectorAll('.crowd-person');
        crowdPersons.forEach(person => {
            // Random jump animation
            person.style.transition = 'transform 0.3s ease';
            person.style.transform = `translateY(-${Math.random() * 10 + 5}px)`;
            
            setTimeout(() => {
                person.style.transform = 'translateY(0)';
            }, Math.random() * 500 + 300);
        });
        
        // Randomly play animal crowd sounds
        const animalSounds = ['roar', 'trumpet', 'chatter', 'screech', 'bark'];
        const randomSound = animalSounds[Math.floor(Math.random() * animalSounds.length)];
        playAnimalSound(randomSound, 0.3); // Play at lower volume
    }
    
    function playAnimalSound(animal, volume = 1.0) {
        // In a future enhancement, actual sound effects can be added
        console.log(`Playing ${animal} sound at volume ${volume}`);
    }
    
    function calculateShotResult(shotType) {
        // Base probabilities
        let boundary6Probability = 0.1;
        let boundary4Probability = 0.2;
        let runsProbability = 0.4;
        let dotProbability = 0.2;
        let wicketProbability = 0.1;
        
        // Adjust probabilities based on shot type
        switch (shotType) {
            case 'defensive':
                boundary6Probability = 0.01;
                boundary4Probability = 0.05;
                runsProbability = 0.3;
                dotProbability = 0.54;
                wicketProbability = 0.1;
                break;
            case 'drive':
                boundary6Probability = 0.1;
                boundary4Probability = 0.3;
                runsProbability = 0.4;
                dotProbability = 0.1;
                wicketProbability = 0.1;
                break;
            case 'sweep':
                boundary6Probability = 0.15;
                boundary4Probability = 0.25;
                runsProbability = 0.3;
                dotProbability = 0.1;
                wicketProbability = 0.2;
                break;
            case 'pull':
                boundary6Probability = 0.2;
                boundary4Probability = 0.25;
                runsProbability = 0.25;
                dotProbability = 0.1;
                wicketProbability = 0.2;
                break;
            case 'hook':
                boundary6Probability = 0.25;
                boundary4Probability = 0.2;
                runsProbability = 0.2;
                dotProbability = 0.1;
                wicketProbability = 0.25;
                break;
            case 'helicopter':
                boundary6Probability = 0.4;
                boundary4Probability = 0.15;
                runsProbability = 0.15;
                dotProbability = 0.05;
                wicketProbability = 0.25;
                break;
        }
        
        // Adjust probabilities based on team strength (if player is batting)
        if (gameState.isPlayerBatting) {
            const strengthDiff = (gameState.playerTeam.strength - gameState.opponentTeam.strength) / 100;
            boundary6Probability += strengthDiff * 0.1;
            boundary4Probability += strengthDiff * 0.1;
            wicketProbability -= strengthDiff * 0.1;
        }
        
        // Generate random outcome based on probabilities
        const random = Math.random();
        let outcome;
        
        if (random < wicketProbability) {
            outcome = 'wicket';
        } else if (random < wicketProbability + dotProbability) {
            outcome = 'dot';
        } else if (random < wicketProbability + dotProbability + runsProbability) {
            // Determine number of runs (1, 2, or 3)
            const runsRandom = Math.random();
            if (runsRandom < 0.6) {
                outcome = 'runs1';
            } else if (runsRandom < 0.9) {
                outcome = 'runs2';
            } else {
                outcome = 'runs3';
            }
        } else if (random < wicketProbability + dotProbability + runsProbability + boundary4Probability) {
            outcome = 'boundary4';
        } else {
            outcome = 'boundary6';
        }
        
        return outcome;
    }
    
    function applyResult(result) {
        let commentary = '';
        let runs = 0;
        
        // Process the result
        switch (result) {
            case 'wicket':
                commentary = getRandomCommentary('wicket');
                if (gameState.isPlayerBatting) {
                    gameState.playerWickets++;
                } else {
                    gameState.opponentWickets++;
                }
                // Create visual wicket effect
                createFireworks('red');
                break;
                
            case 'dot':
                commentary = getRandomCommentary('dot');
                break;
                
            case 'runs1':
                commentary = "Good shot! They take a single.";
                runs = 1;
                break;
                
            case 'runs2':
                commentary = "Well played! They run back for TWO!";
                runs = 2;
                break;
                
            case 'runs3':
                commentary = "Excellent running! That's THREE RUNS!";
                runs = 3;
                break;
                
            case 'boundary4':
                commentary = getRandomCommentary('boundary4');
                runs = 4;
                // Create visual boundary effect
                createFireworks('blue');
                break;
                
            case 'boundary6':
                commentary = getRandomCommentary('boundary6');
                runs = 6;
                // Create visual six effect
                createFireworks('gold');
                break;
        }
        
        // Add runs to the score
        if (gameState.isPlayerBatting) {
            gameState.playerRuns += runs;
        } else {
            gameState.opponentRuns += runs;
        }
        
        // Update the commentary
        updateCommentary(commentary);
        
        // Update the score display
        updateScoreDisplay();
        
        // Move to next ball
        gameState.currentBall++;
        if (gameState.currentBall === 6) {
            gameState.currentBall = 0;
            gameState.currentOver++;
        }
    }
    
    function getRandomCommentary(type) {
        const templates = commentaryTemplates[type];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    function checkGameProgress() {
        // Check if innings is over (all overs bowled or all wickets lost)
        const isInningsOver = gameState.currentOver >= gameState.totalOvers || 
                              (gameState.isPlayerBatting && gameState.playerWickets >= 10) ||
                              (!gameState.isPlayerBatting && gameState.opponentWickets >= 10);
        
        // Check if chase target achieved
        const isTargetAchieved = gameState.gamePhase === 'second-innings' && 
                                ((gameState.isPlayerBatting && gameState.playerRuns > gameState.target) ||
                                 (!gameState.isPlayerBatting && gameState.opponentRuns > gameState.target));
        
        if (isTargetAchieved || isInningsOver) {
            if (gameState.gamePhase === 'first-innings') {
                // First innings over, switch to second innings
                endFirstInnings();
            } else {
                // Game over, show result
                endMatch();
            }
        }
    }
    
    function endFirstInnings() {
        // Set target for second innings
        if (gameState.isPlayerBatting) {
            gameState.target = gameState.playerRuns;
            updateCommentary(`First innings complete! ${gameState.opponentTeam.name} needs ${gameState.target + 1} runs to win.`);
            
            // Switch to opponent batting
            gameState.isPlayerBatting = false;
            
            // Reset innings-specific state
            gameState.currentBall = 0;
            gameState.currentOver = 0;
            
            // Update game phase
            gameState.gamePhase = 'second-innings';
            
            // Simulate opponent chase
            setTimeout(simulateOpponentInnings, 2000);
        } else {
            gameState.target = gameState.opponentRuns;
            updateCommentary(`First innings complete! ${gameState.playerTeam.name} needs ${gameState.target + 1} runs to win.`);
            
            // Switch to player batting
            gameState.isPlayerBatting = true;
            
            // Reset innings-specific state
            gameState.currentBall = 0;
            gameState.currentOver = 0;
            
            // Update game phase
            gameState.gamePhase = 'second-innings';
        }
        
        // Update score display
        updateScoreDisplay();
    }
    
    function simulateOpponentInnings() {
        // Disable player controls during simulation
        disableShotButtons();
        
        // Define simulation interval
        const simulationInterval = setInterval(() => {
            // Simulate a random shot
            const shotTypes = ['defensive', 'drive', 'sweep', 'pull', 'hook', 'helicopter'];
            const randomShot = shotTypes[Math.floor(Math.random() * shotTypes.length)];
            
            // Animate and calculate result
            animateCricketAction(() => {
                const result = calculateShotResult(randomShot);
                applyResult(result);
                
                // Check if innings/match is over
                const isInningsOver = gameState.currentOver >= gameState.totalOvers || gameState.opponentWickets >= 10;
                const isTargetAchieved = gameState.gamePhase === 'second-innings' && gameState.opponentRuns > gameState.target;
                
                if (isInningsOver || isTargetAchieved) {
                    clearInterval(simulationInterval);
                    
                    if (gameState.gamePhase === 'first-innings') {
                        endFirstInnings();
                    } else {
                        endMatch();
                    }
                }
            });
        }, 3000); // Simulate a ball every 3 seconds
    }
    
    function endMatch() {
        // Determine winner
        let resultMessage = '';
        let isPlayerWinner = false;
        
        if (gameState.gamePhase === 'second-innings') {
            // Chase completed
            if (gameState.isPlayerBatting) {
                if (gameState.playerRuns > gameState.target) {
                    // Player won
                    resultMessage = `${gameState.playerTeam.name} wins by ${10 - gameState.playerWickets} wickets!`;
                    isPlayerWinner = true;
                } else if (gameState.playerRuns === gameState.target) {
                    // Tie
                    resultMessage = "It's a tie! What an incredible match!";
                } else {
                    // Opponent won
                    resultMessage = `${gameState.opponentTeam.name} wins by ${gameState.target - gameState.playerRuns} runs!`;
                }
            } else {
                if (gameState.opponentRuns > gameState.target) {
                    // Opponent won
                    resultMessage = `${gameState.opponentTeam.name} wins by ${10 - gameState.opponentWickets} wickets!`;
                } else if (gameState.opponentRuns === gameState.target) {
                    // Tie
                    resultMessage = "It's a tie! What an incredible match!";
                } else {
                    // Player won
                    resultMessage = `${gameState.playerTeam.name} wins by ${gameState.target - gameState.opponentRuns} runs!`;
                    isPlayerWinner = true;
                }
            }
        }
        
        // Update game phase
        gameState.gamePhase = 'game-over';
        
        // Display the result
        resultTitle.textContent = isPlayerWinner ? "Victory!" : "Match ended!";
        resultDetails.textContent = resultMessage;
        
        // Set result icon
        if (resultIcon) {
            const iconElement = resultIcon.querySelector('i') || document.createElement('i');
            
            if (isPlayerWinner) {
                iconElement.className = 'fas fa-trophy fa-10x';
                resultIcon.style.color = getTeamColor(gameState.playerTeam.color);
                // Create celebration effect
                createManyFireworks();
            } else {
                iconElement.className = 'fas fa-medal fa-10x';
                resultIcon.style.color = getTeamColor(gameState.opponentTeam.color);
            }
            
            if (!resultIcon.contains(iconElement)) {
                resultIcon.appendChild(iconElement);
            }
        }
        
        // Show result screen
        showScreen(resultScreen);
    }
    
    function disableShotButtons() {
        shotButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
        });
    }
    
    function enableShotButtons() {
        shotButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    }
    
    function resetGame() {
        // Reset game state
        gameState = {
            playerTeam: null,
            opponentTeam: null,
            playerRuns: 0,
            playerWickets: 0,
            opponentRuns: 0,
            opponentWickets: 0,
            currentBall: 0,
            currentOver: 0,
            totalOvers: 5,
            isPlayerBatting: true,
            target: 0,
            gamePhase: 'first-innings',
        };
        
        // Go back to welcome screen
        showScreen(welcomeScreen);
    }
    
    function createFireworks(color) {
        const count = color === 'gold' ? 30 : 15;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.classList.add('fireworks');
                firework.style.backgroundColor = color;
                
                // Random position
                const x = Math.random() * stadium.offsetWidth;
                const y = Math.random() * stadium.offsetHeight;
                firework.style.left = `${x}px`;
                firework.style.top = `${y}px`;
                
                // Add glow effect
                firework.style.boxShadow = `0 0 20px 5px ${color}`;
                
                stadium.appendChild(firework);
                
                // Create small particle explosion around firework
                createFireworkParticles(x, y, color);
                
                // Remove firework after animation
                setTimeout(() => {
                    stadium.removeChild(firework);
                }, 1000);
            }, i * 100);
        }
        
        // Trigger crowd reaction for fireworks
        triggerCrowdReaction();
    }
    
    function createFireworkParticles(x, y, color) {
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('firework-particle');
            particle.style.position = 'absolute';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.boxShadow = `0 0 10px 2px ${color}`;
            
            // Set random direction
            const angle = (i / particleCount) * 2 * Math.PI;
            const distance = 30 + Math.random() * 20;
            
            // Animate particle
            particle.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
            setTimeout(() => {
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.5)`;
                particle.style.opacity = '0';
            }, 10);
            
            stadium.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }
    
    function createManyFireworks() {
        const colors = ['#ff4136', '#ffdc00', '#0074d9', '#2ecc40', '#b10dc9', '#ff851b'];
        for (let i = 0; i < 120; i++) {
            setTimeout(() => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                createFireworks(randomColor);
            }, i * 150);
        }
        
        // Create confetti
        createConfetti(300);
    }
    
    function createConfetti(count) {
        const confettiColors = ['#ff4136', '#ffdc00', '#0074d9', '#2ecc40', '#b10dc9', '#ff851b'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                
                confetti.style.position = 'absolute';
                confetti.style.width = `${Math.random() * 10 + 5}px`;
                confetti.style.height = `${Math.random() * 4 + 2}px`;
                confetti.style.backgroundColor = color;
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.top = '-20px';
                confetti.style.opacity = Math.random() * 0.6 + 0.4;
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                confetti.style.zIndex = '999';
                
                document.body.appendChild(confetti);
                
                // Animate confetti falling
                confetti.style.transition = `all ${Math.random() * 3 + 2}s linear`;
                setTimeout(() => {
                    confetti.style.top = `${Math.random() * 100 + 100}%`;
                    confetti.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 200 - 100}px)`;
                    confetti.style.opacity = '0';
                }, 10);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, Math.random() * 5000);
        }
    }
}); 