/**
 * Created by ss on 2017/4/12.
 */
function buildEnvironment(){
     
 var width= window.innerWidth;
 var height= window.innerHeight;
 
 dots = [];
 dots.push(new Dots(37,121,0,0));//for test
 //dots.push(new Dots(latitude,longitude,magnitude,depth));
     //Dots(latitude,longitude,magnitude,depth)

 var buildEarth = buildEarthModel(width,height,dots);
 }