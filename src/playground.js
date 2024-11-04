class Playground {
    constructor() {
        this.simulation = new Simulation();
    }

    update(deltaTime) {
        this.simulation.update(0.25);
    }
    
    draw() {
        this.simulation.draw();

        // DrawUtils.drawLine(Vector2.Zero(), new Vector2(100, 100), "black", 10);
        // DrawUtils.drawPoint(new Vector2(100, 100), 20, "blue");
        // DrawUtils.strokePoint(new Vector2(100, 100), 20, "red");
        // DrawUtils.drawRectangle(new Vector2(200, 200), new Vector2(100, 100), "green");
        // DrawUtils.drawText(new Vector2(300, 300), 20, "white", "Hello World!");
    }

    onMouseMove(position) {
        //console.log("Mouse Moved to: (" + position.x + ", " + position.y + ")");
        this.mousePosition = position;
    }

    onMouseDown(button) {
        console.log("Mouse Button Pressed: " + button);
        if (button == 1) {
            this.simulation.rotate = !this.simulation.rotate;
        }
    }

    onMouseUp(button) {
        console.log("Mouse Button Released: " + button);
    }
}