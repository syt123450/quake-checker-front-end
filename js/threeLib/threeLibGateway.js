/**
 * Created by ss on 2017/4/12.
 */
 function buildEnvironment(){
     
 this.width= window.innerWidth;
 this.height= window.innerHeight;
 
 this.buildEarth = buildEarthModel();
 
 this.dots = [];
 dots.push(new Dots(37,121,0,0));//for test
 dots.push(new Dots(latitude,longitude,magnitude,depth));
     //Dots(latitude,longitude,magnitude,depth)
 }