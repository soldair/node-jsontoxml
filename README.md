
[![Build Status](https://secure.travis-ci.org/soldair/node-jsontoxml.png)](http://travis-ci.org/soldair/node-jsontoxml)

# jsontoxml

This is a library designed to render js objects as xml. Its not made to parse or otherwise edit existing xml/html structures.
For that and perhaps as a compliment to this you can use jsdom or xml2js for editing existing markup.

this will do a good job rendering json as xml but apis that require xml expect odd things mostly related to elements with attributes and implicit array like keys that make formatting your json a little tricky.

## example

```js
var jsonxml = require('jsontoxml');

var xml = jsonxml({
	node:'text content',
	parent:[
		{name:'taco',text:'beef taco',children:{salsa:'hot!'}},
		{name:'taco',text:'fish taco',attrs:{mood:'sad'},children:[
			{name:'salsa',text:'mild'},
			'hi',
			{name:'salsa',text:'weak',attrs:{type:2}}
		]},
		{name:'taco',attrs:'mood="party!"'}
	],
	parent2:{
		hi:'is a nice thing to say',
		node:'i am another not special child node'
		date:function(){
			return (new Date())+'';
		}
	}
})

console.log(xml);

```

outputs:  // ! output is not tabbed this is an example

<node>text content</node>
<parent>
	<taco>
		beef taco
		<salsa>hot!</salsa>
	</taco>
	<taco mood='sad'>
		fish taco
		<salsa>mild</salsa>
		hi
		<salsa type="2">weak</salsa>
	</taco>
	<taco mood='party!'/>
</parent>
<parent2>
	<hi>is a nice thing to say</hi>
	<node>i am another not special child node</node>
	<date>Sun Sep 26 2010 17:27:29 GMT-0700 (PDT)</date>
</parent2>

## API

jsontoxml (obj,options)
  - a valid json structure to interpret
    || a json string
  - returns an xml string 
  - options is optional
    valid options are
    - options.escape 
      - calls escape on all values
      - attribute values if attribute values are specified as an object
    - options.xmlHeader
      - starts the xml with the xml header <?xml ...?>

jsontoxml.escape (string)
  - returns string with xml entities escaped
  - escapes "" & < >

jsontoxml.cdata (string)
  - wraps string with <!CDATA[[ ]]> 
  - removes all occurences of close cdata ]]> in input text

## more description

I made this because i wanted to abstract away the fact that antiquated external systems require post data as xml and i wanted to expose a standard js calling api like my other interfaces.

I did not want to instantiate an entire dom to perform simple updates to tags in lower level functions (like injecting api keys) when top level api call specific functions start building the xml string.


