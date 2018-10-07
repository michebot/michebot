// good boy generator
var images = new Array("img/Goodboy1.jpg", "img/Goodboy2.png", "img/Goodboy3.png", "img/Goodboy4.png");
var len = images.length;
var random_num = Math.floor(len*Math.random());
document.getElementById("goodboi").src = images[random_num];
