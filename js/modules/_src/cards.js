/* CARD REVEAL */
(function ($) {
  $(document).ready(() => {

    $(document).on('click.card', '.card', function (e) {

      const $this    = $(this)
      const isReveal = $this.find('.card-reveal').length

      if (isReveal) {

        const $clicked        = $(e.target)
        const isTitle         = $clicked.is('.card-reveal .card-title')
        const isTitleIcon     = $clicked.is('.card-reveal .card-title i')
        const isActivator     = $clicked.is('.card .activator')
        const isActivatorIcon = $clicked.is('.card .activator i')

        if (isTitle || isTitleIcon) { // down

          $this.find('.card-reveal')
            .velocity(
              {
                translateY: 0
              },
              {
                duration: 225,
                queue   : false,
                easing  : 'easeInOutQuad',
                complete() {
                  $(this).css({
                    display: 'none'
                  })
                }
              }
            )

        } else if (isActivator || isActivatorIcon) { // up

          $this.find('.card-reveal')
            .css({
              display: 'block'
            })
            .velocity('stop', false)
            .velocity(
              {
                translateY: '-100%'
              },
              {
                duration: 300,
                queue: false,
                easing: 'easeInOutQuad'
              }
            )

        }

      }


    })

    $('.rotate-btn').on('click', function () {

      const cardId = $(this).attr('data-card')
      $(`#${cardId}`).toggleClass('flipped')

    })

  })
}(jQuery))

// Social reveal
$(document).ready(($) => {

  $('.card-share > a').on('click', function (e) {
    e.preventDefault() // prevent default action - hash doesn't appear in url
    $(this).parent().find('div').toggleClass('social-reveal-active')
    $(this).toggleClass('share-expanded')
  })
})
