class Playground {
    constructor() {
        this.simulation = new Simulation();
    }

    update(deltaTime) {
        this.simulation.update(deltaTime);
    }
    
    draw() {
        this.simulation.draw();
    }

    onMouseMove(x, y) {
        console.log("Mouse Moved to: (" + x + ", " + y + ")");
    }

    onMouseDown(button) {
        console.log("Mouse Button Pressed: " + button);
    }

    onMouseUp(button) {
        console.log("Mouse Button Released: " + button);
    }
}