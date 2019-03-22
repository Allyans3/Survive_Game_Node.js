function collision(Ax,Ay,Bx,By,Cx,Cy,R){
	var Dx = Bx - Ax;
	var Dy = By - Ay;
	var LAB = Dx*Dx+Dy*Dy;
	var t = ((Cx - Ax) * Dx + (Cy - Ay) * Dy) / LAB;
	if(t>1)
		t = 1;
	else if(t < 0)
		t = 0
	var nearestX = Ax + t * Dx;
	var nearestY = Ay + t * Dy;

	var dist = Math.sqrt( (nearestX-Cx)*(nearestX-Cx) + (nearestY-Cy)*(nearestY-Cy) );

	if (dist < R){
		var obj = {
			x:nearestX,
			y:nearestY,
			dist: dist
		}
		return obj;
	}
}

function collideCircle(circle1, circle2) {
    let distance_x = circle1.x - circle2.x;
    let distance_y = circle1.y - circle2.y;
    let radii_sum  = circle1.radius + circle2.r;
    if (distance_x * distance_x + distance_y * distance_y <= radii_sum * radii_sum)
        return true;
    return false;
}

function collideStrike(circle1, circle2,circle3) {
    let distance_x = circle1.x - (circle2.x+game.scene.dx);
    let distance_y = circle1.y - (circle2.y+game.scene.dy);
    let radii_sum  = circle1.radius + circle3.size;
    if (distance_x * distance_x + distance_y * distance_y <= radii_sum * radii_sum)
        return true;
    return false;
}

function resolveCircle(c1, c2) {
    let distance_x = c1.x - c2.x;
    let distance_y = c1.y - c2.y;
    let radii_sum  = c1.r + c2.radius;
    let length = Math.sqrt(distance_x * distance_x + distance_y * distance_y) || 1;
    let unit_x = distance_x / length;
    let unit_y = distance_y / length;

    c1.x = c2.x + (radii_sum + 1) * unit_x;
    c1.y = c2.y + (radii_sum + 1) * unit_y;
}
