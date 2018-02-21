/* SideNav */
(($) => {

  const MENU_WIDTH = 240
  const SN_BREAKPOINT = 1440
  const MENU_WIDTH_HALF = 2
  const MENU_LEFT_MIN_BORDER = 0.3
  const MENU_LEFT_MAX_BORDER = -0.5
  const MENU_RIGHT_MIN_BORDER = -0.3
  const MENU_RIGHT_MAX_BORDER = 0.5
  const MENU_VELOCITY_OFFSET = 10

  class SideNav {

    constructor(element, options) {

      let menuOut = false

      const defaults = {
        MENU_WIDTH,
        edge: 'left',
        closeOnClick: false
      }

      options = $.extend(defaults, options)

      this.options = options

      const $element = element
      this.menu_id = $(`#${$element.attr('data-activates')}`)
      const mask_id = $(`#${this.menu_id.attr('id')}> .sidenav-bg`)

      // let menuOut = false;

      if (options.MENU_WIDTH !== MENU_WIDTH) {
        this.menu_id.css('width', options.MENU_WIDTH)
        mask_id.css('width', options.MENU_WIDTH)
      }

      const dragTarget = $('<div class="drag-target"></div>')
      $('body').append(dragTarget)

      if (options.edge === 'left') {
        this.menu_id.css('transform', 'translateX(-100%)')
        dragTarget.css({
          left: 0
        })
      } else {
        this.menu_id.addClass('right-aligned').css('transform', 'translateX(100%)')
        dragTarget.css({
          right: 0
        })
      }

      if (this.menu_id.hasClass('fixed')) {

        if (window.innerWidth > SN_BREAKPOINT) {
          this.menu_id.css('transform', 'translateX(0)')
        }

        $(window).resize(() => {
          if (window.innerWidth > SN_BREAKPOINT) {
            if ($('#sidenav-overlay').length) {
              this.removeMenu(true)
            } else {
              this.menu_id.css('transform', 'translateX(0%)')
            }
          } else if (menuOut === false) {
            if (options.edge === 'left') {
              this.menu_id.css('transform', 'translateX(-100%)')
            } else {
              this.menu_id.css('transform', 'translateX(100%)')
            }
          }

        })
      }

      if (this.options.closeOnClick === true) {
        this.menu_id.on('click', 'a:not(.collapsible-header)', () => {
          this.removeMenu()
        })
      }

      $element.click((e) => {
        e.preventDefault()
        if (menuOut === true) {
          menuOut = false
          this.removeMenu()
        } else {
          const $body = $('body')
          const overlay = $('<div id="sidenav-overlay"></div>')
          $body.append(overlay)

          if (this.options.edge === 'left') {
            this.menu_id.velocity({
              translateX: [0, -1 * options.MENU_WIDTH]
            }, {
              duration: 300,
              queue: false,
              easing: 'easeOutQuad'
            })
          } else {
            this.menu_id.velocity({
              translateX: [0, options.MENU_WIDTH]
            }, {
              duration: 300,
              queue: false,
              easing: 'easeOutQuad'
            })
          }

          overlay.click(() => {
            this.removeMenu()
          })
        }
      })

      // Touch Event
      dragTarget.click(() => {
        this.removeMenu()
      })

      dragTarget.hammer({
        prevent_default: false
      }).bind('pan', (e) => {

        if (e.gesture.pointerType === 'touch') {

          let x = e.gesture.center.x

          // Disable Scrolling
          const $body = $('body')
          const oldWidth = $body.innerWidth()
          $body.css('overflow', 'hidden')
          $body.width(oldWidth)

          // If overlay does not exist, create one and if it is clicked, close menu
          if ($('#sidenav-overlay').length === 0) {
            const overlay = $('<div id="sidenav-overlay"></div>')
            overlay.css('opacity', 0).click(() => {
              this.removeMenu()
            })
            $('body').append(overlay)
          }

          // Keep within boundaries
          if (options.edge === 'left') {
            if (x > options.MENU_WIDTH) {
              x = options.MENU_WIDTH
            } else if (x < 0) {
              x = 0
            }
          }

          if (options.edge === 'left') {
            // Left Direction
            if (x < options.MENU_WIDTH / MENU_WIDTH_HALF) {
              menuOut = false
            }
            // Right Direction
            else if (x >= options.MENU_WIDTH / MENU_WIDTH_HALF) {
              menuOut = true
            }
            this.menu_id.css('transform', `translateX(${x - options.MENU_WIDTH}px)`)
          } else {
            // Left Direction
            if (x < window.innerWidth - options.MENU_WIDTH / MENU_WIDTH_HALF) {
              menuOut = true
            }
            // Right Direction
            else if (x >= window.innerWidth - options.MENU_WIDTH / MENU_WIDTH_HALF) {
              menuOut = false
            }
            let rightPos = x - options.MENU_WIDTH / MENU_WIDTH_HALF
            if (rightPos < 0) {
              rightPos = 0
            }

            this.menu_id.css('transform', `translateX(${rightPos}px)`)
          }

          // Percentage overlay
          let overlayPerc
          if (options.edge === 'left') {
            overlayPerc = x / options.MENU_WIDTH
            $('#sidenav-overlay').velocity({
              opacity: overlayPerc
            }, {
              duration: 10,
              queue: false,
              easing: 'easeOutQuad'
            })
          } else {
            overlayPerc = Math.abs((x - window.innerWidth) / options.MENU_WIDTH)
            $('#sidenav-overlay').velocity({
              opacity: overlayPerc
            }, {
              duration: 10,
              queue: false,
              easing: 'easeOutQuad'
            })
          }
        }

      }).bind('panend', (e) => {

        if (e.gesture.pointerType === 'touch') {
          const velocityX = e.gesture.velocityX
          const x = e.gesture.center.x
          let leftPos = x - options.MENU_WIDTH
          let rightPos = x - options.MENU_WIDTH / MENU_WIDTH_HALF
          if (leftPos > 0) {
            leftPos = 0
          }
          if (rightPos < 0) {
            rightPos = 0
          }
          // panning = false;

          if (options.edge === 'left') {
            // If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
            if (menuOut && velocityX <= MENU_LEFT_MIN_BORDER || velocityX < MENU_LEFT_MAX_BORDER) {
              if (leftPos !== 0) {
                this.menu_id.velocity({
                  translateX: [0, leftPos]
                }, {
                  duration: 300,
                  queue: false,
                  easing: 'easeOutQuad'
                })
              }

              // menu_id.css({'translateX': 0});
              $('#sidenav-overlay').velocity({
                opacity: 1
              }, {
                duration: 50,
                queue: false,
                easing: 'easeOutQuad'
              })
              // dragTarget.css({width: '50%', right: 0, left: ''});
              dragTarget.css({
                width: '10px',
                right: '',
                left: 0
              })

            } else if (!menuOut || velocityX > MENU_LEFT_MIN_BORDER) {
              // Enable Scrolling
              $('body').css({
                overflow: '',
                width: ''
              })
              // Slide menu closed
              this.menu_id.velocity({
                translateX: [-1 * options.MENU_WIDTH - MENU_VELOCITY_OFFSET, leftPos]
              }, {
                duration: 200,
                queue: false,
                easing: 'easeOutQuad'
              })
              $('#sidenav-overlay').velocity({
                opacity: 0
              }, {
                duration: 200,
                queue: false,
                easing: 'easeOutQuad',
                complete() {
                  $(this).remove()
                }
              })
              // dragTarget.css({width: '50%', right: 0, left: ''});
              dragTarget.css({
                width: '10px',
                right: '',
                left: 0
              })
            }
          } else if (menuOut && velocityX >= MENU_RIGHT_MIN_BORDER || velocityX > MENU_RIGHT_MAX_BORDER) {

            this.menu_id.velocity({
              translateX: [0, rightPos]
            }, {
              duration: 300,
              queue: false,
              easing: 'easeOutQuad'
            })
            $('#sidenav-overlay').velocity({
              opacity: 1
            }, {
              duration: 50,
              queue: false,
              easing: 'easeOutQuad'
            })
            dragTarget.css({
              width: '50%',
              right: '',
              left: 0
            })
          } else if (!menuOut || velocityX < MENU_RIGHT_MIN_BORDER) {
            // Enable Scrolling
            $('body').css({
              overflow: '',
              width: ''
            })

            // Slide menu closed
            this.menu_id.velocity({
              translateX: [options.MENU_WIDTH + MENU_VELOCITY_OFFSET, rightPos]
            }, {
              duration: 200,
              queue: false,
              easing: 'easeOutQuad'
            })
            $('#sidenav-overlay').velocity({
              opacity: 0
            }, {
              duration: 200,
              queue: false,
              easing: 'easeOutQuad',
              complete: () => {
                $(this).remove()
              }
            })
            dragTarget.css({
              width: '10px',
              right: 0,
              left: ''
            })
          }

        }
      })

    }

    removeMenu(restoreMenu) {

      $('body').css({
        overflow: '',
        width: ''
      })

      if (this.options.edge === 'left') {
        this.menu_id.velocity({
          translateX: '-100%'
        }, {
          duration: 200,
          queue: false,
          easing: 'easeOutCubic',
          complete: () => {
            if (restoreMenu === true) {
              this.menu_id.removeAttr('style')
              this.menu_id.css('width', this.options.MENU_WIDTH)
            }
          }
        })
      } else {
        this.menu_id.velocity({
          translateX: '100%'
        }, {
          duration: 200,
          queue: false,
          easing: 'easeOutCubic',
          complete: () => {
            if (restoreMenu === true) {
              this.menu_id.removeAttr('style')
              this.menu_id.css('width', this.options.MENU_WIDTH)
            }
          }
        })
      }

      $('#sidenav-overlay').velocity({
        opacity: 0
      }, {
        duration: 200,
        queue: false,
        easing: 'easeOutQuad',
        complete: () => {
          $('#sidenav-overlay').remove()
        }
      })
    }

    show() {
      this.trigger('click')
    }

    hide() {
      $('#sidenav-overlay').trigger('click')
    }

  }

  $.fn.sideNav = function (options) {
    return this.each(function () {
      new SideNav($(this), options)
    })
  }

})(jQuery)
