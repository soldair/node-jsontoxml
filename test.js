//copyright Ryan Day 2010 <http://ryanday.org> [MIT Licensed]

var test = require('tap').test
, jsonxml = require("./jsontoxml.js")
;

var date = (new Date());
var input = {
  node:'text content',
  parent:[
    {name:'taco',text:'beef taco',children:{salsa:'hot!'}},
    {name:'taco',text:'fish taco',attrs:{mood:'sad'},children:[
     {name:'salsa',text:'mild'},
     'hi',
     {name:'salsa',text:'weak',attrs:{type:2}}
    ]},
    {name:'taco',attrs:{mood:"party!"}}
  ],
  parent2:{
    hi:'this & this is a nice thing to say',
    node:'i am another not special child node',
    date:date+'',
    date2:date
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
  +"<taco mood=\"party!\"/>"
+'</parent>'
+'<parent2>'
  +'<hi>this &amp; this is a nice thing to say</hi>'
  +'<node>i am another not special child node</node>'
  +'<date>'+date+'</date>'
  +'<date2>'+date.toJSON()+'</date2>'
+'</parent2>';

var buffer = new Buffer(JSON.stringify(input));

test("creates correct object from buffer",function(t){
  var result = jsonxml(buffer,{escape:true});
  t.equals(result,expected,' should have generated correct xml');
  t.end()
});

test("creates correct object",function(t){
  var result = jsonxml(input,{escape:true});
  t.equals(result,expected,' should have generated correct xml');
  console.log(result)
  t.end()
});
