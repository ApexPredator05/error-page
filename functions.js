// Enhanced Retro Gaming Lab 404 Page - JavaScript Animations & Interactions

class RetroLab404Controller {
    constructor() {
        // Animation settings from provided data
        this.animationSettings = {
            starfieldSpeed: [1, 2, 3],
            robotIdleInterval: 3000,
            particleCount: 50,
            dnaRotationSpeed: 8000,
            glitchFrequency: 8000
        };

        // Robot behaviors from provided data
        this.robotBehaviors = [
            {action: "blink", duration: 500, sound: "beep"},
            {action: "dance", duration: 2000, sound: "boogie"},
            {action: "spin", duration: 1500, sound: "whir"},
            {action: "confused", duration: 3000, sound: "error"},
            {action: "celebrate", duration: 2500, sound: "success"}
        ];

        // Particle effects configuration
        this.particleEffects = [
            {type: "sparks", color: "#FFD700", speed: "fast"},
            {type: "bubbles", color: "#00BFFF", speed: "slow"},
            {type: "smoke", color: "#666", speed: "medium"},
            {type: "dna", color: "#00FF7F", speed: "slow"}
        ];

        // Robot speech jokes
        this.robotJokes = [
            "Error 404: My patience not found!",
            "I'm not broken, I'm just... creatively malfunctioning!",
            "Beep boop! Have you tried turning reality off and on again?",
            "My circuits are experiencing a humor overload!",
            "Warning: Sarcasm levels at maximum capacity!",
            "I speak fluent binary... 01001000 01101001!",
            "Does not compute... but I'll pretend it does!",
            "My AI is so advanced, I make mistakes on purpose!",
            "Syntax Error: Life.exe has stopped working",
            "I'm not programmed for this level of chaos!",
            "Calculating... Still calculating... Maybe try DNA repair?",
            "My molecular analysis says: This page is definitely missing!",
            "Lab Report: 99.9% chance of user confusion detected!"
        ];

        // Game state
        this.clickCount = 0;
        this.dnaRepairCount = 0;
        this.gameLevel = 1;
        this.gameScore = 0;
        this.sequence = [];
        this.playerSequence = [];
        this.sequenceIndex = 0;
        this.achievementsUnlocked = new Set();
        
        // Konami code
        this.konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        this.konamiIndex = 0;
        this.secretModeActive = false;

        // Canvas and particles
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        
        // Animation frame tracking
        this.animationFrame = null;
        this.lastTime = 0;
        
        // Performance monitoring
        this.isTabVisible = true;
        this.isMobile = window.innerWidth < 768;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.initializeAnimations();
        this.startParticleSystem();
        this.startRobotBehaviors();
        this.initializeSequenceGame();
        this.setupPerformanceOptimizations();
        this.startGlitchEffects();
        this.animateProgressBars();
        this.startDigitAnimation();
        this.checkTimeOfDay();
        
        console.log('🤖 Retro Lab 404 Controller initialized!');
    }

    // Canvas and Particle System
    setupCanvas() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, type = 'spark') {
        const effect = this.particleEffects.find(e => e.type === type) || this.particleEffects[0];
        
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * (effect.speed === 'fast' ? 4 : effect.speed === 'slow' ? 1 : 2),
            vy: (Math.random() - 0.5) * (effect.speed === 'fast' ? 4 : effect.speed === 'slow' ? 1 : 2),
            size: Math.random() * 3 + 1,
            color: effect.color,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.01,
            type: type
        };
    }

    startParticleSystem() {
        const animate = (currentTime) => {
            if (!this.isTabVisible) {
                this.animationFrame = requestAnimationFrame(animate);
                return;
            }

            const deltaTime = currentTime - this.lastTime;
            if (deltaTime > 16) { // Limit to ~60fps
                this.updateParticles();
                this.renderParticles();
                this.lastTime = currentTime;
            }
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate(0);
        
        // Add particles periodically
        setInterval(() => {
            if (this.particles.length < this.animationSettings.particleCount && this.isTabVisible) {
                const type = this.particleEffects[Math.floor(Math.random() * this.particleEffects.length)].type;
                this.particles.push(this.createParticle(null, null, type));
            }
        }, 2000);
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= particle.decay;
            
            // Special behaviors for different particle types
            if (particle.type === 'bubbles') {
                particle.vy -= 0.02; // Float upward
            } else if (particle.type === 'smoke') {
                particle.vx *= 0.99; // Gradual slowdown
                particle.vy -= 0.01;
            } else if (particle.type === 'dna') {
                particle.x += Math.sin(particle.y * 0.01) * 0.5; // Wavy motion
            }
            
            return particle.alpha > 0 && 
                   particle.x > -10 && particle.x < this.canvas.width + 10 &&
                   particle.y > -10 && particle.y < this.canvas.height + 10;
        });
    }

    renderParticles() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            
            if (particle.type === 'sparks') {
                // Sparkly effect
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 10;
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            } else if (particle.type === 'bubbles') {
                // Bubble effect
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = 1;
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.stroke();
            } else if (particle.type === 'dna') {
                // DNA helix particle
                this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, 
                                particle.size, particle.size);
                this.ctx.fillRect(particle.x - particle.size/2 + 3, particle.y - particle.size/2, 
                                1, particle.size);
            } else {
                // Default particle
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            }
            
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    // Robot Animations and Behaviors
    startRobotBehaviors() {
        const robots = document.querySelectorAll('.robot');
        
        robots.forEach((robot, index) => {
            // Random idle animations
            setInterval(() => {
                if (!robot.classList.contains('dancing') && 
                    !robot.classList.contains('spinning') && 
                    !robot.classList.contains('confused') &&
                    !robot.classList.contains('celebrating')) {
                    this.performRandomRobotAction(robot);
                }
            }, this.animationSettings.robotIdleInterval + (index * 1000));

            // Click interactions
            robot.addEventListener('click', () => this.handleRobotClick(robot));
        });

        // Auto speech bubbles
        setInterval(() => {
            if (Math.random() < 0.3) {
                const randomRobot = robots[Math.floor(Math.random() * robots.length)];
                this.showRobotSpeech(randomRobot);
            }
        }, 8000);
    }

    performRandomRobotAction(robot) {
        const actions = ['blink', 'confused'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        if (action === 'blink') {
            this.blinkRobotEyes(robot);
        } else if (action === 'confused') {
            this.makeRobotConfused(robot);
        }
    }

    handleRobotClick(robot) {
        const behavior = this.robotBehaviors[Math.floor(Math.random() * this.robotBehaviors.length)];
        
        this.incrementClickCount();
        this.performRobotBehavior(robot, behavior);
        this.showRobotSpeech(robot);
        this.createParticleExplosion(robot);
    }

    performRobotBehavior(robot, behavior) {
        // Remove existing behavior classes
        this.robotBehaviors.forEach(b => robot.classList.remove(b.action));
        
        // Add new behavior
        robot.classList.add(behavior.action);
        
        // Play sound effect (visual indicator)
        this.showSoundEffect(behavior.sound);
        
        // Remove behavior after duration
        setTimeout(() => {
            robot.classList.remove(behavior.action);
        }, behavior.duration);
    }

    blinkRobotEyes(robot) {
        const eyes = robot.querySelectorAll('.robot-eye');
        eyes.forEach(eye => {
            eye.style.animation = 'none';
            setTimeout(() => {
                eye.style.animation = 'robot-blink 3s ease-in-out infinite';
            }, 100);
        });
    }

    makeRobotConfused(robot) {
        robot.classList.add('confused');
        setTimeout(() => {
            robot.classList.remove('confused');
        }, 3000);
    }

    showRobotSpeech(robot) {
        const speechBubble = robot.querySelector('.speech-bubble');
        const speechText = robot.querySelector('.speech-text');
        
        if (speechBubble && speechText) {
            const randomJoke = this.robotJokes[Math.floor(Math.random() * this.robotJokes.length)];
            speechText.textContent = randomJoke;
            
            speechBubble.classList.remove('hidden');
            
            setTimeout(() => {
                speechBubble.classList.add('hidden');
            }, 4000);
        }
    }

    showSoundEffect(sound) {
        const indicator = document.createElement('div');
        indicator.className = 'sound-indicator';
        indicator.textContent = `♪ ${sound.toUpperCase()}`;
        indicator.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 255, 0.8);
            color: black;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 12px;
            z-index: 1000;
            animation: sound-float 2s ease-out forwards;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }

    createParticleExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            const particle = this.createParticle(centerX, centerY, 'sparks');
            particle.vx = (Math.random() - 0.5) * 8;
            particle.vy = (Math.random() - 0.5) * 8;
            this.particles.push(particle);
        }
    }

    // DNA Helix Interactions
    setupEventListeners() {
        // DNA repair interactions
        const brokenBasePairs = document.querySelectorAll('.base-pair.broken');
        brokenBasePairs.forEach(pair => {
            pair.addEventListener('click', (e) => this.handleDNARepair(e.currentTarget));
        });

        // Sequence game
        const sequenceButtons = document.querySelectorAll('.sequence-button');
        sequenceButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleSequenceClick(e.currentTarget));
        });

        // Button interactions with particle effects
        const gameButtons = document.querySelectorAll('.game-btn');
        gameButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e.currentTarget));
            button.addEventListener('mouseenter', (e) => this.createButtonParticles(e.currentTarget));
        });

        // Modal controls
        document.getElementById('report-btn')?.addEventListener('click', () => this.showModal('incident-modal'));
        document.getElementById('home-btn')?.addEventListener('click', () => this.navigateHome());
        document.getElementById('retry-btn')?.addEventListener('click', () => this.restartExperience());
        document.getElementById('share-btn')?.addEventListener('click', () => this.shareResults());

        // Modal close
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e));
        });

        // Modal backdrop
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(e);
            });
        });

        // Form submissions
        document.querySelector('.incident-form')?.addEventListener('submit', (e) => this.handleIncidentReport(e));

        // Severity buttons
        document.querySelectorAll('.severity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSeveritySelection(e.currentTarget));
        });

        // Konami code
        document.addEventListener('keydown', (e) => this.handleKonamiInput(e));

        // Visibility API for performance
        document.addEventListener('visibilitychange', () => {
            this.isTabVisible = !document.hidden;
        });

        // Molecule interactions
        document.querySelectorAll('.atom').forEach(atom => {
            atom.addEventListener('click', () => this.handleAtomClick(atom));
        });
    }

    handleDNARepair(basePair) {
        if (!basePair.classList.contains('broken')) return;
        
        basePair.classList.remove('broken');
        basePair.classList.add('repaired');
        
        this.dnaRepairCount++;
        this.incrementClickCount();
        this.updateRepairProgress();
        this.createDNAParticles(basePair);
        
        if (this.dnaRepairCount >= 6) {
            this.completeDNASequence();
        }
    }

    updateRepairProgress() {
        const counter = document.getElementById('repair-count');
        const progressFill = document.querySelector('.repair-fill');
        
        if (counter) counter.textContent = this.dnaRepairCount;
        if (progressFill) {
            const percentage = (this.dnaRepairCount / 6) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    completeDNASequence() {
        this.showAchievement('DNA Sequence Restored!', 'You successfully repaired the genetic code!');
        this.triggerScreenShake();
        
        // Create massive particle explosion
        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle(
                window.innerWidth / 2, 
                window.innerHeight / 2, 
                'dna'
            ));
        }
    }

    createDNAParticles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const particle = this.createParticle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                'dna'
            );
            particle.vy = -Math.random() * 3 - 1;
            this.particles.push(particle);
        }
    }

    // Mini-Game: Sequence Matching
    initializeSequenceGame() {
        this.generateSequence();
        this.playSequence();
    }

    generateSequence() {
        const colors = ['red', 'blue', 'green', 'yellow'];
        this.sequence = [];
        
        for (let i = 0; i < this.gameLevel + 2; i++) {
            this.sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        }
    }

    playSequence() {
        const buttons = document.querySelectorAll('.sequence-button');
        
        this.sequence.forEach((color, index) => {
            setTimeout(() => {
                const button = document.querySelector(`[data-color="${color}"]`);
                if (button) {
                    button.classList.add('active');
                    setTimeout(() => button.classList.remove('active'), 300);
                }
            }, (index + 1) * 600);
        });
    }

    handleSequenceClick(button) {
        const color = button.dataset.color;
        this.playerSequence.push(color);
        
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 200);
        
        this.createParticleExplosion(button);
        
        if (this.playerSequence[this.sequenceIndex] !== this.sequence[this.sequenceIndex]) {
            this.gameOver();
            return;
        }
        
        this.sequenceIndex++;
        
        if (this.sequenceIndex >= this.sequence.length) {
            this.nextLevel();
        }
    }

    nextLevel() {
        this.gameLevel++;
        this.gameScore += this.gameLevel * 100;
        this.updateGameStats();
        
        this.showAchievement('Level Complete!', `Advanced to level ${this.gameLevel}!`);
        
        // Reset for next round
        setTimeout(() => {
            this.playerSequence = [];
            this.sequenceIndex = 0;
            this.generateSequence();
            this.playSequence();
        }, 2000);
    }

    gameOver() {
        this.playerSequence = [];
        this.sequenceIndex = 0;
        this.gameLevel = Math.max(1, this.gameLevel - 1);
        
        this.triggerScreenShake();
        setTimeout(() => this.playSequence(), 1000);
    }

    updateGameStats() {
        const levelElement = document.getElementById('game-level');
        const scoreElement = document.getElementById('game-score');
        
        if (levelElement) levelElement.textContent = this.gameLevel;
        if (scoreElement) scoreElement.textContent = this.gameScore;
    }

    // Button and UI Interactions
    handleButtonClick(button) {
        this.createButtonExplosion(button);
        this.incrementClickCount();
        
        // Button-specific actions handled in their own methods
    }

    createButtonParticles(button) {
        if (this.isMobile) return; // Reduce particles on mobile
        
        const rect = button.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const particle = this.createParticle(
                rect.left + Math.random() * rect.width,
                rect.top + Math.random() * rect.height,
                'sparks'
            );
            particle.decay *= 2; // Faster fade
            this.particles.push(particle);
        }
    }

    createButtonExplosion(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const particle = this.createParticle(centerX, centerY, 'sparks');
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Math.random() * 3 + 2;
            
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            this.particles.push(particle);
        }
    }

    // Animation Systems
    initializeAnimations() {
        this.animateTypingText();
        this.setupGlitchEffects();
        this.animateMolecularStructure();
    }

    animateTypingText() {
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animationDelay = `${index * 0.5}s`;
            }, index * 200);
        });
    }

    startDigitAnimation() {
        const digits = document.querySelectorAll('.digit');
        
        digits.forEach((digit, index) => {
            const targetValue = digit.dataset.target || '4';
            let currentValue = 0;
            
            const animate = () => {
                if (currentValue < parseInt(targetValue)) {
                    digit.textContent = currentValue;
                    currentValue++;
                    setTimeout(animate, 100 + Math.random() * 200);
                } else {
                    digit.textContent = targetValue;
                }
            };
            
            setTimeout(animate, index * 500);
        });
    }

    startGlitchEffects() {
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.triggerGlitchEffect();
            }
        }, this.animationSettings.glitchFrequency);
    }

    triggerGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = '';
            }, 50);
        });
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width || '0%';
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, Math.random() * 2000);
        });
    }

    animateMolecularStructure() {
        const atoms = document.querySelectorAll('.atom');
        
        atoms.forEach((atom, index) => {
            atom.addEventListener('mouseenter', () => {
                atom.style.transform = 'scale(1.3)';
                this.createParticleExplosion(atom);
            });
            
            atom.addEventListener('mouseleave', () => {
                atom.style.transform = 'scale(1)';
            });
        });
    }

    handleAtomClick(atom) {
        const element = atom.dataset.element;
        this.showElementInfo(element, atom);
        this.incrementClickCount();
    }

    showElementInfo(element, atomElement) {
        const info = {
            'C': 'Carbon - The building block of life!',
            'H': 'Hydrogen - The most abundant element!',
            'O': 'Oxygen - Essential for respiration!',
            'N': 'Nitrogen - Critical for protein synthesis!'
        };
        
        const tooltip = document.createElement('div');
        tooltip.className = 'element-tooltip';
        tooltip.textContent = info[element] || 'Unknown element';
        tooltip.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00FFFF;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            border: 1px solid #00FFFF;
            animation: tooltip-appear 0.3s ease-out;
        `;
        
        atomElement.style.position = 'relative';
        atomElement.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // Achievement System
    showAchievement(title, description) {
        const achievement = document.getElementById('achievement');
        if (!achievement) return;
        
        const titleElement = achievement.querySelector('.achievement-title');
        const descElement = achievement.querySelector('.achievement-desc');
        
        if (titleElement) titleElement.textContent = title;
        if (descElement) descElement.textContent = description;
        
        achievement.classList.remove('hidden');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            achievement.classList.add('hidden');
        }, 4000);
    }

    incrementClickCount() {
        this.clickCount++;
        const counter = document.getElementById('click-count');
        const xpFill = document.querySelector('.xp-fill');
        
        if (counter) counter.textContent = this.clickCount;
        
        // Update XP bar
        if (xpFill) {
            const xpPercentage = (this.clickCount % 10) * 10;
            xpFill.style.width = `${xpPercentage}%`;
        }
        
        // Check for achievements
        this.checkAchievements();
    }

    checkAchievements() {
        const achievements = [
            { id: 'first-click', threshold: 1, title: 'Lab Explorer!', desc: 'Made your first interaction!' },
            { id: 'curious-scientist', threshold: 10, title: 'Curious Scientist!', desc: 'Performed 10 experiments!' },
            { id: 'lab-veteran', threshold: 25, title: 'Lab Veteran!', desc: 'Conducted 25 experiments!' },
            { id: 'research-master', threshold: 50, title: 'Research Master!', desc: 'Achieved 50 interactions!' }
        ];
        
        achievements.forEach(achievement => {
            if (this.clickCount >= achievement.threshold && 
                !this.achievementsUnlocked.has(achievement.id)) {
                this.showAchievement(achievement.title, achievement.desc);
                this.achievementsUnlocked.add(achievement.id);
            }
        });
    }

    // Konami Code Easter Egg
    handleKonamiInput(e) {
        if (e.keyCode === this.konamiSequence[this.konamiIndex]) {
            this.konamiIndex++;
            if (this.konamiIndex === this.konamiSequence.length) {
                this.activateSecretMode();
                this.konamiIndex = 0;
            }
        } else {
            this.konamiIndex = 0;
        }
    }

    activateSecretMode() {
        if (this.secretModeActive) return;
        
        this.secretModeActive = true;
        const secretIndicator = document.getElementById('secret-mode');
        
        if (secretIndicator) {
            secretIndicator.classList.remove('hidden');
            
            // Apply secret mode effects
            document.body.classList.add('rainbow-mode');
            document.body.classList.add('super-speed');
            
            setTimeout(() => {
                document.body.classList.add('screen-invert');
            }, 1000);
            
            // Hide indicator after 5 seconds
            setTimeout(() => {
                secretIndicator.classList.add('hidden');
            }, 5000);
        }
        
        this.showAchievement('DEVELOPER MODE!', 'You unlocked the secret lab mode!');
        
        // Create massive particle celebration
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const particle = this.createParticle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    this.particleEffects[Math.floor(Math.random() * this.particleEffects.length)].type
                );
                this.particles.push(particle);
            }, i * 50);
        }
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(e) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    handleIncidentReport(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        this.showAchievement('Report Submitted!', 'Lab safety has been notified!');
        
        setTimeout(() => {
            this.closeModal(e);
        }, 1500);
    }

    handleSeveritySelection(button) {
        document.querySelectorAll('.severity-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    // Navigation and Social
    navigateHome() {
        this.triggerScreenShake();
        setTimeout(() => {
            window.location.href = '/';
        }, 500);
    }

    restartExperience() {
        location.reload();
    }

    shareResults() {
        const text = `I just survived a biotech lab disaster! 🧬⚗️ Interactions: ${this.clickCount}, DNA repairs: ${this.dnaRepairCount}, Game level: ${this.gameLevel}. Can you do better? #RetroLab404 #BiotechChallenge`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Retro Lab 404 Results',
                text: text,
                url: window.location.href
            });
        } else {
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            window.open(tweetUrl, '_blank');
        }
    }

    // Utility Effects
    triggerScreenShake() {
        document.body.classList.add('screen-shake');
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 500);
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Throttle animations on mobile
        if (this.isMobile) {
            this.animationSettings.particleCount = 25;
            this.animationSettings.robotIdleInterval *= 2;
        }
        
        // Reduce motion for users who prefer it
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.animationSettings.particleCount = 5;
            return;
        }
    }

    checkTimeOfDay() {
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour > 18;
        
        if (isNight) {
            document.body.style.setProperty('--retro-cyan', '#FF00FF');
            
            const nightMessage = document.createElement('div');
            nightMessage.textContent = '🌙 Night Lab Mode Active - Extra Spooky!';
            nightMessage.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 0, 255, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 1000;
                animation: slide-in-right 0.5s ease-out;
            `;
            
            document.body.appendChild(nightMessage);
            
            setTimeout(() => {
                nightMessage.remove();
            }, 5000);
        }
    }

    // Cleanup
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKonamiInput);
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
}

// Add required CSS animations dynamically
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes sound-float {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
    }
    
    @keyframes tooltip-appear {
        from { opacity: 0; transform: translateX(-50%) scale(0.8); }
        to { opacity: 1; transform: translateX(-50%) scale(1); }
    }
`;
document.head.appendChild(additionalStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.retroLab = new RetroLab404Controller();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.retroLab) {
        window.retroLab.isTabVisible = !document.hidden;
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.retroLab) {
        window.retroLab.destroy();
    }
});