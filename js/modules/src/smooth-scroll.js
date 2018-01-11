// SMOOTH SCROLL
const SMOOTH_SCROLL_DURATION = 700

$('.smooth-scroll').on('click', 'a', function(event) {
  event.preventDefault()
  const elAttr = $(this).attr('href')
  const offset = $(this).attr('data-offset') ? $(this).attr('data-offset') : 0
  const setHash = $(this).closest('ul').attr('data-allow-hashes')
  $('body,html').animate({
    scrollTop: $(elAttr).offset().top - offset
  }, SMOOTH_SCROLL_DURATION)
  if (typeof setHash !== typeof undefined && setHash !== false) {
    history.replaceState(null, null, elAttr)
  }
})
