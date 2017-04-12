function Dots(lat,lon)
{
this.latitude = lat;
this.longitude = lon;

var phi   = (90-lat)*(Math.PI/180);
var theta = (lon+180)*(Math.PI/180);
    
this.x = -((0.5) * Math.sin(phi)*Math.cos(theta));
    
this.y = ((0.5) * Math.cos(phi));
    
this.z = -((0.5) * Math.sin(phi)*Math.sin(theta));

}