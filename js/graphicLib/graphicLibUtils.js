/**
 * Created by ss on 2017/4/13.
 * Code is based on D3.js library; please import <script src="https://d3js.org/d3.v4.min.js"></script> in HMTL head 
 */





//base class for diagram
var ChartDiagram=function(){
	this.radio=(GraphicChart.radio?GraphicChart.radio:1.6);
	this.width = window.innerWidth;
	this.height= window.innerHeight;
	this.svg;
	this.margin={top:20, right:20, bottom:50, left: 50};
	this.color="red";
	this.backgroundColor="#000000";
	this.fillingColor="#666";
	this.parent;
	this.g;
	this.x;
	this.y;
	this.charts=[];
	this.data;

}

//set up graph width base on svg width and margin
ChartDiagram.prototype.gWidth=function(){
	console.log(this.width- this.margin.left - this.margin.right);
	return this.width- this.margin.left - this.margin.right;
};

//set up graph height base on svg height and margin
ChartDiagram.prototype.gHeight=function(){
	console.log(this.height);
	console.log(this.height- this.margin.top - this.margin.bottom);
	return this.height- this.margin.top - this.margin.bottom;
};
ChartDiagram.prototype.data=function(data){
	this.data = data;
	return this;
}
////***** based on its parent element size;
// ChartDiagram.prototype.diagramSize=function(w, h){
// 		if(w&&h){
// 			this.width=w;
// 			this.height=h;
			
// 		return this;
// 		}
// 		if(w){
// 			this.width=w.width;
// 			this.height=w.height;
		
// 			return this;
// 		}
// 		return {width:this.width,height:this.height};

// }

ChartDiagram.prototype.margins=function(margin){
		if(margin){
			if(margin.top){
				this.margin.top=margin.top;
			}
			if(margin.right){
				this.margin.top=margin.right;
			}
			if(margin.bottom){
				this.margin.top=margin.bottom;
			}
			if(margin.left){
				this.margin.top=margin.left;
			}
			
			return this;
		}
		return this.margin;
	}

ChartDiagram.prototype.createSVG=function(parentElement,desc){
		
		console.log(this.gHeight(this))
		this.parent=d3.select(parentElement);
	
		this.width= Math.floor(parseFloat(this.parent.style('width')));
		this.height= this.width/this.radio;//Math.floor(parseFloat(this.parent.style('height')));
		console.log(this.width+","+this.height);
		if(desc){
			this.parent.append('h4').text(desc);
		}
		this.svg=this.parent
				.append("svg")
					.attr("width",this.width)
					.attr("height",this.height);
		return this.svg.append("g").attr("transform", "translate("+this.margin.left+","+ this.margin.top+")");
	}

/**
*Class for create dot diagream
* ----------need to be update in the future to fit various situation
*/
var DotDiagram=function(){
	ChartDiagram.call(this);
	this.method;
	
	this.data;
	
	this.x;
	this.y;

	this.api;
	this.parentPath;
	this.pro;



}
DotDiagram.prototype = Object.create(ChartDiagram.prototype);
DotDiagram.prototype.constructor=DotDiagram;

/**
*parse data from geojson
* ----------need to be update in the future
*/

DotDiagram.prototype.depthAxis=function(geojson){
	var newData=[];
		//console.log("======"+dig);
		console.log(this);
		this.x=d3.scaleTime().rangeRound([0,this.gWidth()]);
		console.log(d3.scaleTime().rangeRound([0,this.gWidth()]));
		this.y=d3.scaleLinear().rangeRound([this.gHeight(),0]);
		
		geojson.forEach(function Each(oneD){
			var item={};
			item.y= oneD.properties.mag;
			item.x=oneD.properties.time;
			item.alert=oneD.properties.alert;
			item.place= oneD.properties.place;
			item.url=oneD.properties.url;
			newData.push(item);
		});
		return newData;
}


DotDiagram.prototype.parseLatLngMag=function(geojson){
		var newData=[];
		this.x=d3.scaleLinear().rangeRound([0,this.gWidth()]);
		this.y=d3.scaleLinear().rangeRound([this.gHeight(),0]);
		//console.log(geojson);
		geojson.forEach(function Each(oneD){
			var item={};
			item.mag= oneD.properties.mag;
			//item.date=oneD.properties.time;
			item.alert=oneD.properties.alert;
			item.place= oneD.properties.place;
			item.url=oneD.properties.url;
			item.y=oneD.geometry.coordinates[1];
			item.x=oneD.geometry.coordinates[0];
			newData.push(item);
		});
		return newData;
}

DotDiagram.prototype.updateGraph=function(){
		this.svg.remove();
		this.render(this.api,this.parentPath,this.method,this.pro);
	}
/**
* Creating svg from data 
* 
*/
DotDiagram.prototype.render=function(dataAPI,parentElement,parseDataMethod,properties,desc){
		this.method=parseDataMethod;
		console.log(this.method);
		var api=this.api=dataAPI;
		var parent=this.parentPath=parentElement;
		var pro=this.pro=properties;
		var g = this.createSVG(parentElement,desc);

		var groupHeight=this.gHeight();
		var groupWidth=this.gWidth();
		
		console.log(this);
		var dig=this;

		d3.json(dataAPI,function(d){
			console.log(dig.method);
			var newData=dig.method(d,dig);
			console.log(dig.x);
			//console.log(x);
			dig.x.domain(d3.extent(newData,function(d){return d.x;}));
			dig.y.domain(d3.extent(newData,function(d){return d.y;}));

			g.append("g")
					.attr("transform","translate(0,"+groupHeight+")")
					.call(d3.axisBottom(dig.x))
				.select(".domain")
					.remove();

			g.append('g')
					.call(d3.axisLeft(dig.y))
				.append('text')
					.attr('fill',function(){if(properties&&properties.backgroundColor)return properties.backgroundColor; return dig.backgroundColor;})
					.attr('transform',"rotate(-90)")
					.attr('y',6)
					.attr('dy','0.71em') ///////----------size
					.attr('text-anchor','end')
					.text("Magnitude");

			g.selectAll("dot")
        		.data(newData)
      			.enter()
      			//create link
      			.append('a')
      				.attr("xlink:href",function(d){return d.url;})
      				.attr('target',"_blank")
      			//create dots
      			.append("circle")
        			.attr("r", function(d){console.log(Math.pow(d.mag?d.mag:d.y,0.2)*4);if(properties&&properties.radius) return properties.radius;return Math.pow(d.mag?d.mag:d.y,2)/4;})
        			.attr("cx", function(d) { return dig.x(d.x); })
        			.attr("cy", function(d) { return dig.y(d.y); })
        		    .attr("opacity",0.6)
        			//.attr("stroke",function(){if(properties&&properties.color)return properties.color; return dig.color;})
        			.attr("fill",function(d){if(d.alert==null){if(properties&&properties.fillingColor) return properties.fillingColor; return dig.fillingColor;} return d.alert;})
        		//create title for each dots
        		.append('title').html(function(d){return d.place+" "+(d.mag?d.mag:d.y);});
        		
		});
	}