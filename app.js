let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

let buttonCountPlus = document.getElementById("buttonCountPlus");
let buttonCountMinus = document.getElementById("buttonCountMinus");
let count = document.getElementById("buttonCountNumber");
let count2 = document.getElementById("num");
let number = 1;

let item = "";

let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");
let btn4 = document.getElementById("btn4");
let btn5 = document.getElementById("btn5");
let btn6 = document.getElementById("btn6");


var count_btn = document.querySelector('.count_btn');
var count_btn2 = document.querySelector('.count_btn2');
var count_btn3 = document.querySelector('.count_btn3');
var count_btn4 = document.querySelector('.count_btn4');
var count_btn5 = document.querySelector('.count_btn5');
var count_btn6 = document.querySelector('.count_btn6');


var open = document.querySelector('.open');
var open2 = document.querySelector('.open2');
var open3 = document.querySelector('.open3');
var open4 = document.querySelector('.open4');
var open5 = document.querySelector('.open5');
var open6 = document.querySelector('.open6');


var close = document.querySelector('.close');
var close2 = document.querySelector('.close2');
var close3 = document.querySelector('.close3');
var close4 = document.querySelector('.close4');
var close5 = document.querySelector('.close5');
var close6 = document.querySelector('.close6');

count_btn.style.display = 'none';
count_btn2.style.display = 'none';
count_btn3.style.display = 'none';
count_btn4.style.display = 'none';
count_btn5.style.display = 'none';
count_btn6.style.display = 'none';


open.addEventListener('click', function() {
  if(count_btn.style.display == 'none') 
	count_btn.style.display = 'inline-block';
	open.style.display = 'none'
});

close.addEventListener('click', function() {
  if(count_btn.style.display == 'inline-block') 
	count_btn.style.display = 'none';
	open.style.display = 'inline-block'
});

open2.addEventListener('click', function() {
  if(count_btn2.style.display == 'none') 
	count_btn2.style.display = 'inline-block';
	open2.style.display = 'none'
});

close2.addEventListener('click', function() {
  if(count_btn2.style.display == 'inline-block') 
	count_btn2.style.display = 'none';
	open2.style.display = 'inline-block'
});

open3.addEventListener('click', function() {
  if(count_btn3.style.display == 'none') 
	count_btn3.style.display = 'inline-block';
	open3.style.display = 'none'
});

close3.addEventListener('click', function() {
  if(count_btn3.style.display == 'inline-block') 
	count_btn3.style.display = 'none';
	open.style3.display = 'inline-block'
});

open4.addEventListener('click', function() {
  if(count_btn4.style.display == 'none') 
	count_btn4.style.display = 'inline-block';
	open4.style.display = 'none'
});

close4.addEventListener('click', function() {
  if(count_btn4.style.display == 'inline-block') 
	count_btn4.style.display = 'none';
	open4.style.display = 'inline-block'
});

open5.addEventListener('click', function() {
  if(count_btn5.style.display == 'none') 
	count_btn5.style.display = 'inline-block';
	open5.style.display = 'none'
});

close5.addEventListener('click', function() {
  if(count_btn5.style.display == 'inline-block') 
	count_btn5.style.display = 'none';
	open5.style.display = 'inline-block'
});

open6.addEventListener('click', function() {
  if(count_btn6.style.display == 'none') 
	count_btn6.style.display = 'inline-block';
	open6.style.display = 'none'
});

close6.addEventListener('click', function() {
  if(count_btn6.style.display == 'inline-block') 
	count_btn6.style.display = 'none';
	open6.style.display = 'inline-block'
});




// $(document).ready(function(){
//   $('.item').each(function(){
//     $(this).click(function(){

//       $(this).toggleClass('minus plus');
//       $(this).find('span').toggleClass('minus plus');
 
//       $(this).next('.remove_block').fadeToggle();
//     });
//   });
// });

// const btnOpen = document.querySelector('.open');
// const btnClose = document.querySelector('.minus');

// document.querySelectorAll('btn').forEach(function (element) {
//     element.addEventListener('click', function () {
//         btnOpen.onclick = () => document.querySelector('.count_btn').classList.add('visible');
//         btnClose.onclick = () => document.querySelector('.count_btn').classList.remove('visible');
//     });
// });

//function open_count_btn() {
//document.querySelector('.open').style.visibility = 'hidden';
//document.querySelector('.count_btn').style.visibility = 'visible';
//}

// document.querySelector('.open').onclick = function() {
//   document.querySelector('.count_btn').classList.remove('hidden');
//   //document.querySelector('.open').classList.add('hidden');
// }

// document.querySelector('.minus').onclick = function() {
//   document.querySelector('.open').classList.add('visible');
//   //document.querySelector('.open').classList.remove('hidden');
// }

// const btnOpen = document.querySelector('.open');
// const btnClose = document.querySelector('.minus');
// btnOpen.onclick = () => document.querySelector('.count_btn').classList.add('visible');
// btnClose.onclick = () => document.querySelector('.count_btn').classList.add('hidden');

btn1.addEventListener("click", function(){
	if (tg.MainButton.isVisible) {
		tg.MainButton.hide();
	}
	else {
//		tg.MainButton.setText("Вы выбрали товар 1!");
		tg.MainButton.setText("В корзину");
		item = "1";
		tg.MainButton.show();
	}
});

btn2.addEventListener("click", function(){
	if (tg.MainButton.isVisible) {
		tg.MainButton.hide();
	}
	else {
//		tg.MainButton.setText("Вы выбрали товар 2!");
		tg.MainButton.setText("В корзину");
		item = "2";
		tg.MainButton.show();
	}
});

btn3.addEventListener("click", function(){
	if (tg.MainButton.isVisible) {
		tg.MainButton.hide();
	}
	else {
//		tg.MainButton.setText("Вы выбрали товар 3!");
		tg.MainButton.setText("В корзину");
		item = "3";
		tg.MainButton.show();
	}
});

btn4.addEventListener("click", function(){
	if (tg.MainButton.isVisible) {
		tg.MainButton.hide();
	}
	else {
//		tg.MainButton.setText("Вы выбрали товар 4!");
		tg.MainButton.setText("В корзину");
		item = "4";
		tg.MainButton.show();
	}
});

btn5.addEventListener("click", function(){
	if (tg.MainButton.isVisible) {
		tg.MainButton.hide();
	}
	else {
//		tg.MainButton.setText("Вы выбрали товар 5!");
		tg.MainButton.setText("В корзину");
		item = "5";
		tg.MainButton.show();
	}
});

btn6.addEventListener("click", function(){
	if (tg.MainButton.isVisible) {
		tg.MainButton.hide();
	}
	else {
//		tg.MainButton.setText("Вы выбрали товар 6!");
		tg.MainButton.setText("В корзину");
		item = "6";
		tg.MainButton.show();
	}
});

//счетчик

buttonCountPlus.onclick = function() {
    if (number <= 9) {
        number++;
        count.innerHTML = number;
        //count2.value = number * price;
    }
};

buttonCountMinus.onclick = function() {
   if (number >= 2) {
       number--;
       count.innerHTML = number;
       //count2.value = number * price;
    }
};



Telegram.WebApp.onEvent("mainButtonClicked", function(){
	tg.sendData(item);
});

let usercard = document.getElementById("usercard");

let p = document.createElement("p");

p.innerText = `${tg.initDataUnsafe.user.first_name}
${tg.initDataUnsafe.user.last_name}`;


usercard.appendChild(p); 





