/*
*   PixelOject  - defines pixel as object
*   ----------
*   xPos & yPos - pixel coordinates
*   isOn        - power status of pixel
*   gravityOn   - gravity status for pixel, if true - gravity is activated
*   id          - id =)
*   constructor - create pixel in x,y coordinates and its own ID
*/
class PixelObject {
    xPos: number;
    yPos: number;
    isOn: boolean;
    gravityOn: boolean;
    id: number;

    constructor(x: number, y: number, inId: number) {
        this.xPos = x;
        this.yPos = y;
        this.id = inId;
    }
}

/*
*  ArrayRow - custom class for creating base row for 2d matrix
*  --------
*/  
class ArrayRow {
    row: number[];

    constructor() {
        this.row = [0, 0, 0, 0, 0];
    }
}

/*
*   Matrix - custom class for 2d number matrix, constructor creating 5x5 matrix
*   ------
*   Can`t delete this code, because this is part of first idea for checking collisisons:
*   We creating matrix with copy of current positions of all pixels in any moment of
*   time, when we moving dot, program will check only one coordinates pair in this matrix,
*   instead of ALL pixels positions/
*/
class Matrix {
    rows: ArrayRow[];

    constructor(row: ArrayRow) {
        this.rows = [row, row, row, row, row];
    }
}

/*
*   Pixels count on screen, work fast with ~ up to 7 pixels
*/
let DOTS_COUNT = 5;

/*
*   Creating base row and custom matrix
*/
let row = new ArrayRow();
let fieldMatrix = new Matrix(row);

/*  
*   Creating iterator variable
*/
let i = 0;

/*
*   Creating array to store and effective using created pixels
*/
let dots: Array<PixelObject> = [];

/*
*   ititDots() function creates new dots, cets its positions from left to right, 
*   -------------------
*   and from down to upper side of LED matrix of micro:bit
*/
function initPixels(): void {
    for (i = 0; i < DOTS_COUNT; i++) {
        dots[i] = new PixelObject(0, 0, i);
        if (i <= 4) {
            dots[i].yPos = 4;
            dots[i].xPos = i;
        } else {
            dots[i].yPos = 3;
            dots[i].xPos = i - 5;
        }


        led.plot(dots[i].xPos, dots[i].yPos);
        basic.pause(250)
    }
}

/*
*   toggleGraviry() function for enabling and disabling gravity
*   ------------------------
*   for all created pixels
*/
function toggleGraviry(): void {
    for (i = 0; i < DOTS_COUNT; i++) {
        dots[i].gravityOn = !dots[i].gravityOn;
    }
}

/*
*   togglePixels() function for enabling and disabling light for 
*   -----------------------
*   all created pixels
*/
function togglePixels(): void {
    for (i = 0; i < DOTS_COUNT; i++) {
        if (dots[i].isOn) {
            dots[i].isOn = !dots[i].isOn;
            led.unplot(dots[i].xPos, dots[i].yPos);
        } else {
            dots[i].isOn = !dots[i].isOn;
            led.plot(dots[i].xPos, dots[i].yPos);
        }
        
    }
}

/*
*   setDotsAcceleration() function
*   ------------------------------
*   In this function we set how fast (every N milliseconds) our micro:bit will calculate
*   new positions for pixels
*
*   Every N milliseconds it will move all dots according by directions of micro:bit tilts
*   like pixels are situated on a horizontal table and rolling to its edges when we shake the table
*/
function setDotsAcceleration(speed: number): void {
    while (true) {
        for (i = 0; i < DOTS_COUNT; i++) {
            if (dots[i].gravityOn) {
                if (input.rotation(Rotation.Roll) > 0) {
                    moveDot("r", dots[i])
                } else if (input.rotation(Rotation.Roll) < 0) {
                    moveDot("l", dots[i])
                }
                if (input.rotation(Rotation.Pitch) > 0) {
                    moveDot("d", dots[i])
                } else {
                    moveDot("u", dots[i])
                }
            }
        }
        basic.pause(speed)
    }
}

/*
*   moveDot() function
*   ------------------
*   in depend of directions (r - right, l - left, u - up, d - down)
*   current pixel moves to one point with checking some collisions to other pixels
*   
*   Collision algorithm is very simple:
*   pixel can stand on its new position, if its new position not matching to position of any other pixels, if this condition is not realized 
*   we returning moving pixel to its previous position
*/
function moveDot(direction: string, dot: PixelObject): void {
    if (dot.isOn) {
        if (direction == "r" && dot.xPos < 4) {
            led.unplot(dot.xPos, dot.yPos);
            dot.xPos += 1;
            led.plot(dot.xPos, dot.yPos);

            let collision = false;
            for (let i = 0; i < DOTS_COUNT; i++) {
                if (dot.id != dots[i].id && dot.xPos == dots[i].xPos && dot.yPos == dots[i].yPos) {
                    collision = true;
                }
            }
            if (collision) {
                dot.xPos -= 1;
                led.plot(dot.xPos, dot.yPos);
            }
        }
        if (direction == "l" && dot.xPos > 0) {
            led.unplot(dot.xPos, dot.yPos);
            dot.xPos -= 1;
            led.plot(dot.xPos, dot.yPos);

            let collision = false;
            for (let i = 0; i < DOTS_COUNT; i++) {
                if (dot.id != dots[i].id && dot.xPos == dots[i].xPos && dot.yPos == dots[i].yPos) {
                    collision = true;
                }
            }
            if (collision) {
                dot.xPos += 1;
                led.plot(dot.xPos, dot.yPos);
            }

        }
        if (direction == "u" && dot.yPos > 0) {
            led.unplot(dot.xPos, dot.yPos);
            dot.yPos -= 1;
            led.plot(dot.xPos, dot.yPos);

            let collision = false;
            for (let i = 0; i < DOTS_COUNT; i++) {
                if (dot.id != dots[i].id && dot.xPos == dots[i].xPos && dot.yPos == dots[i].yPos) {
                    collision = true;
                }
            }
            if (collision) {
                dot.yPos += 1;
                led.plot(dot.xPos, dot.yPos);
            }
        }
        if (direction == "d" && dot.yPos < 4) {

            led.unplot(dot.xPos, dot.yPos);
            dot.yPos += 1;
            led.plot(dot.xPos, dot.yPos);

            let collision = false;
            for (let i = 0; i < DOTS_COUNT; i++) {
                if (dot.id != dots[i].id && dot.xPos == dots[i].xPos && dot.yPos == dots[i].yPos) {
                    collision = true;
                }
            }
            if (collision) {
                dot.yPos -= 1;
                led.plot(dot.xPos, dot.yPos);
            }
        }
    }
}

/*
*   Creating pixels
*/
initPixels();

/*
*   Set Button A for enabling/disabling light for all pixels
*/
input.onButtonPressed(Button.A, () => {
    togglePixels();
})

//  Set Button D for enabling/disabling graviry for all pixels
input.onButtonPressed(Button.B, () => {
    toggleGraviry();
})

//  Enabling light and gravity for created pixels
togglePixels();
toggleGraviry();

/*
*   Enabling default move speed for all pixels in main loop, 
*   it means that every 60 milliseconds micro:bir will calculate new positions for all pixels
*/
basic.forever(() => {
    setDotsAcceleration(60);
})