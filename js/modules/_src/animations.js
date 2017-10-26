// Animations
$(document).ready(() => {
  $('.js--triggerAnimation').click((e) => {
    e.preventDefault()
    const anim = $('.js--animations').val()
    testAnim(anim)
  })

  $('.js--animations').change(function () {
    const anim = $(this).val()
    testAnim(anim)
  })

  $('.mdb-select').material_select()

  new WOW().init()

})

function testAnim(x) {
  $('#animationSandbox').removeClass().addClass(`${x} animated`).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    $(this).removeClass()
  })
}
