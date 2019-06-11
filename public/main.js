var socket = io.connect('10.20.1.90:4001');
// var socket = io();


    window.onload = () => {
        // socket.on('test', (socket)=>{
        //     console.log(socket)
        // })
        let form = document.getElementById("form");
        let jeu = document.getElementById("jeu");
        let loginForm = document.getElementById("loginForm");
        let scoreP1 = document.getElementById("scoreP1");
        let scoreP2 = document.getElementById("scoreP2");
        let colorP1 = document.getElementById("colorP1");
        let colorP2 = document.getElementById("colorP2");
        let myColor = ("rgb("+ Math.floor((Math.random()*215) + 40) + ","  + Math.floor((Math.random()*215) + 40) +","+ Math.floor((Math.random()*215) + 40)+")")
        console.log(myColor)
        let check = function(joueurs,socketId){
            if (socketId == joueurs[0].ip){
                return joueurs[0]
            } else if (socketId == joueurs[1].ip) {
                return joueurs [1]
            }
        }
        let checkEnnemi = function(joueurs,socketId){
            if (socketId == joueurs[0].ip){
                return joueurs[1]
            } else if (socketId == joueurs[1].ip) {
                return joueurs [0]
            }
        }
        
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            let pseudoLocal = e.target.pseudo.value
            socket.emit('ready',{
                pseudo: encodeURIComponent(pseudoLocal),
                color : myColor
            })
        } )
        
        let self = {}
        let ennemi = {}
        let pomme = {}
        

        
        socket.on('redirection',function(data){
            contexte.fillStyle="black";
            contexte.fillRect(0,0,cadre.width,cadre.height);
            form.style.visibility = "hidden";
            jeu.style.visibility = "visible";  
            self = check(data.joueurs,socket.id)
            ennemi = checkEnnemi(data.joueurs,socket.id)
            colorP1.style.color = self.color;
            scoreP1.style.color = self.color;
            colorP1.innerText = self.pseudo;
            colorP2.style.color = ennemi.color;
            scoreP2.style.color = ennemi.color;
            colorP2.innerText = ennemi.pseudo;
            pomme = data.pomme
            dessinePomme(pomme)
            show(self)
            show(ennemi)
        })
        
        socket.on('tick',function(data){
            contexte.fillStyle="black";
            contexte.fillRect(0,0,cadre.width,cadre.height);
            pomme = data.pomme
            dessinePomme(pomme)
            self = check(data.joueurs,socket.id)
            ennemi = checkEnnemi(data.joueurs,socket.id)
            show(self)
            show(ennemi)
            scoreP1.innerText=self.snake.queue - 1
            scoreP2.innerText=ennemi.snake.queue - 1

            // console.log(ennemi)
        })


        

        socket.on('EndGame',function(data){
            console.log("Someone won")
            afficheWinner.innerText = data.winner.pseudo + " won";
            afficheWinner.style.backgroundColor = "black";
            afficheWinner.style.color = data.winner.color;
            afficheWinner.style.zIndex = 11;
            afficheWinnerContainer.style.zIndex = 10;
            afficheWinner.style.fontSize = "200px";
            afficheWinner.style.fontFamily = "'Raleway Dots', cursive";        
            afficheWinner.style.fontFamily = "'Raleway Dots', cursive";  
            afficheWinner.style.visibility = "visible";
            afficheWinnerContainer.style.visibility = "visible";
            restart.style.visibility = "visible";
            restart.style.zIndex = 12;

        })

            
        let cadre=document.getElementById("cadre");
        let contexte=cadre.getContext("2d");
        let afficheWinner=document.getElementById("afficheWinner");
        let afficheWinnerContainer=document.getElementById("afficheWinnerContainer");
        let restart = document.getElementById("restart");

        document.addEventListener("keydown",function(e){
            socket.emit('touche',{
                key: e.keyCode
            })
        });
        
        restart.addEventListener("click",()=>{
            socket.emit('restart')
        })

        const cases = 28;
        

        let dessinePomme= function(pomme){
            contexte.fillStyle="red";
            contexte.fillRect(pomme.x*cases,pomme.y*cases,cases,cases);
        }

        let show=function(serpent){
            contexte.fillStyle = serpent.color;
            contexte.fillRect(serpent.snake.x*cases,serpent.snake.y*cases,cases-2,cases-2); 
            for(i=0;i<serpent.snake.tabSnake.length;i++){
                contexte.fillRect(serpent.snake.tabSnake[i].x*cases,serpent.snake.tabSnake[i].y*cases,cases-2,cases-2);
                // console.log(serpent.snake.tabSnake[i].x + " " + serpent.snake.tabSnake[i].y)
            }
        }
        
    }


