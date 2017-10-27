let WOW;

(function ($) {

  WOW = function () {

    return {

      init() {

        const animationName = []

        let once = 1

        function mdbWow() {

          const windowHeight = window.innerHeight
          const scroll = window.scrollY

          $('.wow').each(function () {

            if ($(this).css('visibility') === 'visible') {
              return
            }

            if (windowHeight + scroll - 100 > getOffset(this) && scroll < getOffset(this) || windowHeight + scroll - 100 > getOffset(this) + $(this).height() && scroll < getOffset(this) + $(this).height() || windowHeight + scroll === $(document).height() && getOffset(this) + 100 > $(document).height()) {

              const index = $(this).index('.wow')

              let delay = $(this).attr('data-wow-delay')

              if (delay) {

                delay = $(this).attr('data-wow-delay').slice(0, -1)

                let self = this

                const timeout = parseFloat(delay) * 1000

                $(self).addClass('animated')
                $(self).css({
                  visibility:'visible'
                })
                $(self).css({
                  'animation-delay': delay
                })
                $(self).css({
                  'animation-name': animationName[index]
                })

                let removeTime = $(this).css('animation-duration').slice(0, -1) * 1000

                if ($(this).attr('data-wow-delay')) {

                  removeTime += $(this).attr('data-wow-delay').slice(0, -1) * 1000

                }

                let self = this

                setTimeout(() => {

                  $(self).removeClass('animated')

                }, removeTime)

              } else {

                $(this).addClass('animated')
                $(this).css({
                  visibility:'visible'
                })
                $(this).css({
                  'animation-name': animationName[index]
                })

                const removeTime = $(this).css('animation-duration').slice(0, -1) * 1000

                const self = this

                setTimeout(() => {

                  $(self).removeClass('animated')

                }, removeTime)

              }

            }

          })

        }

        function appear() {

          $('.wow').each(function () {

            const index = $(this).index('.wow')

            let delay = $(this).attr('data-wow-delay')

            if (delay) {

              delay = $(this).attr('data-wow-delay').slice(0, -1)

              const timeout = parseFloat(delay) * 1000

              $(this).addClass('animated')
              $(this).css({
                visibility:'visible'
              })
              $(this).css({
                'animation-delay': `${delay}s`
              })
              $(this).css({
                'animation-name': animationName[index]
              })

            } else {

              $(this).addClass('animated')
              $(this).css({
                visibility:'visible'
              })
              $(this).css({
                'animation-name': animationName[index]
              })

            }

          })

        }

        function hide() {

          const windowHeight = window.innerHeight
          const scroll = window.scrollY


          $('.wow.animated').each(function () {

            if (windowHeight + scroll - 100 > getOffset(this) && scroll > getOffset(this) + 100 || windowHeight + scroll - 100 < getOffset(this) && scroll < getOffset(this) + 100 || getOffset(this) + $(this).height > $(document).height() - 100) {

              $(this).removeClass('animated')
              $(this).css({
                'animation-name': 'none'
              })
              $(this).css({
                visibility:'hidden'
              })

            } else {

              let removeTime = $(this).css('animation-duration').slice(0, -1) * 1000

              if ($(this).attr('data-wow-delay')) {

                removeTime += $(this).attr('data-wow-delay').slice(0, -1) * 1000

              }

              const self = this

              setTimeout(() => {

                $(self).removeClass('animated')

              }, removeTime)

            }

          })

          mdbWow()

          once--

        }

        function getOffset(elem) {

          const box = elem.getBoundingClientRect()

          const body = document.body
          const docEl = document.documentElement

          const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop

          const clientTop = docEl.clientTop || body.clientTop || 0

          const top  = box.top + scrollTop - clientTop

          return Math.round(top)
        }

        $('.wow').each(function () {

          $(this).css({
            visibility:'hidden'
          })
          animationName[$(this).index('.wow')] = $(this).css('animation-name')
          $(this).css({
            'animation-name': 'none'
          })

        })

        $(window).scroll(() => {

          if (once) {

            hide()

          } else {

            mdbWow()

          }

        })

        appear()

      }
    }
  }

}(jQuery))
