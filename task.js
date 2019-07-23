exports.renderTask = function (url,name,format,id) {
console.log(url+" "+name+" "+typeof name);
var body = document.createElement("tr"); //main frame
body.setAttribute("id",id);
var url_td = document.createElement("td"); //url col
var name_td = document.createElement("td"); //name col
url_td.innerHTML = url;
name_td.innerHTML = name;
//attach cols to body
body.appendChild(url_td);
body.appendChild(name_td);
/* Tag element with status  */
var td = document.createElement("td"); //tag holder
var tag = document.createElement("span"); //status tag
//this tasks will always be added status at moment of creation
tag.setAttribute("class","tag is-info is-small");
//set tag text
tag.innerHTML='Added';
//construct element
td.appendChild(tag);
//append tag to body
body.appendChild(td);
/* Tag element with format  */
var td2 = document.createElement("td"); //tag holder
var tag2 = document.createElement("span"); //status tag
//this tasks will always be added status at moment of creation
tag2.setAttribute("class","tag is-info is-small");
//set tag text
tag2.innerHTML=format;
//construct element
td2.appendChild(tag2);
//append tag to body
body.appendChild(td2);
/*
 Button element with loading animation
var div_field = document.createElement("div");
var div_control = document.createElement("div");
var btn = document.createElement("button");
var span = document.createElement("span");
span.innerHTML='OwO';
//set classes
div_field.setAttribute("class", "field has-addons");
div_control.classList.add("control");
btn.setAttribute("class","button is-primary is-loading");
//set button attributes
btn.disabled=true;
btn.setAttribute("type", "button");
btn.setAttribute("name", "button");
//costruct button
btn.appendChild(span);
div_control.appendChild(btn);
div_field.appendChild(div_control);
//attach button to body
body.appendChild(div_field);
*/
//progress col
var prog_td = document.createElement("td"); //progress col
prog_td.innerHTML = '0%';
//attach col to body
body.appendChild(prog_td);
//return component
return body;
};
