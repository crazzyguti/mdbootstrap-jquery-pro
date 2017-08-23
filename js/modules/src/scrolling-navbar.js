/* SCROLLING NAVBAR */
// const ScrollingNavbar = (($) => {

	const OFFSET_TOP = 50;
	const TRANSITION_DURATION = 1500;

	$(window).scroll(function () {
		if($('.navbar').offset().top > OFFSET_TOP) {
			$('.scrolling-navbar').addClass("top-nav-collapse");
		} else {
			$('.scrolling-navbar').removeClass("top-nav-collapse");
		}
	});

// })(jQuery)

// export default ScrollingNavbar