var express = require('express');
var socket = require('socket.io')
var connectedClients = []
//App setu p

var app = express();
var server = app.listen(4002,function(){
    console.log("listen to 4001")
} )

app.use(express.static('public'));

var io = socket(server);

class infoJoueurs {
    constructor(numero){
        this.pseudo = "";
        this.id = "";
        this.color = "";
        this.numero = numero;
    }
}
var joueurs = []
var joueursEnCours = []
const cases = 28;

let endGame = false;
let runningGame;
let timeTillGame 
let timer

let startTimer = function(){
    endGame = true
    timeTillGame = 2
    timer = setInterval(socketEmitTimer, 1000)
}
let socketEmitTimer = function(){
    io.sockets.emit('timerTick',{
        seconds : timeTillGame
    })
    if(timeTillGame <= 0 ){
        clearInterval(timer)
        endGame = false
    }
    timeTillGame--;
}

let pomme = {
            
    x:Math.floor(Math.random()*cases),
    y:Math.floor(Math.random()*cases),
    
    newApple: function(){
        Object.keys(joueurs).forEach((id)=>{
            if(this.x==joueurs[id].snake.x && this.y==joueurs[id].snake.y) {
                joueurs[id].snake.queue++;
                this.x=Math.floor(Math.random()*cases);
                this.y=Math.floor(Math.random()*cases);
            }
        })
    }
}

class snake {
    constructor(id){
        this.x = Math.floor(Math.random()*cases);
        this.y = Math.floor(Math.random()*cases);
        this.deplHor = 0;
        this.deplVert = 0;
        this.tabSnake = [];
        this.queue = 1;
        this.skin = ['blue', 'orange']
        this.color = this.skin[id]
    }
    move(){        
        this.x=this.x+this.deplHor;
        this.y=this.y+this.deplVert;
        
        if(this.x<0) {
            this.x= cases-1;
        }
        if(this.x>cases-1) {
            this.x= 0;
        }
        if(this.y<0) {
            this.y= cases-1;
        }
        if(this.y>cases-1) {
            this.y= 0;
        }
    }

    retainPos(){
        this.tabSnake.push({x:this.x,y:this.y});
        while(this.tabSnake.length>this.queue) {
            this.tabSnake.shift();
        }
    }

    turnLeft(){
        setTimeout(()=>{
            this.deplHor=-1;
                this.deplVert=0;
            }, 1000/15)
    }

    turnRight(){
        setTimeout(()=>{
            this.deplHor=1;
            this.deplVert=0;
        }, 1000/15)
    }

    turnUp(){
        setTimeout(()=>{
            this.deplHor=0;
            this.deplVert=-1;
        }, 1000/15)
    }

    turnDown(){
        setTimeout(()=>{
            this.deplHor=0;
            this.deplVert=1;
        }, 1000/15)
    }

    direction(keyCode){
        if(this.deplHor == 0 && this.deplVert==0){
            switch(keyCode) {
                case 'left':
                this.turnLeft()
                break;
                case 'right':
                this.turnRight()
                break;
                case 'up':
                this.turnUp()
                break;
                case 'down':
                this.turnDown()
                break;
            }
        } else if (this.deplVert== -1 || this.deplVert== 1){
            switch(keyCode) {
                case 'left':
                this.turnLeft()
                break;
                case 'right':
                this.turnRight()
                break;
            }
        } else {
            switch(keyCode) {
                case 'up':
                this.turnUp()
                break;
                case 'down':
                this.turnDown()
                break;
            }
        }
    }
    

    checkCollision(){
        
        for(let j=0;j<joueurs.length;j++){
            for(let i=0 ;i<joueurs[j].snake.tabSnake.length - 1;i++){
                if(joueurs[j].snake.x == joueurs[j].snake.tabSnake[i].x && joueurs[j].snake.y == joueurs[j].snake.tabSnake[i].y){
                    joueurs[j].snake.queue=1
                }
            }
        }

    }

    // curve fever 

    // cornerFever(){
    //     this.queue ++
    // }
}

io.on('connection',function(socket){
    console.log(socket.id)
    console.log('Made socket connection', socket.handshake.address);
    socket.on('ready',function(data){
        if(!connectedClients.includes(socket.id) || true){
            connectedClients.push(socket.id)
            let nbJoueurs = joueurs.length
            let player = new infoJoueurs(nbJoueurs)
            player.pseudo = data.pseudo
            player.id = socket.id
            player.color = data.color
            player.snake = new snake(nbJoueurs)
            joueurs.push(player)
            console.log(joueurs)
        }
        if (joueurs.length === 2){
            io.sockets.emit('redirection',{
                joueurs:joueurs,
                pomme:pomme,
            })
            joueursEnCours.push(joueurs)
             //joueurs = []
            startTimer();
            runningGame = setInterval(game,100);
        }
    })



    socket.on('restart',()=>{
        io.sockets.emit('reset')
        endGame = false;
        for(let i = 0; i< joueurs.length;i++){
            joueurs[i].snake = new snake(i)
        }
        startTimer();
        runningGame = setInterval(game,100);
        // console.log("restart game : " + endGame + " at " + new Date())
    })

    socket.on('touche',function(data){
        keyPush(data.key,socket.id)
    })
    
    function game() {
        if(endGame !== true){
            // console.log("game running : " + endGame + " at " + new Date())

            pomme.newApple()
            for(Id=0;Id<joueurs.length;Id++){
                joueurs[Id].snake.move();
                joueurs[Id].snake.retainPos();
                joueurs[Id].snake.checkCollision()
                
                
                if (joueurs[Id].snake.queue > 15){
                    console.log(joueurs[Id].pseudo + " a une queue de " + joueurs[Id].snake.queue)
                    io.sockets.emit('EndGame',{
                        winner:joueurs[Id]
                    })
                    endGame = true
                    clearInterval(runningGame)
                    console.log("Someone Won")
                }            
            }
            
            io.sockets.emit('tick',{
                    joueurs:joueurs,
                    pomme:pomme,
            })
        }
    }
})
            
        
function keyPush(e,id) {
    let direction
    if(e === 38 || e === 40 || e === 39 || e === 37){
        switch(e) {
            case 38:
                direction = 'up'
            break;
            case 40:
                direction = 'down'
            break;
            case 39:
                direction = 'right'
            break;
            case 37:
                direction = 'left'
            break;
        }
        joueurs.forEach( joueur =>{
            if (joueur.id === id){
                joueur.snake.direction(direction)
            }
        })
    } 
}