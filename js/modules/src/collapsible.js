/* COLLAPSIBLE */

(function ($) {
  $.fn.collapsible = function (options) {
    const defaults = {
      accordion: undefined
    }

    options = $.extend(defaults, options)


    return this.each(function () {

      const $this = $(this)

      let $panelHeaders = $(this).find('> li > .collapsible-header')

      const collapsibleType = $this.data('collapsible')

      // Turn off any existing event handlers
      $this.off('click.collapse', '.collapsible-header')
      $panelHeaders.off('click.collapse')


      /** **************
            Helper Functions
            ****************/

      // Accordion Open
      function accordionOpen(object) {
        $panelHeaders = $this.find('> li > .collapsible-header')
        if (object.hasClass('active')) {
          object.parent().addClass('active')
        } else {
          object.parent().removeClass('active')
        }
        if (object.parent().hasClass('active')) {
          object.siblings('.collapsible-body').stop(true, false).slideDown({
            duration: 350,
            easing: 'easeOutQuart',
            queue: false,
            complete() {
              $(this).css('height', '')
            }
          })
        } else {
          object.siblings('.collapsible-body').stop(true, false).slideUp({
            duration: 350,
            easing: 'easeOutQuart',
            queue: false,
            complete() {
              $(this).css('height', '')
            }
          })
        }

        $panelHeaders.not(object).removeClass('active').parent().removeClass('active')
        $panelHeaders.not(object).parent().children('.collapsible-body').stop(true, false).slideUp({
          duration: 350,
          easing: 'easeOutQuart',
          queue: false,
          complete() {
            $(this).css('height', '')
          }
        })
      }

      // Expandable Open
      function expandableOpen(object) {
        if (object.hasClass('active')) {
          object.parent().addClass('active')
        } else {
          object.parent().removeClass('active')
        }
        if (object.parent().hasClass('active')) {
          object.siblings('.collapsible-body').stop(true, false).slideDown({
            duration: 350,
            easing: 'easeOutQuart',
            queue: false,
            complete() {
              $(this).css('height', '')
            }
          })
        } else {
          object.siblings('.collapsible-body').stop(true, false).slideUp({
            duration: 350,
            easing: 'easeOutQuart',
            queue: false,
            complete() {
              $(this).css('height', '')
            }
          })
        }
      }

      /**
             * Check if object is children of panel header
             * @param  {Object}  object Jquery object
             * @return {Boolean} true if it is children
             */
      function isChildrenOfPanelHeader(object) {

        const panelHeader = getPanelHeader(object)

        return panelHeader.length > 0
      }

      /**
             * Get panel header from a children element
             * @param  {Object} object Jquery object
             * @return {Object} panel header object
             */
      function getPanelHeader(object) {

        return object.closest('li > .collapsible-header')
      }

      /** ***  End Helper Functions  *****/


      if (options.accordion || collapsibleType === 'accordion' || collapsibleType === undefined) { // Handle Accordion
        // Add click handler to only direct collapsible header children
        $panelHeaders = $this.find('> li > .collapsible-header')
        $panelHeaders.on('click.collapse', (e) => {
          let element = $(e.target)

          if (isChildrenOfPanelHeader(element)) {
            element = getPanelHeader(element)
          }

          element.toggleClass('active')
          accordionOpen(element)
        })
        // Open first active
        accordionOpen($panelHeaders.filter('.active').first())
      } else { // Handle Expandables
        $panelHeaders.each(function () {
          // Add click handler to only direct collapsible header children
          $(this).on('click.collapse', (e) => {
            let element = $(e.target)
            if (isChildrenOfPanelHeader(element)) {
              element = getPanelHeader(element)
            }
            element.toggleClass('active')
            expandableOpen(element)
          })
          // Open any bodies that have the active class
          if ($(this).hasClass('active')) {
            expandableOpen($(this))
          }

        })
      }

    })
  }

  $(document).ready(() => {
    $('.collapsible').collapsible()
  })
}(jQuery))
