var express = require('express');
var socket = require('socket.io')
//App setup

var app = express();
var server = app.listen(4001,function(){
    console.log("listen to 4001")
} )

app.use(express.static('public'));

var io = socket(server);

class infoJoueurs {
    constructor(numero){
        this.pseudo = "";
        this.ip = "";
        this.color = "";
        this.numero = -1;
    }
}
var joueurs = []
var joueursEnCours = []
const cases = 28;

let snakes;

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
        // Object.keys(snakes).forEach((serpentId)=>{
        //     if(serpentId !== ownId){
        //         snakes.tabSnake.forEach((tab)=>{
        //             if(this.x === tab.x && this.y === tab.y){
        //                 this.queue = 1
        //             }
        //         })
        //     }
        // })
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


snakes = {
    p1: new snake(0),
    p2: new snake(1),
};


io.on('connection',function(socket){
    console.log(socket.id)
    console.log('Made socket connection', socket.handshake.address);
    socket.on('ready',function(data){
        if (joueurs.length == 1) {
            var p2 = new infoJoueurs(1)
            p2.pseudo = data.pseudo
            p2.ip = socket.id
            p2.color = data.color
            p2.snake = new snake(1)
            joueurs.push(p2)
        }
        if (joueurs.length == 0){
            var p1 = new infoJoueurs(0)
            p1.pseudo = data.pseudo
            p1.ip = socket.id
            p1.color = data.color
            p1.snake = new snake(0)
            joueurs.push(p1)
        }
        if (joueurs.length ==2){
            io.sockets.emit('redirection',{
                joueurs:joueurs,
                pomme:pomme,
            })
            joueursEnCours.push(joueurs)
             //joueurs = []
            setInterval(game,100);
            
        }
    })

    let endGame = false;

    socket.on('restart',()=>{
        endGame = false;
        joueurs[1].snake = new snake(1)
        joueurs[0].snake = new snake(0)

    })

    socket.on('touche',function(data){
        keyPush(data.key,socket.id)
    })
    
    function game() {
        if(endGame !== true){
            pomme.newApple()
            for(Id=0;Id<joueurs.length;Id++){
                joueurs[Id].snake.move();
                joueurs[Id].snake.retainPos();
                joueurs[Id].snake.checkCollision()
                // snakes[serpentId].cornerFever()
                
                
                if (joueurs[Id].snake.queue > 5){
                    
                    io.sockets.emit('EndGame',{
                        winner:joueurs[Id]
                    })
                    endGame = true
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
            
        if (joueurs[0].ip == id){
            joueurs[0].snake.direction(direction)
        } else if (joueurs[1].ip == id){
            joueurs[1].snake.direction(direction)
        }
    } 
}