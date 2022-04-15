document.addEventListener("DOMContentLoaded", function() {

	const container = document.querySelector('.container');
	const allCards = [...document.querySelectorAll('.item')];
	const playButton = document.querySelector('.play-button');
	const itemEnd = document.querySelector('.item-end');

	const rows = {
		firstRow: [{ x:'-50%',y:'0%'}],
		twoRow: [{ x:'-102%',y:'50%'},{ x:'2%',y:'50%'}],
		threeRow: [{ x:'-154%',y:'100%'},{ x:'-50%',y:'100%'},{ x:'54%',y:'100%'}],
		fourRow: [{ x:'-206%',y:'150%'},{ x:'-102%',y:'150%'},{ x:'2%',y:'150%'},{ x:'106%',y:'150%'}],
		fiveRow: [{ x:'-258%',y:'200%'},{ x:'-154%',y:'200%'},{ x:'-50%',y:'200%'},
			{ x:'54%',y:'200%'},{ x:'158%',y:'200%'}],
		sixRow: [{ x:'-310%',y:'250%'},{ x:'-206%',y:'250%'},{ x:'-102%',y:'250%'}
		,{ x:'2%',y:'250%'},{ x:'106%',y:'250%'},{ x:'210%',y:'250%'}]
	}
	const number = new Array(21).fill('').map((e, i) => i + 1);

	let arrY = [];
	let arrX = [];
	for (let i in rows) {
		for (let key of Object.values(rows[i])) {
			arrX.push(key.x);
			arrY.push(key.y);
		}
	}
	let shuffledArray = [...allCards];
	let baseItem = [];

	function resizeWindow() {
		let width_Window = window.innerWidth;
		let height_Window = window.innerHeight;
		if ( width_Window < 1160 && height_Window > 800 || width_Window < height_Window) {
			container.classList.add('active');
		} else {
			container.classList.remove('active');
		}
	}
	resizeWindow();

	window.addEventListener('resize', ()=> {
		resizeWindow();
	});

	playButton.addEventListener('click', ()=> {
		shuffle(shuffledArray);
		shuffledArray.forEach((entry, index)=> {
			entry.style.zIndex = `${index}`;
		});
		dealCards();
		baseItem = shuffledArray.slice(0, 3);

		baseItem.forEach(elem => {
			elem.addEventListener('click',()=> {
				let tl = gsap.timeline();
				tl.to(elem,{duration: 0.4, x: '-322%', classList: 'item item-rotate'});
			})
		});
	});

	// baseItem.forEach(elem => {
	// 	elem.addEventListener('click',(el)=> {
	// 		//elem.classList.add('item-rotate');
	// 		//elem.classList.add('item-set');
	// 		let tl = gsap.timeline();
	// 		tl.to(elem,{duration: 0.4, x: '-322%', classList: 'item item-rotate'});
	// 		//baseItem.push(elem);
	//
	// 	})
	// });

	itemEnd.addEventListener('click',()=> {
		// baseItem.forEach(e => {
		// 	e.classList.remove('item-rotate');
		// 	e.classList.remove('item-set');
		// })
		let tl = gsap.timeline();
		tl.to(baseItem,{duration: 0.4, x:'-430%', classList: 'item'});
		//baseItem = [];
	})

	function shuffle(array) {
		let currentIndex = array.length,  randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}
		return array;
	}

	function dealCards() {
		//let top21Card = shuffledArray.slice(shuffledArray.length - 21, shuffledArray.length);
		let top21Card = shuffledArray.slice(3, 36);
		let top6Card = top21Card.slice(0, 6);

		let tl = gsap.timeline();
		tl.to(top21Card.reverse(),{duration: 0.4,x: gsap.utils.wrap(arrX),
			y: gsap.utils.wrap(arrY), zIndex: gsap.utils.wrap(number), stagger: 0.1})
			.to(top6Card.reverse(),{classList: 'item item-rotate', stagger: 0.14},"-=0.3");

			// .to(top6Card,{onStart: ()=> addClasses(top6Card[0])},"-=0.3");
	}

	// function addClasses(elem) {
	// 	elem.classList.add('item-rotate');
	// 	elem.classList.add('item-set');
	// 	baseItem.push(elem);
	// 	console.log(baseItem);
	// }
	//let zin = false;
	gsap.registerPlugin(Draggable);

	Draggable.create('.item',{
		type : "x,y" ,
		//inertia: {top: {min: 0, max: 1000, end: [0,200,400,600]}},
		bounds: ".body",

		onPressInit: function(el) {
			if (!this.target.classList[1] && this.hitTest(container,'100%')) {
				//console.log("onPress", '.item-rotate', this.vars);
				return this.vars.zIndexBoost = false;
			}
			if (this.target.classList[1]) {
				//console.log("onPressInit", this.vars);
				return this.vars.zIndexBoost = true;
			}
		},
		onPress: function() {
			if (!this.target.classList[1]) {
				//console.log("message",this.x);
				return this.endDrag();
			}
		}
		//zIndexBoost: false
		// onClick: function(el) {
		// 	//let el = this.target;
		// 	if (el.path[2].dataset.name === 'six' ) {
		// 		console.log("onDrag", 'ypa');
		// 	}
		// 	if (el.path[1].className === 'item-front' ) {
		// 		console.log("onDrag", '.item-rotate');
		// 	}
		// 	console.log("clicked", el.path[1].className );
		// },
		//dragClickables: false,
		//dragResistance: 0.2,
		//edgeResistance: 0.5,

		// onDrag: function(e) {
		// 	let i = allCards.length;
		// 	while (--i > -1) {
		// 		if (this.hitTest(allCards[i],'50%')) {
		// 			//$(droppables[i]).addClass("highlight");
		// 			//console.log("onDrag", 'ypa');
		// 		}
		// 	}

		//},
		// onDragEnd: function() {
		// 	console.log("drag ended",this.x);
		// },
		// liveSnap: {
		// 	points: function(point) {
		// 		//if it's within 100px, snap exactly to 500,250
		// 		var dx = point.x - 500;
		// 		var dy = point.y - 250;
		// 		if (Math.sqrt(dx * dx + dy * dy) < 100) {
		// 			return {x: 500, y: 250};
		// 		}
		// 		return point; //otherwise don't change anything.
		// 	}
		// },
		//minimumMovement: 56,
	});

	// let fun = function(a) {
	// 	return document.querySelectorAll(a);
	// }
	// let  fun2 = fun('.item');
	// console.log(fun2);

	// for (let key of Object.values(rows.twoRow)) {
	// 	console.log(key.x,key.y);
	// }

	//console.log(rows.twoRow);

});
