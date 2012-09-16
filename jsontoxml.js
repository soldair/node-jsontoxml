//copyright Ryan Day 2010 <http://ryanday.org> [MIT Licensed]

var process_to_xml = function(node_data,options){

  return (function fn(node_data,node_descriptor){
    var xml = ""
    , type = typeof node_data
    ;

    //if value is an array create child nodes from values
    if(node_data instanceof Array){
      node_data.map(function(v){
          xml += fn(v,1);
          //entries that are values of an array are the only ones that can be special node descriptors
      });
    } else if(node_data instanceof Date) {
      // cast dates to ISO 8601 date (soap likes it)
      xml += node_data.toJSON?node_data.toJSON():node_data+'';
    } else if (type == 'object'){

      if(node_descriptor == 1 && node_data.name){
        var content = ""
        , name = node_data.name
        , attributes = ""
        ;

        if(node_data.attrs) {
          if(typeof node_data.attrs != 'object') {
            attributes +=' '+node_data.attrs;
            node_data.attrs = {};
          }

          var attrs = node_data.attrs;

          for(var i in attrs){
            attributes += ' '+i+'="'+(options.esc?esc(attrs[i]):attrs[i])+'"';
          }
        }

        //later attributes can be added here
        if(node_data.text || node_data.value) { 
          var c = (node_data.value || '')+(node_data.text || '');
          content += (options.escape?esc(c):c);
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
    } else if (type == 'function'){
      xml += node_data(xml,fn);
    } else {
      xml += options.escape?esc(node_data+''):node_data+'';
    }

    return xml;

  }(node_data))
};


var xml_header = '<?xml version="1.0" encoding="utf-8"?>';

module.exports = function(obj,options){

  if(typeof obj == 'string' || obj instanceof Buffer) {
    try{
      obj = JSON.parse(obj.toString());
    } catch(e){
      return false;
    }
  }

  var xmlheader = '';
  if(options && typeof options == 'object') {
    xmlheader = options.xmlHeader?xml_header:'';
  } else if(options) xmlheader = xml_header;


  var xml = process_to_xml(obj,options||{});
  return xmlheader+xml;
}

module.exports.json_to_xml= 
module.exports.obj_to_xml = module.exports;

module.exports.escape = esc;

function esc(str){
  return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}

module.exports.cdata = cdata;

function cdata(str){
  return "<!CDATA[["+str.replace(/]]>/g,'')+']]>';
};



