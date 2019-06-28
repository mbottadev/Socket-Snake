var socket = io.connect('10.70.0.54:4002');
// var socket = io();


    window.onload = () => {
        // socket.on('test', (socket)=>{
        //     console.log(socket)
        // })
        const colorChoice = ['#82b1ff','#032c70','#00ce4b','#0e7507','#85b20a','#ccff00','#ff9900','#ff3b00','#ff9e6d','#8c1616','#b5176b','#b121ff']
        let colorPickerCells = document.getElementsByClassName("singleColor");
        let timer = document.getElementById('timer');
        let form = document.getElementById("form");
        let jeu = document.getElementById("jeu");
        let loginForm = document.getElementById("loginForm");
        let scoreContainer = document.getElementById("score");
        let myColor = ("rgb("+ Math.floor((Math.random()*100) + 100) + ","  + Math.floor((Math.random()*100) + 100) +","+ Math.floor((Math.random()*100) + 100)+")")
        console.log(myColor)

        for (let i = 0; i < colorPickerCells.length;i++){
            colorPickerCells[i].style.backgroundColor = colorChoice[i]
            colorPickerCells[i].addEventListener("click", (e) =>{
                myColor = colorChoice[i]
                for(let j = 0; j<colorPickerCells.length;j++){
                    colorPickerCells[j].style.border = "0.5px solid lightgray"
                }
                colorPickerCells[i].style.border = "1px solid black"
            }
            )
        }
        
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            let pseudoLocal = e.target.pseudo.value
            socket.emit('ready',{
                pseudo: encodeURIComponent(pseudoLocal),
                color : myColor
            })
        } )
        
        let pomme = {}
        
        let scoreContainerArray = []
        let joueurs = []
        
        socket.on('redirection',function(data){
            form.parentNode.removeChild(form)

            console.log(data)
            for(let i = 0; i< data.joueurs.length;i++){
                let joueurContainer = document.createElement("div")
                joueurContainer.class = "joueurContainer"
                joueurContainer.id = "joueur" + i;
                let joueurScore = document.createElement("p")
                let joueurPseudo = document.createElement("p")

                joueurScore.style.color = data.joueurs[i].color
                joueurPseudo.style.color = data.joueurs[i].color

                joueurContainer.appendChild(joueurPseudo)
                joueurContainer.appendChild(joueurScore)
                joueurContainer.className ="color"
                scoreContainerArray.push(joueurContainer)

                joueurPseudo.innerText = data.joueurs[i].pseudo
                joueurScore.innerText = data.joueurs[i].snake.queue - 1
            }

            for(let i = 0;i<scoreContainerArray.length;i++){
                scoreContainer.appendChild(scoreContainerArray[i])
                scoreContainer.children[i].children[1].innerText = data.joueurs[i].snake.queue - 1
            }
            console.log(scoreContainer)
            contexte.fillStyle="black";
            contexte.fillRect(0,0,cadre.width,cadre.height);
            jeu.style.visibility = "visible";  
            pomme = data.pomme
            dessinePomme(pomme)
            joueurs = data.joueurs
            joueurs.forEach(joueur => {
                show(joueur)
            });
        })
        
        socket.on('timerTick', (data)=>{
            if(data.seconds>0){
                timer.innerText = "Start in : " + data.seconds
            }else{
                timer.innerText =  "Fight !"                
            }
        })

        socket.on('tick',function(data){
            contexte.fillStyle="black";
            contexte.fillRect(0,0,cadre.width,cadre.height);
            pomme = data.pomme
            dessinePomme(pomme)
            joueurs = data.joueurs
            joueurs.forEach(joueur => {
                show(joueur)
            });
            for(let i = 0;i<scoreContainerArray.length;i++){
                scoreContainerArray[i].children[1].textContent  = data.joueurs[i].snake.queue - 1
                scoreContainer.appendChild(scoreContainerArray[i])
            }
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
            console.log("send restart")
            timer.innerText = "Start in : 3" 

            socket.emit('restart')
        })
        socket.on('reset',()=>{
            afficheWinnerContainer.style.zIndex = -2
            console.log("receive reset")

        })
        const cases = 28;
        

        let dessinePomme= function(pomme){
            contexte.fillStyle="red";
            contexte.fillRect(pomme.x*cases,pomme.y*cases,cases,cases);
        }

        let show=function(serpent){
            contexte.fillStyle = serpent.color;
            contexte.beginPath();
            contexte.arc(serpent.snake.x * cases + cases/2,serpent.snake.y * cases + cases /2,cases/2 + 5, 0, Math.PI * 2); 
            contexte.fill();
            contexte.closePath();
            for(i=0;i<serpent.snake.tabSnake.length;i++){                    
                    contexte.fillStyle = serpent.color;
                    contexte.beginPath();
                    contexte.arc(serpent.snake.tabSnake[i].x * cases + cases/2,serpent.snake.tabSnake[i].y * cases + cases /2,(cases/2 + 5) - ((serpent.snake.tabSnake.length -i)/Math.sqrt(serpent.snake.tabSnake.length)), 0, Math.PI * 2); 
                    contexte.fill();
                    contexte.closePath();
               
                    // contexte.fillRect(serpent.snake.tabSnake[i].x*cases,serpent.snake.tabSnake[i].y*cases,cases,cases);
                    // console.log(serpent.snake.tabSnake[i].x + " " + serpent.snake.tabSnake[i].y)
            }
        }
        
    }


