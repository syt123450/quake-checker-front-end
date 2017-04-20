/**
 * Created by ss on 2017/4/13.
 */
/*
------------- data for dot chart based on 以 x 为时间，y轴为震源深度，圆点半径表示震级，颜色表示alert的颜色； ---------------------

[ { 
mag:number, 
place：string,
time:number, 
alert:string, 
depth:number,
url:string   ---- 如果需要点击跳转的话
},{}....... ]


------------- 先放放 data for geo dot  chart base on 以 X 为纬度，Y 为经度。 ---------------------

[ { 
mag:number, 
place:string,
lat:number, 
lng:number,
alert:string,  ----geometry.coordinates[3]
url:string   ---- 如果需要点击跳转的话
},{}....... ]



------------- data for pie chart ---------------------

[{alert: string/null, counts:number},{}...]


------------- data for line/bar chart ---------------------
--by month
[
{"month":"Jan","counts":300},{}，{}....
]

--by country
[
{"country":"United States","counts":300},{}，{}....
]

*/

var GraphicChart=funciton(){
	this.radio=1.6;// chart width/height
	this.charts=[];
	
}

/**
 * Create dot base on latitude and longitude
 */

GraphicChart.prototype.createDepthDotChart=function(data,parentSelector,heading){
	var geochart=new DotDiagram().data(data).container(parentSelector);
	this.charts.push(geochart);
	if(heading){
		geochart.heading(heading);
	}
	geochart.render(geochart.depthAxis);
}

/**
 * update its size
 */

GraphicChart.prototype.update=function(){
	this.charts.forEach(function(chart){
		chart.update();
	});
}