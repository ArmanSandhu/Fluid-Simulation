class Simulation {
    constructor() {
        this.particles = [];
        this.PARTICLE_COUNT = 1500;
        this.VELOCITY_DAMPING = 1;
        this.GRAVITY = new Vector2(0, 1);
        this.REST_DENSITY = 10;
        this.K_NEAR = 3;
        // The smaller K value the higher particle attraction force.
        this.K = 0.15;
        this.INTERACTION_RADIUS = 25;
        // Viscosity Parameters
        this.SIGMA = 0.5;
        this.BETA = 0.03;

        this.fluidhashgrid = new FluidHashGrid(this.INTERACTION_RADIUS);
        this.initializeParticles();
        this.fluidhashgrid.initializeParticles(this.particles);
    }

    initializeParticles() {
        let particleOffset = 10;
        let globalOffset = new Vector2(750, 100);
        let currParticleCount = Math.sqrt(this.PARTICLE_COUNT);

        for (let x = 0; x < currParticleCount; x++) {
            for (let y = 0; y < currParticleCount; y++) {
                let currPosition = new Vector2(x * particleOffset + globalOffset.x, y * particleOffset + globalOffset.y);
                let newParticle = new Particle(currPosition);
                //newParticle.velocity = Scale(new Vector2(-0.5 + Math.random(), -0.5 + Math.random()), 200);
                this.particles.push(newParticle);
            }
        }
    }

    update(deltaTime) {
        this.applyGravity(deltaTime);
        this.addViscosity(deltaTime);
        // First move the particles based on their current predicted path.
        this.predictPositions(deltaTime);
        this.neighbourSearch();
        this.doubleDensityRelaxation(deltaTime);
        // If any particles reach the boundaries of our canvas, make sure they bounce back.
        this.checkBoundary();
        // Adjust the speed of the particles.
        this.computeNextVelocity(deltaTime);
    }

    draw(){
        for (let i = 0; i < this.particles.length; i++) {
            let position = this.particles[i].position;
            let color = this.particles[i].color;
            DrawUtils.drawPoint(position, 5, color);
        }
    }

    // This method loops through all the particles and saves their previous positions and updates the next postion.
    predictPositions(deltaTime) {
        for(let i = 0; i < this.particles.length; i++) {
            // Save the previous position
            this.particles[i].prevPosition = this.particles[i].position.Cpy();
            let nextPosition = Scale(this.particles[i].velocity, deltaTime * this.VELOCITY_DAMPING);
            // Advance to the next possible position
            this.particles[i].position = Add(this.particles[i].position, nextPosition)
        }
    }

    // This method loops through all the particles and predicts their new velocity.
    computeNextVelocity(deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            let velocity = Scale(Subtract(this.particles[i].position, this.particles[i].prevPosition), 1.0 / deltaTime);
            this.particles[i].velocity = velocity;
        }
    }

    checkBoundary() {
        for (let i = 0; i < this.particles.length; i++) {
            let position = this.particles[i].position;
            
            if (position.x < 0) {
                this.particles[i].position.x = 0;
                this.particles[i].prevPosition.x = 0;
            }
            if (position.y < 0) {
                this.particles[i].position.y = 0;
                this.particles[i].prevPosition.y = 0;
            }
        
            if (position.x > canvas.width) {
                this.particles[i].position.x = canvas.width - 1;
                this.particles[i].prevPosition.x = canvas.width - 1;
            }
            if (position.y > canvas.height) {
                this.particles[i].position.y = canvas.height - 1;
                this.particles[i].prevPosition.y = canvas.height - 1;
            }
            
        }
    }

    applyGravity(deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].velocity = Add(this.particles[i].velocity, Scale(this.GRAVITY, deltaTime));
        }
    }

    neighbourSearch() {
        this.fluidhashgrid.clearGrid();
        this.fluidhashgrid.mapParticlesToCell();
    }

    doubleDensityRelaxation(deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            let density = 0;
            let nearDensity = 0;
            let neighbours = this.fluidhashgrid.getNeighbourOfParticleAtIndex(i);
            let currParticle = this.particles[i];

            // Compute Density and Near Density
            for (let j = 0; j < neighbours.length; j++) {
                let currNeighbour = neighbours[j];
                if (currParticle == currNeighbour) continue;
                let gradient = Subtract(currNeighbour.position, currParticle.position);
                let q = gradient.Length() / this.INTERACTION_RADIUS;

                if (q < 1.0) {
                    density += Math.pow((1 - q), 2);
                    nearDensity += Math.pow((1 - q), 3);
                }
            }

            // Compute Pressure and Near Pressure
            let pressure = this.K * (density - this.REST_DENSITY);
            let pressureNear = this.K_NEAR * nearDensity;
            let currParticleDisplacement = Vector2.Zero();
            
            for (let j = 0; j < neighbours.length; j++) {
                let currNeighbour = neighbours[j];
                if (currParticle == currNeighbour) continue;
                let gradient = Subtract(currNeighbour.position, currParticle.position);
                let q = gradient.Length() / this.INTERACTION_RADIUS;

                if (q < 1.0) {
                    gradient.Normalize()
                    let displacementTerm = Math.pow(deltaTime, 2) * (pressure * (1 - q) + pressureNear * Math.pow((1 - q), 2));
                    let displacement = Scale(gradient, displacementTerm);
                    currNeighbour.position = Add(currNeighbour.position, Scale(displacement, 0.5));
                    currParticleDisplacement = Subtract(currParticleDisplacement, Scale(displacement, 0.5));
                }
            }

            currParticle.position = Add(currParticle.position, currParticleDisplacement);
        }
    }

    addViscosity(deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            let neighbours = this.fluidhashgrid.getNeighbourOfParticleAtIndex(i);
            let currParticle = this.particles[i];

            for (let j = 0; j < neighbours.length; j++) {
                let currNeighbour = neighbours[j];
                if (currParticle == currNeighbour) continue;
                
                let gradient = Subtract(currNeighbour.position, currParticle.position);
                let currParticleVelocity = currParticle.velocity;
                let currNeighbourVelocity = currNeighbour.velocity;

                let q = gradient.Length() / this.INTERACTION_RADIUS;

                if (q < 1.0) {
                    gradient.Normalize()
                    let inwardRadialVelocity = Subtract(currParticleVelocity, currNeighbourVelocity).Dot(gradient);
                    
                    if (inwardRadialVelocity > 0) {
                        let impulseTerm = deltaTime * (1 - q) * (this.SIGMA * inwardRadialVelocity + this.BETA * inwardRadialVelocity * inwardRadialVelocity);
                        let impulse = Scale(gradient, impulseTerm);

                        currNeighbour.velocity = Add(currNeighbour.velocity, Scale(impulse, 0.5));
                        currParticle.velocity = Subtract(currParticle.velocity, Scale(impulse, 0.5));
                    }
                }
            }
        }
    }
}