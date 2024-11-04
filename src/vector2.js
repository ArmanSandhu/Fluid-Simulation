class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Normalize() {
        let length = this.Length();
        this.x /= length;
        this.y /= length;
    }

    Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    LengthSquared() {
        return this.x * this.x + this.y * this.y
    }

    GetNormal() {
        return new Vector2(this.y, -this.x);
    }

    Dot(vector) {
        return this.x * vector.x + this.y * vector.y
    }

    Log() {
        console.log("Vector2 (x, y): (" + this.x + ", " + this.y + ")")
    }

    Cpy() {
        return new Vector2(this.x, this.y);
    }

    static Zero() {
        return new Vector2(0, 0);
    }
}

function Add(vectorA, vectorB) {
    return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
}

function Subtract(vectorA, vectorB) {
    return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
}

function Scale(vector, scalar) {
    return new Vector2(vector.x * scalar, vector.y * scalar);
}