/**
 * Created by ss on 2017/4/13.
 */
"use strict"

//set up graph width base on svg width and margin
var gWidth=function(diagram){
	return diagram.width- diagram.margin.left - diagram.margin.right;
};

//set up graph height base on svg height and margin
var gHeight=function(diagram){
	console.log(diagram.height);
	console.log(diagram.margin);
	return diagram.height- diagram.margin.top - diagram.margin.bottom;
};


//base class for diagram
var Diagram=function(){
	this.width = window.innerWidth;
	this.height= window.innerHeight;
	this.svg;
	this.margin={top:20, right:20, bottom:30, left: 50};
	this.color="#444";
	this.backgroundColor="#000000";
	this.fillingColor="white";

	
	this.diagramSize=function(w, h){
		if(w&&h){
			this.width=w;
			this.height=h;
			
		return this;
		}
		if(w){
			this.width=w.width;
			this.height=w.height;
		
			return this;
		}
		return {width:this.width,height:this.height};

	}
	this.margins=function(margin){
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

	this.createSVG=function(parentElement,desc){
		
		console.log(gHeight(this))
		if(desc){
			d3.select(parentElement)
				.append('h4').text(desc);
		}
		this.svg=d3.select(parentElement)
				.append("svg")
					.attr("width",this.width)
					.attr("height",this.height);
		return this.svg.append("g").attr("transform", "translate("+this.margin.left+","+ this.margin.top+")");
	}

	return this;
}

/**
*parse data from geojson
* ----------need to be update in the future
*/

var filterFromGEOJSON=function(geojson){
	var newData=[];

		//console.log(geojson);
		geojson.forEach(function Each(oneD){
			var item={};
			item.mag= oneD.properties.mag;
			item.date=oneD.properties.time;
			item.alert=oneD.properties.alert;
			item.place= oneD.properties.place;
			item.url=oneD.properties.url;
			newData.push(item);
		});
		return newData;
}

/**
*Class for create dot diagream
* ----------need to be update in the future to fit various situation
*/
var DotDiagram=function(){
	Diagram.call(this);

	
	var data;
	var groupWidth,groupHeight;
	var g;
	var api,parent,pro;

/**
* Creating svg from data 
* 
*/
	this.render=function(dataAPI,parentElement,properties,desc){
		api=dataAPI;
		parent=parentElement;
		pro=properties;
		g = this.createSVG(parentElement,desc);
		groupHeight=gHeight(this);
		groupWidth=gWidth(this);

		var x=d3.scaleTime().rangeRound([0,groupWidth]);
		var y=d3.scaleLinear().rangeRound([groupHeight,0]);

		d3.json(dataAPI,function(d){
			var newData=filterFromGEOJSON(d);
			console.log(groupHeight);
			x.domain(d3.extent(newData,function(d){return d.date;}));
			y.domain(d3.extent(newData,function(d){return d.mag;}));

			g.append("g")
					.attr("transform","translate(0,"+groupHeight+")")
					.call(d3.axisBottom(x))
				.select(".domain")
					.remove();

			g.append('g')
					.call(d3.axisLeft(y))
				.append('text')
					.attr('fill',function(){if(properties&&properties.backgroundColor)return properties.backgroundColor; return this.backgroundColor;})
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
        			.attr("r", function(){if(properties&&properties.radius) return properties.radius;return 3.5;})
        			.attr("cx", function(d) { return x(d.date); })
        			.attr("cy", function(d) { return y(d.mag); })
        			.attr("stroke",function(){if(properties&&properties.color)return properties.color; return this.color;})
        			.attr("fill",function(d){if(d.alert==null){if(properties&&properties.fillingColor) return properties.fillingColor; return this.fillingColor;}return d.alert;})
        		//create title for each dots
        		.append('title').html(function(d){return d.place +"  "+ d.mag;});
        		
		});
	}
	this.updateGraph=function(){
		this.svg.remove();
		this.render(api,parent,pro);
	}

	return this;
}
DotDiagram.prototype = Object.create(Diagram.prototype);
DotDiagram.prototype.constructor=DotDiagram;