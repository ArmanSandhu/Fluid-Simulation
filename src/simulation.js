class Simulation {
    constructor() {

    }

    update(deltaTime) {
        console.log("Update Simulation!");
    }

    draw(){
        ctx.beginPath();
        ctx.rect(20, 20, 20, 20);
        ctx.fillStyle = "#FFA500";
        ctx.fill();
        ctx.closePath();
    }
}