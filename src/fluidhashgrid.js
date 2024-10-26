class FluidHashGrid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.hashmap = new Map();
        this.size = 10000000;
        this.firPrime = 6614058611;
        this.secPrime = 7528850467;
        this.particles = [];
    }

    initializeParticles(particles) {
        this.particles = particles;
    }

    clearGrid() {
        this.hashmap.clear();
    }

    getGridHashFromPosition(position) {
        let x = parseInt(position.x / this.cellSize);
        let y = parseInt(position.y / this.cellSize);

        return this.convertGridIndexToHash(x, y);
    }

    convertGridIndexToHash(x, y) {
        return (x * this.firPrime ^ y * this.secPrime) % this.size;
    }

    mapParticlesToCell() {
        for (let i = 0; i < this.particles.length; i++) {
            let position = this.particles[i].position;
            let hash = this.getGridHashFromPosition(position);

            let entries = this.hashmap.get(hash);

            if (entries == null) {
                let newArray = [this.particles[i]];
                this.hashmap.set(hash, newArray);
            } else {
                entries.push(this.particles[i]);
            }
        }
    }

    getContentsOfCell(hashId) {
        let contents = this.hashmap.get(hashId);

        if(contents == null){
            return [];
        }else{
            return contents;
        }
    }

    getNeighbourOfParticleAtIndex(index) {
        let neighbours = [];
        let position = this.particles[index].position;

        let particleGridx = parseInt(position.x / this.cellSize);
        let particleGridy = parseInt(position.y / this.cellSize);

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let currParticleGridx = particleGridx + x;
                let currParticleGridy = particleGridy + y;

                let hashId = this.convertGridIndexToHash(currParticleGridx, currParticleGridy);
                let content = this.getContentsOfCell(hashId);

                neighbours.push(...content);
            }
        }

        return neighbours;
    }
}