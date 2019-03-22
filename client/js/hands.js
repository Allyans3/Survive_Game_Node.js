var hand_s = [];
var hand;

function Hands(){
    this.rad_left = 42;
    this.rad_right = 42;
    this.angle_left = 136;
    this.angle_right = 44;
    this.radius = 10;
    this.x = player.x;
    this.y = player.y;
    this.beat = true;
    this.swing = true;

    this.draw = function(mouseX, mouseY){
        var a = get_angle(mouseX, mouseY);
        var left_hand = rad_calc(a,this.angle_left,this.rad_left);
        var right_hand = rad_calc(a,this.angle_right,this.rad_right);

        game.ctx.beginPath();
        game.ctx.lineWidth = "9";
        game.ctx.strokeStyle = "black";
        game.ctx.fillStyle = "rgb(248,197,116)";

        var x = this.x +left_hand.x;
        var y = this.y +left_hand.y;

        game.ctx.arc(x,y,this.radius,0,2*Math.PI,false);
        game.ctx.stroke();
        game.ctx.fill();

        x = this.x +right_hand.x;
        y = this.y +right_hand.y;

        game.ctx.beginPath();
        game.ctx.arc(this.x+right_hand.x,this.y+right_hand.y,this.radius,0,2*Math.PI,false);
        game.ctx.stroke();
        game.ctx.fill();
        game.ctx.closePath();
    };
}

function rad_calc(a,angle,radius){
    Math.rad = 180/Math.PI;
    var angle = (a-angle)/Math.rad;
    var cord = {
        x: Math.cos(angle)*radius,
        y: Math.sin(angle)*radius
    }
    return cord;
}

function get_angle(mouseX, mouseY){
    var x = mouseX - (innerWidth/2);
    var y = mouseY - (innerHeight/2);
    if(x==0)
        return (y>0) ? 180 : 0;
    var a = Math.atan(y/x)*180/Math.PI;
    a = (x > 0) ? a+90 : a+270;
    return a;
}
