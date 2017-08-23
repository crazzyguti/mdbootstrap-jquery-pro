//SMOOTH SCROLL
$(".smooth-scroll").on('click', 'a', function(event) {
    event.preventDefault();
    let elAttr = $(this).attr('href');
    let offset = ($(this).attr('data-offset') ? $(this).attr('data-offset') : 0);
    let setHash = $(this).closest('ul').attr('data-allow-hashes');
    $('body,html').animate({
        scrollTop: $(elAttr).offset().top - offset
    }, 700);
    if (typeof setHash !== typeof undefined && setHash !== false) {
    	history.replaceState(null, null, elAttr);
	}
});
