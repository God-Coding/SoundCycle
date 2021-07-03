var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

document.body.style.margin = "0px";

var w = canvas.width = window.innerWidth - 10;
var h = canvas.height = window.innerHeight - 10;
canvas.style.border = "2px solid black";

var doneBtn = document.getElementById("done");

var dropBox = document.getElementById("custom");

var speedBar = document.getElementById("speed");

var clicked = false;

var url = "https://raw.githubusercontent.com/God-Coding/sounds/main/";

function distance(a, b, c, d){
    return Math.sqrt(((a - c) * (a - c)) + ((b - d) * (b - d)));
}

class Line{
    constructor(sx, sy, ex, ey){
        this.sx = sx; this.sy = sy; this.ex = ex; this.ey = ey;
    }

    draw(c){
        c.beginPath();
        c.moveTo(this.sx, this.sy);
        c.lineTo(this.ex, this.ey);
        c.stroke();
        c.closePath();
    }
}

class Ball{
    constructor(x, y){
        this.x = x; this.y = y;
    }
    
    draw(c){
        c.beginPath();
        c.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
        c.fill();
        c.closePath();
    }
}

class Sound{
    constructor(src){
        this.src = src;
        this.audio = new Audio(this.src);
    }

    play(){
        this.audio.currentTime = 0;
        this.audio.play();
    }
}

var sounds = {
    "a" : new Sound(url + "sounds/a.wav"),
    "b" : new Sound(url + "sounds/b.wav"),
    "c" : new Sound(url + "sounds/c.wav"),
    "d" : new Sound(url + "sounds/d.wav"),
    "e" : new Sound(url + "sounds/e.wav"),
    "f" : new Sound(url + "sounds/f.wav"),
    "g" : new Sound(url + "sounds/g.mp3"),
    "h" : new Sound(url + "sounds/h.mp3"),
    "i" : new Sound(url + "sounds/i.mp3"),
}

var loaded = false;

var sos = [sounds["a"], sounds["b"], sounds["c"], sounds["d"], sounds["e"], sounds["f"], sounds["g"], sounds["h"], sounds["i"]];
function random(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

class Shape{
    constructor(lines, sound, speed){
        this.sounds = [];
        this.speed = speed;
        this.sound = sound;
        this.lines = lines;
        for(let i = 0; i < this.lines.length; i++){
            this.sounds.push(new Sound(this.sound.src));
            //this.sounds.push(this.sound)
        }
        this.currentLine = 0;
        this.ball = new Ball(this.lines[this.currentLine].sx, this.lines[this.currentLine].sy);
        if(this.lines[this.currentLine].sx > this.lines[this.currentLine].ex){
            this.angle = Math.atan(((this.lines[this.currentLine].ey - this.lines[this.currentLine].sy) / (this.lines[this.currentLine].ex - this.lines[this.currentLine].sx))) + Math.PI;
        }else{
            this.angle = Math.atan(((this.lines[this.currentLine].ey - this.lines[this.currentLine].sy) / (this.lines[this.currentLine].ex - this.lines[this.currentLine].sx)));
        }
        this.speed = this.speed || 2;
        this.increaseOne = true;
        this.lineTouchedOpposite = false;
    }

    draw(c){
        c.strokeStyle = "green";
        this.lines.forEach(line=>{
            line.draw(c);
        });
        c.fillStyle = "red";
        this.ball.draw(c);
    }

    singleTon(bol, cb){
        if(bol) cb();
        return false;
    }

    update(){
        if(this.lines.length == 1){
            if(this.lineTouchedOpposite){
                if(distance(this.ball.x, this.ball.y, this.lines[this.currentLine].sx, this.lines[this.currentLine].sy) <= -this.speed){
                    this.speed *= -1;
                    this.sounds[this.currentLine].play();
                }
            }
            if(distance(this.ball.x, this.ball.y, this.lines[this.currentLine].ex, this.lines[this.currentLine].ey) <= this.speed){
                this.speed *= -1;
                this.sounds[this.currentLine].play();
                this.lineTouchedOpposite = true;
            }
        }else{
            if(distance(this.ball.x, this.ball.y, this.lines[this.currentLine].ex, this.lines[this.currentLine].ey) <= this.speed){
                this.increaseOne = this.singleTon(this.increaseOne, ()=>{
                    if(this.currentLine < this.lines.length - 1){
                        this.currentLine++;
                        this.ball.x = this.lines[this.currentLine].sx;
                        this.ball.y = this.lines[this.currentLine].sy;
                        this.sounds[this.currentLine].play();
                    }else{
                        this.currentLine = 0;
                        this.sounds[this.currentLine].play();
                    }
                    if(this.lines[this.currentLine].sx > this.lines[this.currentLine].ex){
                        this.angle = Math.atan(((this.lines[this.currentLine].ey - this.lines[this.currentLine].sy) / (this.lines[this.currentLine].ex - this.lines[this.currentLine].sx))) + Math.PI;
                    }else{
                        this.angle = Math.atan(((this.lines[this.currentLine].ey - this.lines[this.currentLine].sy) / (this.lines[this.currentLine].ex - this.lines[this.currentLine].sx)));
                    }
                });
            }else{
                this.increaseOne = true;
            }
        }
        this.ball.x += this.speed * Math.cos(this.angle);
        this.ball.y += this.speed * Math.sin(this.angle);
    }
}


class ShapeByUser{
    constructor(btn){
        btn.style.display = "block";
        this.points= [];
        this.box = btn.getBoundingClientRect();
        canvas.addEventListener("click", (e)=>{
            if(clicked){
                if(e.clientX > this.box.left && e.clientX < this.box.left + this.box.width && e.clientY > this.box.top && e.clientY < this.box.top + this.box.height){
                    return false;
                }else{
                    if(this.points.length == 0){
                        this.points.push({ x : e.clientX, y : e.clientY });
                        this.lineTwo = true;
                    }else{
                        if(e.clientX == this.points[this.points.length - 1].x && e.clientY == this.points[this.points.length - 1].y){

                        }else{
                            this.points.push({ x : e.clientX, y : e.clientY });
                            this.lineTwo = true;
                        }
                    }
                }
            }
            clicked = true;
        });
        this.lines = [];
        this.noOfLinesCreated = 0;
        this.lineOne = true;
        this.lineTwo = true;
        btn.onclick = () =>{
            if(this.lines.length !== 0){
                this.lines.push(new Line(this.lines[this.lines.length - 1].ex, this.lines[this.lines.length - 1].ey, this.lines[0].sx, this.lines[0].sy));
                if(speedBar.value > 15) speedBar.value = 15;
                this.shape = new Shape(this.lines, sounds[dropBox.value], (speedBar.value || 3));
            }
        }
    }

    singleTon(bol, cb){
        if(bol) cb();
        return false;
    }

    reset(){
        this.lines = [];
        this.noOfLinesCreated = 0;
        this.points = [];
        this.lineOne = true;
        this.lineTwo = true;
        this.shape = undefined;
    }

    update(){
        for(let i = this.noOfLinesCreated + 1; i < this.points.length; i++){
            if(this.noOfLinesCreated == 0){
                if((i+1) % 2 == 0 && i != 0){
                    this.lineOne = this.singleTon(this.lineOne, ()=>{
                        if(this.points[i - 1].x == this.points[i].x && this.points[i - 1].y == this.points[i].y){

                        }else{
                            this.lines.push(new Line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y));
                            this.noOfLinesCreated++;
                        }
                    })
                }
            }else{
                //join points
                this.lineTwo = this.singleTon(this.lineTwo, ()=>{
                    if(this.lines[this.noOfLinesCreated - 1].ex == this.points[i].x && this.lines[this.noOfLinesCreated - 1].ey == this.points[i].y){

                    }else{
                        this.lines.push(new Line(
                            this.lines[this.noOfLinesCreated - 1].ex, 
                            this.lines[this.noOfLinesCreated - 1].ey,
                            this.points[i].x,
                            this.points[i].y
                        ));
                        this.noOfLinesCreated++;
                    }
                });
            }
        }
    }

    draw(c){
        this.lines.forEach(line=>{
            line.draw(c);
        });
        this.points.forEach(p=>{
            c.fillStyle = "red";
            c.beginPath();
            c.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            c.fill();
            c.closePath();
        }); 
    }
}

//*************************/

function singleTon(bol, cb){
    if(bol){
        cb();
    }
    return false;
}

var damn = new ShapeByUser(doneBtn);

var clearShape = true;

var shapes = [];

var loadedSounds = 0;

function loop(){
    c.clearRect(0 ,0 ,w, h);
    sos.forEach(s=>{
        s.audio.addEventListener("canplaythrough", ()=>{
            loadedSounds++;
            if(loadedSounds = sos.length){
                loaded = true;
            }
        });
    });
    if(loaded){
        if(clicked){
            shapes.forEach(s=>{
                s.draw(c);
                s.update();
            });
        
            damn.draw(c);
        }else{
            c.font = "20px verdana";
            c.fillText("Click anywhere to start", 0, h / 2);
        }
        damn.update();

        if(damn.shape !== undefined){
            clearShape = singleTon(clearShape, ()=>{
                shapes.push(damn.shape);
                damn.reset();
            }); 
        }else{
            clearShape = true;
        }
    }else{
        c.font = "20px verdana";
        c.fillText("Loading Audio files...", 0, h/2);
    }
    requestAnimationFrame(loop);
}

loop();





