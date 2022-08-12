window.addEventListener("load" , function(){
    const canvas = document.querySelector("#canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1400 ; 
    canvas.height = 600 ; 
    let enemies = [];
    let score = 0 ;
    let gameover = false ;
    let fullscreenButton = document.querySelector("#fullscreenButton")
 class inputHandler{
        constructor(){ 
            this.keys = [];
            this.touchY = '' ;
            this.touchTreshold =30 ; 
            // contronls ///////////////
            window.addEventListener("keydown" , e =>  { 
                if(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'&& this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key)  
                }else if(e.key === 'Enter' && gameover ){
                    restareGame();
                }
            })
            window.addEventListener("keyup" , e =>  { 
                if(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
                    this.keys.splice(this.keys.indexOf(e.key), 2);
                }
            })  
            window.addEventListener("touchstart", e =>{
              this.touchY = e.changedTouches[0].pageY;
            })
            window.addEventListener("touchmove", e =>{
                  const swiperdistance = e.changedTouches[0].pageY - this.touchY;
                  if(swiperdistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1)this.keys.push("swipe up");
                 else  if(swiperdistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1){
                     this.keys.push("swipe down")
                   if(gameover)restareGame()
                    }
            })
            window.addEventListener("touchend", e =>{
               this.keys.splice(this.keys.indexOf('swipe up') , 1)
               this.keys.splice(this.keys.indexOf('swipe down') , 1)
            })
        }

    }
    class Player{
        constructor(gameWidth , gameHeight){
            this.gameWidth = gameWidth; 
            this.gameHeight = gameHeight ; // canvas.height 720 
            this.width = 200 ; 
            this.height = 200 ; 
            this.x = 100 ; 
            this.y =  this.gameHeight - this.height  ; 
            this.image = document.getElementById("playerimage");
            this.framex = 0 ; 
            this.maxFrame = 8 ; 
            this.framey = 0 ; 
            this.fps = 20 ; 
            this.frametimer = 0 ; 
            this.frameinterval = 1000 / this.fps ;
            this.speed = 0 ;  
            this.vy = 0 ; 
            this.weigh  = 0.5;
        }
        restare(){
            this.x = 100 ; 
            this.y =  this.gameHeight - this.height  ; 
            this.maxFrame = 8 ; 
            this.framey = 0 ; 
        }
        update(input , deltatime , enemies){
        // collition detection  
    enemies.forEach(enemy => {
        let dx = (enemy.x + enemy.width/2) - (this.x + this.width/2) ;
        let dy =  (enemy.y + enemy.height/2) - (this.y + this.height/2); 
        let distance = Math.sqrt(dx * dx + dy * dy) ; 
        if (distance < enemy.width/2 + this.width/2){
            gameover=  true;
        }
    })
            // sprit enimation 
            if(this.frametimer > this.frameinterval){
            if(this.framex > this.maxFrame ) this.framex = 0 ;
            else this.framex++ ;
            this.frametimer = 0 ; 
            }else 
           this.frametimer += deltatime
           
            if(input.keys.indexOf("ArrowRight")> -1 ){
                this.speed = 5 ; 
            }else if (input.keys.indexOf("ArrowLeft")> -1 ){
                this.speed = -5; 
            }    
            else if ((input.keys.indexOf("ArrowUp")> -1 ||input.keys.indexOf('swipe up') > -1) && this.onGround()){
                this.vy -= 20; 
            }          
            else {
                this.speed = 0;
            }
            this.x += this.speed ;
            if(this.x  < 0 )this.x = 0; else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
           this.y += this.vy;
           if(!this.onGround()){
            this.vy += this.weigh;
            this.framex = 5 ; 
            this.framey = 1; 
           }else {
            this.vy = 0 ; 
            this.framex = 8 ; 
            this.framey= 0 ; 
           }
           if (this.y > this.gameHeight - this.height )this.y = this.gameHeight - this.height ;
        }
           onGround(){
               return this.y >= this.gameHeight - this.height ;  // true 
           }
        
        draw(context){
            context.drawImage(this.image , this.framex * this.width ,this.framey * this.height, this.width , this.height , this.x , this.y , this.width , this.height );
        }
    }
    class Background{
 constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth ;
    this.gameHeight = gameHeight;
    this.image = document.querySelector("#backgroundimage");
    this.x= 0 ;
    this.y= 0 ;
     this.width= 2400 ;
     this.height = 600  ;
     this.speed = 2 ;
}
draw(context){
    context.drawImage(this.image , this.x , this.y , this.width , this.height);
    context.drawImage(this.image , this.x + this.width - this.speed , this.y , this.width , this.height);
}
update(){
    this.x -= this.speed;
    if(this.x <0 - this.width )this.x = 0 ;
} restare(){
    this.x  = 0 ;
}   

    }
    class Enemy{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth ;
            this.gameHeight = gameHeight;
            this.width = 160 ; 
            this.height = 119 ;
            this.image =document.querySelector("#enemyimg");
            this.x = this.gameWidth ; 
            this.y = this.gameHeight -this.height ; 
            this.framex = 0 ;   
            this.maxFrame = 5 ; 
            this.fps = 20 ; 
            this.frametimer = 0 ; 
            this.frameinterval = 1000 / this.fps ; 
            this.speed = 8 ;  
            this.marketForDeletion = false ; 
        }
        draw(context){
            // context.strokeStyle = 'white' ;
            // context.strokeRect(this.x , this.y , this.width , this.width)
            // context.beginPath();
            // context.arc(this.x + this.width / 2 , this.y + this.height /2 , this.width/2 , 0 ,Math.PI * 2)
            // context.stroke()
            context.drawImage(this.image , this.framex * this.width , 0 , this.width , this.height, this.x, this.y ,this.width , this.height)

        }   
        update(deltatime){
            if(this.frametimer > this.frameinterval){
            if (this.framex > this.maxFrame) this.framex = 0 ; 
            else this.framex++ 
           this.frametimer = 0 ; 
        }else {
            this.frametimer += deltatime ;
        }
            this.x -= this.speed ;
            if(this.x < 0 - this.width)  {
                this.marketForDeletion = true
                score++;
            } ; 
        }
    
    }
    function handlerenemy(deltatime){
        if(enemytime > enemyinterval + randomEnemyInterval){
            randomEnemyInterval= Math.random() * 1000 + 500 ;
           enemies.push(new Enemy(canvas.width, canvas.height))
           enemytime = 0;
        } else {
            enemytime +=deltatime;
        }
        enemies.forEach(enemy =>{
            enemy.draw(ctx);
            enemy.update()
        })
        enemies = enemies.filter(enemy => !enemy.marketForDeletion);
    }
    function Displaystatustext(context){  
        context.font = '40px Helvetica';
        context.fillStyle="black" 
        context.fillText('score:'+ score , 30 ,50);
        context.fillStyle="white"     
        context.fillText('score:'+ score , 33 ,53);
        if(gameover){
            context.textAlign = 'center' ; 
            context.fillStyle="black"; 
            context.fillText('Game over, try again' , canvas.width/2  ,200);
            context.fillStyle="red"; 
            context.fillText('Game over, try again' , canvas.width/2 +2   ,202);
        }
    }
    function restareGame(){
      player.restare();
      backgroundimage.restare();
      enemies = [];
      score = 0;
      gameover =false ; 
      animate(0)
    }
    function togglescreenButton(){
        console.log(document.fullscreenElement)
        if(!document.fullscreenElement){
            canvas.requestFullscreen().catch(err =>{
                alert(`error cant enable full screen mode ${err.message}`)
            })
        }else{
            document.exitFullscreen();
        }
    }
    // togglescreenButton()
   fullscreenButton.addEventListener("click" , togglescreenButton) ;
    const input = new inputHandler();
    const player = new Player(canvas.width , canvas.height);
    const backgroundimage = new Background(canvas.width , canvas.height);
    
    let lasttime = 0;
    let enemytime = 0;
    let enemyinterval = 1000 ;
    let randomEnemyInterval= Math.random() * 1000 + 500 ;

    function animate(timeStamp){
        const deltatime = timeStamp - lasttime ;
        lasttime = timeStamp ;  
        ctx.clearRect(0 , 0 , canvas.width , canvas.height);
     backgroundimage.draw(ctx);
     backgroundimage.update(ctx);
        player.draw(ctx)
       handlerenemy(deltatime);
       player.update(input , deltatime , enemies);
       Displaystatustext(ctx);
    if(!gameover)requestAnimationFrame(animate);
    }
    animate(0);

})