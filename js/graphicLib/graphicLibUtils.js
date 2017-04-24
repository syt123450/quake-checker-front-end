/**
 * Created by ss on 2017/4/13.
 * Code is based on D3.js library; please import <script src="./js/resource/d3.min.js"></script> in HMTL head 
 */





//base class for diagram
var ChartDiagram = function(){
	this.color = "#4444ff";
	this.backgroundColor = "#000000";
	this.fillingColor = "#666";


	this.radio = (GraphicChart.radio?GraphicChart.radio:1.6);

	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.svg; // svg container

	this.margin = {top:20, right:100, bottom:50, left: 50}; // should be avaible for outside
	this.parent; //parent container
	this.g; 
	//this.x; // x-axis for d3
	//this.y; //y axis for d3
	//this.charts=[];
	this.data;
	this.header;
	this.method;

}

//set up graph width base on svg width and margin
ChartDiagram.prototype.gWidth = function(){
	//console.log(this.width - this.margin.left - this.margin.right);
	return this.width - this.margin.left - this.margin.right;
};

//set up graph height base on svg height and margin
ChartDiagram.prototype.gHeight=function(){
//	console.log(this.height);
//	console.log(this.height - this.margin.top - this.margin.bottom);
	return this.height - this.margin.top - this.margin.bottom;
};

ChartDiagram.prototype.data=function(data){
	this.data = data;
	return this;
};


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
};


ChartDiagram.prototype.heading=function(header){
	if(header){
		this.header=header;
		console.log("on assignment header:"+this.header);
		return this;
	}
	return this.header;
};


ChartDiagram.prototype.container=function(parentSelector){
	if(parentSelector){
		this.parent=d3.select(parentSelector);
	}else{
		this.parent=d3.select("body");
	}
	this.width= Math.floor(parseFloat(this.parent.style('width')));
	this.height= this.width/this.radio;//Math.floor(parseFloat(this.parent.style('height')));
	return this;
}



ChartDiagram.prototype.createSVG=function(){
		

		this.width= Math.floor(parseFloat(this.parent.style('width')));
		this.height= this.width/this.radio;
		console.log("header:"+this.header);
		if(this.header){
			
			this.parent.append('h4').attr("class",'diagramHeader').text(this.header);
		}
		this.svg=this.parent
				.append("svg")
					.attr("width",this.width)
					.attr("height",this.height);
		this.g = this.svg.append("g").attr("transform", "translate("+this.margin.left+","+ this.margin.top+")");
		return this.g;
};

ChartDiagram.prototype.remove=function(){
		this.parent.select(".diagramHeader").remove();
		this.svg.remove();
};

ChartDiagram.prototype.update=function(){
		this.remove();
		this.render(this.method);
};
/**
*Class for create dot diagream
* ----------need to be update in the future to fit various situation
*/
var DotDiagram=function(){
	ChartDiagram.call(this);

	this.opacity=0.6;
	this.radius;
	this.color={'null':"#666","red":"red","orange":"orange","yellow":"yellow","green":"green"};
	
	this.xAxis;
	this.yAxis;
	this.cx;
	this.cy;
	this.cr;
	this.xHeader;
	this.yHeader;

};

DotDiagram.prototype = Object.create(ChartDiagram.prototype);
DotDiagram.prototype.constructor=DotDiagram;

/**
*parse data from geojson
* ----------need to be update in the future
*/

DotDiagram.prototype.depth=function(){
	this.xAxis=d3.scaleTime().rangeRound([0,this.gWidth()]);
	
	this.yAxis=d3.scaleLinear().rangeRound([0,this.gHeight()]);

	this.xAxis.domain(d3.extent(this.data,function(d){return d.time;}));
	this.yAxis.domain(d3.extent(this.data,function(d){return d.depth;}));
	
	this.cx=function(callback){return (function(d){console.log(callback);return callback(d.time);});};
	
	this.cy=function(callback){return (function(d){console.log(callback);return callback(d.depth);});};
	
	this.cr=function(d){return Math.pow(d.mag,2)/4;};
	
	this.xHeader="Time";
	this.yHeader="Depth";
};


DotDiagram.prototype.geo=function(){
		
	this.xAxis=d3.scaleLinear().rangeRound([0,this.gWidth()]);
	this.yAxis=d3.scaleLinear().rangeRound([this.gHeight(),0]);
	this.xAxis.domain(d3.extent(this.data,function(d){return d.lng;}));
	this.yAxis.domain(d3.extent(this.data,function(d){return d.lat;}));
	
	this.cx=function(callback){return (function(d){console.log(callback);return callback(d.lng);});};
	
	this.cy=function(callback){return (function(d){console.log(callback);return callback(d.lat);});};
	
	this.cr=function(d){return Math.pow(d.mag,2)/4;};
	
	this.xHeader="Longitude";
	this.yHeader="Latitude";
};


/**
* Creating svg from data 
* 
*/
DotDiagram.prototype.render=function(parseDataMethod){
		this.method=parseDataMethod;
		console.log(this.method);

		var g = this.createSVG();

		var groupHeight=this.gHeight();
		var groupWidth=this.gWidth();
		
		this.method();
		var xAxis=this.xAxis;
		var color=function(colors){return(function(d){return colors[d.alert];});};

		g.append("g")
				.attr("transform","translate(0,"+groupHeight+")")
				.call(d3.axisBottom(this.xAxis))
			.append('text').attr('text-anchor','end').text(this.xHeader)
			.select(".domain")
				.remove();

		g.append('g')
				.call(d3.axisLeft(this.yAxis))
			.append('text')
				.attr('fill',this.backgroundColor)
				.attr('transform',"rotate(-90)")
				.attr('y',6)
				.attr('dy','0.71em') ///////----------size
				.attr('text-anchor','end')
				.text(this.yHeader);

		g.selectAll("dot")
			.data(this.data)
			.enter()

			.append("circle")
				.attr("r", this.cr)
				.attr("cx", this.cx(this.xAxis))
				.attr("cy", this.cy(this.yAxis))
				.attr("opacity",this.opacity)
				//.attr("stroke",function(){if(properties&&properties.color)return properties.color; return dig.color;})
				.attr("fill",color(this.color))
			//create title for each dots
			.append('title').html(function(d){var string=''; for(var pro in d){if(pro =='time'){var time=(new Date(d[pro])).toUTCString();string =string + pro +" : "+time+"<br>"}else string =string + pro +" : "+d[pro]+"<br>";} return string.substring(0,string.length-4);});
};
					  


var PieChart = function(){
	ChartDiagram.call(this);
	//this.radio=1;
	this.colors=["#ffff00","#ffcc44","#ff8888","#ff44cc","#ff00ff","#cc44ff","#8888ff","#44ccff","#00ffff","#44ffee"];
	this.pie;
	this.gradient;
	this.radius;
	this.pathD;
};

PieChart.prototype= Object.create(ChartDiagram.prototype);
PieChart.prototype.constructor= PieChart;

PieChart.prototype.createSVG=function(){
	this.width= Math.floor(parseFloat(this.parent.style('width')));
	this.height= this.width/this.radio;
	console.log("header:"+this.header);
	if(this.header){

		this.parent.append('h4').attr("class",'diagramHeader').text(this.header);
	}
	this.svg=this.parent
			.append("svg")
				.attr("width",this.width)
				.attr("height",this.height);
	this.radius=this.height*0.4;
	this.g = this.svg.append("g").attr("transform", "translate("+(this.margin.left+this.radius)+","+ (this.radius+this.margin.top)+")");
	return this.g;
};

PieChart.prototype.country=function(){
	this.pie=d3.pie()
				.sort(null).value(function(d){return d.counts;});
	this.gradient = this.g.append("defs")
						.selectAll(".gradient")
						.data(this.colors)
						.enter()
						.append("radialGradient")
							.attr("id", function(d,i){return "gradient"+ i;})
							.attr("gradientUnits","userSpaceOnUse")
							.attr("cx",0)
							.attr("cy",0)
							.attr("r",this.radius*2.5)
							.attr("spreadMethod","pad");
	
	this.gradient.append("stop")
				.attr("offset","0%")
				.attr("stop-color",function(d){return d;});
	this.gradient.append("stop")
				.attr("offset","30%")
				.attr("stop-color",function(d){return d;})
				.attr("stop-opacity",1);
	this.gradient.append("stop")
				.attr("offset","70%")
				.attr("stop-color",function(d){return "white";})
				.attr("stop-opacity",1);
	this.pathD=function(radius){return(function(d){console.log(d);return d3.arc().outerRadius(radius).innerRadius(0)(d);});}
};

PieChart.prototype.render=function(method/*id,data,cx,cy,r*/){
	
	this.method=method;
	this.createSVG()
	this.method();

	this.g.selectAll("g")
		.data(this.pie(this.data))
		.enter()

		.append("path")
			.attr("fill",function(d,i){return "url(#gradient"+i+")";})
			.attr("d",this.pathD(this.radius)/*function(d){console.log(d);return d3.arc().outerRadius(this.radius).innerRadius(0)(d);}*/)
			.each(function(d){this._current=d;})
		.append("title")
			.text(function(d){return d.country;});
};


var BarDiagram=function(){
	ChartDiagram.call(this);
	this.xAxis;
	this.yAxis;
	this.cx;
	this.cy;
	this.bHeight;
	this.changeColor;
	this.id;
};

BarDiagram.prototype= Object.create(ChartDiagram.prototype);
BarDiagram.prototype.constructor= BarDiagram;


BarDiagram.prototype.yearly=function(){
	this.xAxis=d3.scaleBand().rangeRound([0,this.gWidth()]).padding(0.2);
	this.yAxis=d3.scaleLinear().rangeRound([this.gHeight(),0]);
	this.xAxis.domain(this.data.map(function(d){return d.month}));
	this.yAxis.domain([0,d3.max(this.data,function(d){return d.counts;})]);
	
	this.cx=function(callback){return (function(d){return callback(d.month);});};
	
	this.cy=function(callback){return (function(d){return callback(d.counts);});};
	this.bHeight=function(groupHeight,callback){return(function(d){ return groupHeight-callback(d.counts);})};
	
	this.changeColor=function(color){
			return(
				function(d){d3.select("#"+d.month)
										.attr("fill",color);}
				  )
	};
	this.id=function(d){return d.month;};
	this.xHeader="Month";
	this.yHeader="Counts";
};

BarDiagram.prototype.seasonal=function(){
	this.xAxis=d3.scaleBand().rangeRound([0,this.gWidth()]).padding(0.2);
	this.yAxis=d3.scaleLinear().rangeRound([this.gHeight(),0]);
	this.xAxis.domain(this.data.map(function(d){return d.dayrange}));
	this.yAxis.domain([0,d3.max(this.data,function(d){return d.counts;})]);
	
	this.cx=function(callback){return (function(d){return callback(d.dayrange);});};
	
	this.cy=function(callback){return (function(d){return callback(d.counts);});};
	this.bHeight=function(groupHeight,callback){return(function(d){ return groupHeight-callback(d.counts);})};
	
	this.changeColor=function(color){
			return(
				function(d,i){d3.select("#seasonalbar"+i)
										.attr("fill",color);}
				  )
	};
	this.id=function(d,i){return "seasonalbar"+i;};
	this.xHeader="Day Range";
	this.yHeader="Counts";
}

BarDiagram.prototype.render=function(method){
	this.method=method;
	var g = this.createSVG();
	var groupHeight=this.gHeight();
	var groupWidth=this.gWidth();
	this.method();
//	var x=d3.scaleBand().rangeRound([0,groupWidth]).padding(0.1);
//	var y=d3.scaleLinear().rangeRound([groupHeight,0]);


//	var valueline = d3.line()
//    .x(function(d,i) { console.log(x(d.month)+','+i);return x(d.month)+x.bandwidth()/2; })
//    .y(function(d) { return y(d.counts); });


	//d3.json(dataAPI,function(data){
	//	x.domain(data.map(function(d){return d.month}));
		//x2.domain(data.map(function(d){return d.month}));
	//	y.domain([0,d3.max(data,function(d){return d.counts;})]);

		g.append("g")
			.attr("class","axis axis--x")
			.attr("transform","translate(0,"+groupHeight+")")
			.call(d3.axisBottom(this.xAxis))





		g.append("g")
				.attr("class","axis axis--y")
				.call(d3.axisLeft(this.yAxis))
			.append("text")
				.attr("transform","rotate(-90)")
				.attr("dy","0.71rem")
				.attr("text-anchor","end")
				.text("counts");


		g.selectAll(".bar").data(this.data)
			.enter()
			.append("rect")
				.attr("class","bar")
				.attr("id",this.id)
				.attr("x",this.cx(this.xAxis))//function(d){return x(d.month);})
				.attr("y",this.cy(this.yAxis))//function(d){return y(d.counts);})
				.attr("width",this.xAxis.bandwidth())
				.attr("height",this.bHeight(groupHeight,this.yAxis))//function(d){ return groupHeight-y(d.counts);})
				.attr("fill",this.color)
					.on("mouseover",this.changeColor("red"))
					.on("mouseout",this.changeColor(this.color));
	
//		    g.append("path")
//		        .attr("class", "line")
//		        .attr("d", valueline(data))
//		        .attr("fill","none")
//		        .attr("stroke","black")
//		        .attr("stroke-width","2");
	//});
}
