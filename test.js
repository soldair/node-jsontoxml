/*
copyright Ryan Day 2010 <http://ryanday.org> [MIT Licensed]

no testing framework required!

HOW TO:
node test.js

*/

var jsonxml = require("./jsontoxml.js");

var date = (new Date())+'';
var input = {
	node:'text content',
	parent:[
		{name:'taco',text:'beef taco',children:{salsa:'hot!'}},
		{name:'taco',text:'fish taco',attrs:{mood:'sad'},children:[
			{name:'salsa',text:'mild'},
			'hi',
			{name:'salsa',text:'weak',attrs:{type:2}}
		]},
		{name:'taco',attrs:"mood='party!'"}
	],
	parent2:{
		hi:'is a nice thing to say',
		node:'i am another not special child node',
		date:function(){
			return date;
		}
	}
};

var expected = '<node>text content</node>'
	+'<parent>'
		+'<taco>'
			+'beef taco'
			+'<salsa>hot!</salsa>'
		+'</taco>'
		+'<taco mood="sad">'
			+'fish taco'
			+'<salsa>mild</salsa>'
			+'hi'
			+'<salsa type="2">weak</salsa>'
		+'</taco>'
		+"<taco mood='party!'/>"
	+'</parent>'
	+'<parent2>'
		+'<hi>is a nice thing to say</hi>'
		+'<node>i am another not special child node</node>'
		+'<date>'+date+'</date>'
	+'</parent2>';

	
var result = jsonxml.obj_to_xml(input);

if(result == expected){
	console.log('PASSED!');
} else {
	console.log('FAILED!');
	console.log(result);
	console.log('did not match expected!');
}
