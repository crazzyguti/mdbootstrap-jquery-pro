/** **************
*  Range Input  *
****************/
(function ($) {

  const range_wrapper = '.range-field'
  const range_type    = 'input[type=range]'
  const thumb_html    = '<span class="thumb"><span class="value"></span></span>'
  let range_mousedown = false
  let left

  const add_thumb = function() {
    const $thumb = $(thumb_html)
    $(range_type).after($thumb)
  }

  // Add thumbs;
  // $(range_type).each(add_thumb)

  $(document).on('change', range_type, function() {
    const $thumb       = $(this)
    const $thumb_value = $thumb.siblings('.thumb').find('.value')
    $thumb_value.html($thumb.val())
  })

  $(document).on('input mousedown touchstart', range_type, function(e) {
    const $this        = $(this)
    const $thumb       = $this.siblings('.thumb')
    const width        = $this.outerWidth()
    const noThumb      = !$thumb.length
    // If thumb indicator does not exist yet, create it
    if (noThumb) {
      add_thumb()
    }

    // Set indicator value
    $thumb.find('.value').html($this.val())

    range_mousedown = true
    $this.addClass('active')

    if (!$thumb.hasClass('active')) {
      $thumb.velocity(
        {
          height: '30px',
          width: '30px',
          top: '-20px',
          marginLeft: '-15px'
        },
        {
          duration: 300,
          easing: 'easeOutExpo'
        }
      )
    }

    if (e.type !== 'input') {
      const isMobile = e.pageX === undefined || e.pageX === null
      if (isMobile) {
        left = e.originalEvent.touches[0].pageX - $(this).offset().left
      } else {
        left = e.pageX - $(this).offset().left
      }

      if (left < 0) {
        left = 0
      } else if (left > width) {
        left = width
      }
      $thumb.addClass('active').css('left', left)
    }

    $thumb.find('.value').html($this.val())

  })

  $(document).on('mouseup touchend', range_wrapper, function() {
    range_mousedown = false
    $(this).removeClass('active')
  })

  $(document).on('mousemove touchmove', range_wrapper, function (e) {
    const $thumb = $(this).children('.thumb')
    let left

    if (range_mousedown) {
      if (!$thumb.hasClass('active')) {
        $thumb.velocity(
          {
            height: '30px',
            width: '30px',
            top: '-20px',
            marginLeft: '-15px'
          },
          {
            duration: 300,
            easing: 'easeOutExpo'
          })
      }
      const isMobile = e.pageX === undefined || e.pageX === null
      if (isMobile) {
        left = e.originalEvent.touches[0].pageX - $(this).offset().left
      } else {
        left = e.pageX - $(this).offset().left
      }

      const width = $(this).outerWidth()
      if (left < 0) {
        left = 0
      } else if (left > width) {
        left = width
      }

      $thumb.addClass('active').css('left', left)
      $thumb.find('.value').html($thumb.siblings(range_type).val())
    }
  })

  $(document).on('mouseout touchleave', range_wrapper, function() {
    if (!range_mousedown) {
      const $thumb = $(this).children('.thumb')

      if ($thumb.hasClass('active')) {
        $thumb.velocity(
          {
            height: '0',
            width: '0',
            top: '10px',
            marginLeft: '-6px'
          },
          {
            duration: 100
          }
        )
      }
      $thumb.removeClass('active')
    }
  })


}(jQuery))
