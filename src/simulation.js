class Simulation {
    constructor() {
        this.particles = [];
        this.PARTICLE_COUNT = 1000;
        this.VELOCITY_DAMPING = 1;

        this.initializeParticles();
    }

    initializeParticles() {
        let particleOffset = 20;
        let globalOffset = new Vector2(750, 100);
        let currParticleCount = Math.sqrt(this.PARTICLE_COUNT);

        for (let x = 0; x < currParticleCount; x++) {
            for (let y = 0; y < currParticleCount; y++) {
                let currPosition = new Vector2(x * particleOffset + globalOffset.x, y * particleOffset + globalOffset.y);
                let newParticle = new Particle(currPosition);
                newParticle.velocity = Scale(new Vector2(-0.5 + Math.random(), -0.5 + Math.random()), 200);
                this.particles.push(newParticle);
            }
        }
    }

    update(deltaTime) {
        this.predictPositions(deltaTime);
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
}