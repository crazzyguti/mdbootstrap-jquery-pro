// Preloading script

$(document).ready(() => {
  $('#preloader-markup').load('mdb-addons/preloader.html', () => {
    $(window).load(() => {
      $('#mdb-preloader').fadeOut('slow')
    })
  })
})
