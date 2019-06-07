var socket = io.connect('http://10.20.1.90:4001');



    window.onload = () => {
        socket.on('test', (socket)=>{
            console.log(socket)
        })
        let form = document.getElementById("form");
        let jeu = document.getElementById("jeu");
        let loginForm = document.getElementById("loginForm");
        let scoreP1 = document.getElementById("scoreP1");
        let scoreP2 = document.getElementById("scoreP2");
        let colorP1 = document.getElementById("colorP1");
        let colorP2 = document.getElementById("colorP2");


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
                pseudo: encodeURIComponent(pseudoLocal)
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
            colorP1.innerText = self.pseudo;
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
            console.log("test")
            // console.log(ennemi)
        })


        

        socket.on('identite',function(data){
        })

            
        let cadre=document.getElementById("cadre");
        let contexte=cadre.getContext("2d");
        let afficheWinner=document.getElementById("afficheWinner");


        document.addEventListener("keydown",function(e){
            socket.emit('touche',{
                key: e.keyCode
            })
        });
        
        
        
        const cases = 30;
        

        let dessinePomme= function(pomme){
            contexte.fillStyle="red";
            contexte.fillRect(pomme.x*cases,pomme.y*cases,cases,cases);
        }




        let show=function(serpent){
            contexte.fillStyle = serpent.color;
            contexte.fillRect(serpent.snake.x*cases,serpent.snake.y*cases,cases-2,cases-2);
            if(serpent.snake.x==serpent.snake.x && serpent.snake.y==serpent.snake.y) {
                serpent.snake.queue = 1;
            }           
        }
    }


