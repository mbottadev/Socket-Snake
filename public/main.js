var socket = io.connect('10.70.0.56:4002');
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
            form.parentNode.removeChild(form)
            // contexte.fillStyle="black";
            // contexte.fillRect(0,0,cadre.width,cadre.height);
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
        socket.on('reset',()=>{
            afficheWinnerContainer.style.zIndex = -2
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
        


        // SNOOOOOOW

        body = document.querySelector("body");
        snowflake = document.querySelector("snowflake");

        // Array to store our Snowflake objects
        var snowflakes = [];

        // Global variables to store our browser's window size
        var browserWidth;
        var browserHeight;

        // Specify the number of snowflakes you want visible
        var numberOfSnowflakes = 50;

        // Flag to reset the position of the snowflakes
        var resetPosition = false;

        // Handle accessibility
        var enableAnimations = false;
        var reduceMotionQuery = matchMedia("(prefers-reduced-motion)");

        // Handle animation accessibility preferences 
        function setAccessibilityState() {
            if (reduceMotionQuery.matches) {
            enableAnimations = false;
            } else { 
            enableAnimations = true;
            }
        }
        setAccessibilityState();

        reduceMotionQuery.addListener(setAccessibilityState);

        //
        // It all starts here...
        //
        function setup() {
            if (enableAnimations) {
            window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
            window.addEventListener("resize", setResetFlag, false);
            }
        }
        setup();

        //
        // Constructor for our Snowflake object
        //
        function Snowflake(element, speed, xPos, yPos) {
            // set initial snowflake properties
            this.element = element;
            this.speed = speed;
            this.xPos = xPos;
            this.yPos = yPos;
            this.scale = 1;

            // declare variables used for snowflake's motion
            this.counter = 0;
            this.sign = Math.random() < 0.5 ? 1 : -1;

            // setting an initial opacity and size for our snowflake
            this.element.style.opacity = (.1 + Math.random()) / 3;
        }

        //
        // The function responsible for actually moving our snowflake
        //
        Snowflake.prototype.update = function () {
            // using some trigonometry to determine our x and y position
            this.counter += this.speed / 5000;
            this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
            this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;
            this.scale = .5 + Math.abs(10 * Math.cos(this.counter) / 20);

            // setting our snowflake's position
            setTransform(Math.round(this.xPos), Math.round(this.yPos), this.scale, this.element);

            // if snowflake goes below the browser window, move it back to the top
            if (this.yPos > browserHeight) {
            this.yPos = -50;
            }
        }

        //
        // A performant way to set your snowflake's position and size
        //
        function setTransform(xPos, yPos, scale, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${scale}, ${scale})`;
        }

        //
        // The function responsible for creating the snowflake
        //
        function generateSnowflakes() {

            // get our snowflake element from the DOM and store it
            var originalSnowflake = document.querySelector(".snowflake");

            // access our snowflake element's parent container
            var body = originalSnowflake.parentNode;
            body.style.display = "block";

            // get our browser's size
            browserWidth = document.documentElement.clientWidth;
            browserHeight = document.documentElement.clientHeight;

            // create each individual snowflake
            for (var i = 0; i < numberOfSnowflakes; i++) {

            // clone our original snowflake and add it to body
            var snowflakeClone = originalSnowflake.cloneNode(true);
            body.appendChild(snowflakeClone);

            // set our snowflake's initial position and related properties
            var initialXPos = getPosition(50, browserWidth);
            var initialYPos = getPosition(50, browserHeight);
            var speed = 5 + Math.random() * 40;

            // create our Snowflake object
            var snowflakeObject = new Snowflake(snowflakeClone,
                speed,
                initialXPos,
                initialYPos);
            snowflakes.push(snowflakeObject);
            }

            // remove the original snowflake because we no longer need it visible
            body.removeChild(originalSnowflake);

            moveSnowflakes();
        }

        //
        // Responsible for moving each snowflake by calling its update function
        //
        function moveSnowflakes() {

            if (enableAnimations) {
            for (var i = 0; i < snowflakes.length; i++) {
                var snowflake = snowflakes[i];
                snowflake.update();
            }      
            }

            // Reset the position of all the snowflakes to a new value
            if (resetPosition) {
            browserWidth = document.documentElement.clientWidth;
            browserHeight = document.documentElement.clientHeight;

            for (var i = 0; i < snowflakes.length; i++) {
                var snowflake = snowflakes[i];

                snowflake.xPos = getPosition(50, browserWidth);
                snowflake.yPos = getPosition(50, browserHeight);
            }

            resetPosition = false;
            }

            requestAnimationFrame(moveSnowflakes);
        }

        //
        // This function returns a number between (maximum - offset) and (maximum + offset)
        //
        function getPosition(offset, size) {
            return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
        }

        //
        // Trigger a reset of all the snowflakes' positions
        //
        function setResetFlag(e) {
            resetPosition = true;
        }

    }


