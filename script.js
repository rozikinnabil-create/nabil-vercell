const text=[
"TKJ Student",
"Web Developer",
"Network Engineer",
"Arduino Enthusiast"
];

let i=0;
let j=0;

let current="";

let isDeleting=false;

function type(){

current=text[i];

if(!isDeleting){

document.getElementById("typing").innerHTML=current.substring(0,j++);

if(j>current.length){

isDeleting=true;

setTimeout(type,1000);

return;

}

}else{

document.getElementById("typing").innerHTML=current.substring(0,j--);

if(j==0){

isDeleting=false;

i++;

if(i>=text.length){

i=0;

}

}

}

setTimeout(type,isDeleting?50:100);

}

type();
function toggleProject(id){

const project=document.getElementById(id);

if(project.style.display==="block"){
project.style.display="none";
}else{
project.style.display="block";
}

}