// Preloading script

$(document).ready(() => {
  $('#preloader-markup').load('mdb-addons/preloader.html', () => {
    $(window).on('load', () => {
      $('#mdb-preloader').fadeOut('slow')
    })
  })
})
