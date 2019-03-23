var game = {
    canvas: undefined,
    ctx: undefined,
    mousex: innerWidth/2,
    mousey: 0,
    rock: [],
    barrel: [],
    tree: [],
    bush: [],
    chida: true,
    using: 3,
    sprites: {
        tree: undefined,
        rock: undefined,
        barrel: undefined,
        ak_47: undefined,
        pistol: undefined,
        hands: undefined,
        bush: undefined,
        UItools: {
            HP: undefined,
            shield: undefined,
            ammo: undefined
        }
    },
    audio: {
        punch: undefined,
        glock18: undefined,
        glock18_back: undefined,
        glock18_release: undefined,
        glock18_out: undefined,
        glock18_in: undefined,
        ak_47: undefined,
        ak47_boltpull: undefined,
        ak47_clipin: undefined,
        ak47_clipout: undefined
    },
    start: function(){
        this.init();
        this.load();
        // this.run();
        setInterval(()=>{
            game.run();
        },1000/60);
    },
    init: function(){
        this.canvas = document.getElementById("mycanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;

        player = new Person();
        var data_pl = {
            x: player.x,
            y: player.y,
            r: player.r,
            speed: player.speed
        };
        hand = new Hands();
        var data_hd = {
            x: player.x,
            y: player.y,
            mouseX: game.mousex,
            mouseY: game.mousey
        };
        socket.emit('start',data_pl,data_hd);


        socket.on('heartbeat', function(data_pl, data_hd){
            players = data_pl;
            hand_s = data_hd;
        });

        window.onkeydown = function(e) {
            var kc = e.keyCode;

            if  (kc === 37 || kc === 65) Keys.left = true;
            else if (kc === 38 || kc === 87) Keys.up = true;
            else if (kc === 39 || kc === 68) Keys.right = true;
            else if (kc === 40 || kc === 83) Keys.down = true;
        };

        window.onkeyup = function(e) {
            var kc = e.keyCode;

            if  (kc === 37 || kc === 65) Keys.left = false;
            else if (kc === 38 || kc === 87) Keys.up = false;
            else if (kc === 39 || kc === 68) Keys.right = false;
            else if (kc === 40 || kc === 83) Keys.down = false;
        };

        window.oncontextmenu = function (){return false};

        window.onresize = function(event) {
            game.canvas.width = innerWidth;
            game.canvas.height = innerHeight;
        };

        var canvPos = getPosition(this.canvas);
        this.canvas.addEventListener("mousemove", function(e){
            game.mousex = e.clientX - canvPos.x;
            game.mousey = e.clientY - canvPos.y;
        }, false);
    },
    load: function(){
        this.audio.punch = new Audio('client/audio/punch.mp3');

        this.audio.glock18 = new Audio('client/audio/glock18/glock18.wav');
        this.audio.glock18_back = new Audio('client/audio/glock18/glock18_back.wav');
        this.audio.glock18_release = new Audio('client/audio/glock18/glock18_release.wav');
        this.audio.glock18_in = new Audio('client/audio/glock18/glock18_in.wav');
        this.audio.glock18_out = new Audio('client/audio/glock18/glock18_out.wav');

        this.audio.ak_47 = new Audio('client/audio/ak_47/ak47.wav');
        this.audio.ak47_boltpull = new Audio('client/audio/ak_47/ak47_boltpull.wav');
        this.audio.ak47_clipin = new Audio('client/audio/ak_47/ak47_clipin.wav');
        this.audio.ak47_clipout = new Audio('client/audio/ak_47/ak47_clipout.wav');
        for(sound in this.audio){
            this.audio[sound].volume = 0.3;
        }

        this.sprites.rock = new Image();
        this.sprites.rock.src = "client/images/rock.png";
        this.sprites.barrel = new Image();
        this.sprites.barrel.src = "client/images/barrel.png";
        this.sprites.tree = new Image();
        this.sprites.tree.src = "client/images/tree.png";
        this.sprites.ak_47 = new Image();
        this.sprites.ak_47.src = "client/images/ak_47.png";
        this.sprites.pistol = new Image();
        this.sprites.pistol.src = "client/images/pistol.png";
        this.sprites.hands = new Image();
        this.sprites.hands.src = "client/images/hands.png";
        this.sprites.bush = new Image();
        this.sprites.bush.src = "client/images/bush.png";
        this.sprites.UItools.HP = new Image();
        this.sprites.UItools.HP.src = "client/images/hp.png";
        this.sprites.UItools.shield = new Image();
        this.sprites.UItools.shield.src = "client/images/shield.png";
        this.sprites.UItools.ammo = new Image();
        this.sprites.UItools.ammo.src = "client/images/ammo1.png";
        for(var i=0; i<150; i++){
            this.rock.push({
                x: Math.floor(Math.random()*(8235+8235)-8235),
                y: Math.floor(Math.random()*(8235+8235)-8235),
                radius: 80,
                isAlive: true
            });
        }
        for(var i=0; i<150; i++){
            this.barrel.push({
                x: Math.floor(Math.random()*(8235+8235)-8235),
                y: Math.floor(Math.random()*(8235+8235)-8235),
                radius: 65,
                isAlive: true
            });
        }
        for(var i=0; i<150; i++){
            this.tree.push({
                x: Math.floor(Math.random()*(8235+8235)-8235),
                y: Math.floor(Math.random()*(8235+8235)-8235),
                radius: 60,
                isAlive: true
            });
        }
        for(var i=0; i<200; i++){
            this.bush.push({
                x: Math.floor(Math.random()*(8235+8235)-8235),
                y: Math.floor(Math.random()*(8235+8235)-8235),
                radius: 140
            });
        }
        var data = {
            rock: this.rock,
            barrel: this.barrel,
            tree: this.tree,
            bush: this.bush
        };

        socket.emit('map_el',data);

        socket.on('map_update',function(map_el){
            game.rock = map_el.rock;
            game.barrel = map_el.barrel;
            game.tree = map_el.tree;
            game.bush = map_el.bush;
        });
    },
    render: function(){
        this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
        this.ctx.save();

        for(var i = 0; i < players.length; i++){
            if(id == players[i].id){
                this.ctx.translate(innerWidth/2-players[i].x, innerHeight/2-players[i].y);
            }
        }

        for (var i=-15; i<=15; i++)
        {
            for(var y=-15; y<=15; y++)
            {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "rgb(109,149,62)";
                this.ctx.lineWidth = "8";
                this.ctx.rect((i*this.scene.x),(y*this.scene.y),545,545);
                this.ctx.stroke();
                this.ctx.fillStyle = "rgb(128,175,73)";
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
        this.rock.forEach(function(el){
            if(el.isAlive)
                this.ctx.drawImage(this.sprites.rock,(el.x-el.radius),(el.y-el.radius),el.radius*2,el.radius*2);
        },this);
        this.barrel.forEach(function(el){
            if(el.isAlive)
                this.ctx.drawImage(this.sprites.barrel,(el.x-el.radius),(el.y-el.radius),el.radius*2,el.radius*2);
        },this);

        for(var i = 0, y = 0; i < players.length && y < hand_s.length; i++, y++){
            player.draw(players[i].x,players[i].y);
            hand.x = hand_s[y].x;
            hand.y = hand_s[y].y;
            hand.draw(hand_s[y].mouseX, hand_s[y].mouseY);
        }

        this.tree.forEach(function(el){
            if(el.isAlive)
                this.ctx.drawImage(this.sprites.tree,(el.x-el.radius*3),(el.y-el.radius*3),el.radius*6,el.radius*6);
        },this);
        this.bush.forEach(function(el){
            this.ctx.drawImage(this.sprites.bush,(el.x -el.radius),(el.y - el.radius),el.radius,el.radius);
        },this);

        this.ctx.restore();
    },
    update: function(){
        player.move();
        var data_pl = {
            x: player.x,
            y: player.y,
            r: player.r,
            speed: player.speed
        };
        var data_hd = {
            x: player.x,
            y: player.y,
            mouseX: game.mousex,
            mouseY: game.mousey
        };
        socket.emit('update',data_pl, data_hd);
    },
    run: function(){
        this.render();
        this.update();

        // window.requestAnimationFrame(function(){
        //     game.run();
        // });
    }
};

window.onload = function(){
    game.start();
};

var Keys = {
     up: false,
     down: false,
     left: false,
     right: false,
     strike: false
};

game.scene = {
    x: 549,
    y: 549
}

function getPosition(el) {
    var xPosition = 0;
    var yPosition = 0;

    while (el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }
    return {
        x: xPosition,
        y: yPosition
    };
}

socket.on('connect', () => {
    id = socket.id;
 });
