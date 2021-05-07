var w = 500,
	h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['All', 'Data Visualization','Programming Languages', 'Databases', 'Machine Learning', 'NLP', 'Big Data'];

//Data
var d = [
	[
		{axis:"D3;Cytoscape;Vis JS",value:0.8},
		{axis:"Matplotlib;Seaborn",value:0.6},
		{axis:"ggplot2; RShiny",value:0.4},
		{axis:"Python; Flask",value:0.95},
		{axis:"Ruby on Rails",value:0.65},
		{axis:"R",value:0.55},
		{axis:"Javascript",value:1},
		{axis:"NodeJS",value:0.7},
		{axis:"Scala",value:0.65},
		{axis:"C++",value:0.3},
		{axis:"Java",value:0.5},
		{axis:"SQL;NoSQL",value:0.70},
		{axis:"Tensorflow; Sklearn; Keras",value:0.8},
		{axis:"NLTK; Polyglot; SpaCy",value:0.70},
		{axis:"Elasticsearch;Solr;Spark",value:0.5},
	],
		  [
			{axis:"D3;Cytoscape;Vis JS",value:0.8},
			{axis:"Matplotlib;Seaborn",value:0.6},
			{axis:"ggplot2;RShiny",value:0.4},
			{axis:"Python;Flask",value:0},
			{axis:"Ruby on Rails",value:0},
			{axis:"R",value:0},
			{axis:"Javascript",value:0},
			{axis:"NodeJS",value:0},
			{axis:"Scala",value:0},
			{axis:"C++",value:0},
			{axis:"Java",value:0},
			{axis:"SQL;NoSQL",value:0},
			{axis:"Tensorflow; Sklearn; Keras",value:0},
			{axis:"NLTK; Polyglot; SpaCy",value:0},
			{axis:"Elasticsearch; Solr; Spark",value:0},
		  ],[
				{axis:"D3;Cytoscape;Vis JS",value:0},
				{axis:"Matplotlib",value:0},
				{axis:"ggplot2",value:0},
				{axis:"Python; Flask",value:0.95},
				{axis:"Ruby on Rails",value:0.65},
				{axis:"R",value:0.55},
				{axis:"Javascript",value:1},
				{axis:"NodeJS",value:0.7},
				{axis:"Scala",value:0.65},
				{axis:"C++",value:0.3},
				{axis:"Java",value:0.5},
				{axis:"SQL;NoSQL",value:0},
				{axis:"Tensorflow; Sklearn; Keras",value:0},
				{axis:"NLTK; Polyglot; SpaCy",value:0},
				{axis:"Elasticsearch; Solr; Spark",value:0},
		  ],
			[
				{axis:"D3;Cytoscape;Vis JS",value:0},
				{axis:"Matplotlib",value:0},
				{axis:"ggplot2",value:0},
				{axis:"Python; Flask",value:0},
				{axis:"Ruby on Rails",value:0},
				{axis:"R",value:0},
				{axis:"Javascript",value:0},
				{axis:"NodeJS",value:0},
				{axis:"Scala",value:0},
				{axis:"C++",value:0},
				{axis:"Java",value:0},
				{axis:"SQL;NoSQL",value:0.70},
				{axis:"Tensorflow;Sklearn;Keras",value:0},
				{axis:"NLTK;Polyglot;SpaCy",value:0},
				{axis:"Elasticsearch; Solr; Spark",value:0},
			],
			[
				{axis:"D3;Cytoscape;Vis JS",value:0},
				{axis:"Matplotlib",value:0},
				{axis:"ggplot2",value:0},
				{axis:"Python; Flask",value:0},
				{axis:"Ruby on Rails",value:0},
				{axis:"R",value:0},
				{axis:"Javascript",value:0},
				{axis:"NodeJS",value:0},
				{axis:"Scala",value:0},
				{axis:"C++",value:0},
				{axis:"Java",value:0},
				{axis:"SQL;NoSQL",value:0},
				{axis:"Tensorflow;Sklearn;Keras",value:0.5},
				{axis:"NLTK;Polyglot;SpaCy",value:0},
				{axis:"Elasticsearch; Solr; Spark",value:0},
		  ],
			[
				{axis:"D3;Cytoscape;Vis JS",value:0},
				{axis:"Matplotlib",value:0},
				{axis:"ggplot2",value:0},
				{axis:"Python; Flask",value:0},
				{axis:"Ruby on Rails",value:0},
				{axis:"R",value:0},
				{axis:"Javascript",value:0},
				{axis:"NodeJS",value:0},
				{axis:"Scala",value:0},
				{axis:"C++",value:0},
				{axis:"Java",value:0},
				{axis:"SQL;NoSQL",value:0},
				{axis:"Tensorflow;Sklearn;Keras",value:0},
				{axis:"NLTK;Polyglot;SpaCy",value:0.70},
			],
			[
				{axis:"D3;Cytoscape;Vis JS",value:0},
				{axis:"Matplotlib",value:0},
				{axis:"ggplot2",value:0},
				{axis:"Python; Flask",value:0},
				{axis:"Ruby on Rails",value:0},
				{axis:"R",value:0},
				{axis:"Javascript",value:0},
				{axis:"NodeJS",value:0},
				{axis:"Scala",value:0},
				{axis:"C++",value:0},
				{axis:"Java",value:0},
				{axis:"SQL;NoSQL",value:0},
				{axis:"Tensorflow;Sklearn;Keras",value:0},
				{axis:"NLTK;Polyglot;SpaCy",value:0},
				{axis:"Elasticsearch;Solr;Spark",value:0.5},
			]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

//Create the title for the legend
// var text = svg.append("text")
// 	.attr("class", "title")
// 	.attr('transform', 'translate(90,0)')
// 	.attr("x", w - 15)
// 	.attr("y", 10)
// 	.attr("font-size", "12px")
// 	.attr("fill", "#404040")
// 	.text("Label:");

//Initiate Legend
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)')
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 15)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 2)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;
