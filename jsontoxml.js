/*
copyright Ryan Day 2010 <http://ryanday.org> [MIT Licensed]

THIS MODULE EXPORTS 2 METHODS:
	exports.json_to_xml
	exports.obj_to_xml
	
	ARGUMENTS:
		obj
			the object you would like to render to xml
			in the case of json_to_xml this is a string which is "JSON.parse"d for you
			
		add_xml_header
			boolean if you would like the xml header included in the output
			NOTE: you can always add it you your output by passing it in your input if the default doesnt work for you
			'<?xml version="1.0" encoding="utf-8"?>'

EXAMPLE USE:

jsonxml.obj_to_xml({
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

outputs:  // ! output is not tabbed this is an example

<node>text content</node>
<parent>
	<taco>
		beef taco
		<salsa>hot!</salsa>
	</taco>
	<taco>
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


<node>text content</node>
<parent>
	<taco>beef taco</taco>
	<taco mood="sad">
		fish taco
		<salsa>mild</salsa>
		hi
		<salsa type="2">weak</salsa>
	</taco>
	<taco mood="party!"/>
</parent>
<parent2>
	<hi>is a nice thing to say</hi>
	<node>i am another not special child node</node>
	<date>Mon Sep 27 2010 19:04:44 GMT-0700 (PDT)</date>
</parent2>
*/
var process_to_xml = function fn(node_data,node_descriptor){
	var xml = "";
	//if value is an array create child nodes from values
	if(node_data instanceof Array){
		node_data.map(function(v){
			xml += fn(v,1);
			//entries that are values of an array are the only ones that can be special node descriptors
		});
	} else {
		switch(typeof node_data){
			case 'object':
				if(node_descriptor == 1 && node_data.name){
					var
						content = "",
						name = node_data.name,
						attributes = "";

					if(node_data.attrs) {
						if(typeof node_data.attrs != 'object') {
							attributes +=' '+node_data.attrs;
							node_data.attrs = {};
						}

						var attrs = node_data.attrs;

						for(var i in attrs){
							attributes += ' '+i+'="'+attrs[i]+'"';
						}
					}
					
					//later attributes can be added here
					if(node_data.text || node_data.value) {
						content += (node_data.value || '')+(node_data.text || '');
					}
					
					if(node_data.children){
						content += fn(node_data.children);
					}
					
					if(content.length) {
						xml +='<'+name+attributes+'>'+content+'</'+name+'>';
					} else {
						xml +='<'+name+attributes+'/>';
					}

				} else {

					for( var i in node_data){
						var content = fn(node_data[i]);
						if(content.length) {
							xml +='<'+i+'>'+content+'</'+i+'>';
						} else {
							xml +='<'+i+'/>';
						}
					}
				}
				break;
			case 'function':
				xml += node_data(xml,fn);
				break;
			default:
				xml += node_data+'';
				
		}
	}
	return xml;
};

var xml_header = '<?xml version="1.0" encoding="utf-8"?>';


exports.json_to_xml = function(json,add_xml_header){
	try{
		var obj = JSON.parse(json);
	} catch(e){
		return false;
	}

	return this.obj_to_xml(obj,add_xml_header); 
}

exports.obj_to_xml = function(obj,add_xml_header){
	return (add_xml_header?xml_header:'')+process_to_xml(obj);
}