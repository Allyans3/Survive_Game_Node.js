var players = [];
var player;
var id;

function Person() {
    this.x = innerWidth/2;
    this.y = innerHeight/2;
    this.r = 35;
    this.speed = 8;

    this.draw = function(x,y){
        game.ctx.beginPath();
        game.ctx.strokeStyle = "rgb(248,197,116)";
        game.ctx.arc(x,y,this.r,0,2*Math.PI,false);
        game.ctx.stroke();
        game.ctx.fillStyle = "rgb(248,197,116)";
        game.ctx.fill();
        game.ctx.closePath();
    };

    this.move = function(){
        var diagon = 1;
        if((Keys.up || Keys.down) && (Keys.left || Keys.right))
            diagon *= 0.7071;

        var vx = vy = 0;

        if(Keys.right == true)
            vx = 1;
        if(Keys.left == true)
            vx = -1;
        if(Keys.up == true)
            vy = -1;
        if(Keys.down == true)
            vy = 1;

        this.x += vx*this.speed*diagon;
        this.y += vy*this.speed*diagon;

        game.rock.forEach(function(el){
            if(el.isAlive){
                if(collideCircle(el,this))
                    resolveCircle(this,el);
            }
        },this);
        game.barrel.forEach(function(el){
            if(el.isAlive){
                if(collideCircle(el,this))
                    resolveCircle(this,el);
            }
        },this);
        game.tree.forEach(function(el){
            if(el.isAlive){
                if(collideCircle(el,this))
                    resolveCircle(this,el);
            }
        },this);
    };
}
