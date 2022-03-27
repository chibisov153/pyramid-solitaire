document.addEventListener("DOMContentLoaded", function() {

	const container = document.querySelector('.container');

	//let box = container.getBoundingClientRect();

	//console.log(height_Width);


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

});
