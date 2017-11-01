(function ($) {

  let chipsHandleEvents     = false
  const materialChipsDefaults = {
    data                : [],
    placeholder         : '',
    secondaryPlaceholder: ''
  }

  $(document).ready(() => {
    // Handle removal of static chips.
    $(document).on('click', '.chip .close', function () {

      const $this  = $(this)
      const $chips = $this.closest('.chips')

      if ($chips.data('initialized')) {
        return
      }

      $this.closest('.chip').remove()

    })
  })

  $.fn.material_chip = function (options) {
    const self     = this
    this.$el       = $(this)
    this.$document = $(document)
    this.SELS      = {
      CHIPS        : '.chips',
      CHIP         : '.chip',
      INPUT        : 'input',
      DELETE       : '.fa',
      SELECTED_CHIP: '.selected'
    }

    if (options === 'data') {
      return this.$el.data('chips')
    }

    if (options === 'options') {
      return this.$el.data('options')
    }

    this.$el.data('options', $.extend({}, materialChipsDefaults, options))

    // Initialize
    this.init = function () {
      let i = 0
      self.$el.each(function () {

        const $chips = $(this)
        if ($chips.data('initialized')) {
          return
        } // Prevent double initialization.

        const options = $chips.data('options')
        if (!options.data || !(options.data instanceof Array)) {
          options.data = []
        }

        $chips.data('chips', options.data)
        $chips.data('index', i)
        $chips.data('initialized', true)

        if (!$chips.hasClass(self.SELS.CHIPS)) {
          $chips.addClass('chips')
        }

        self.chips($chips)
        i++

      })
    }

    this.handleEvents = function () {
      const SELS = self.SELS

      self.$document.on('click', SELS.CHIPS, (e) => {
        $(e.target).find(SELS.INPUT).focus()
      })

      self.$document.on('click', SELS.CHIP, function () {
        $(SELS.CHIP).removeClass('selected')
        $(this).toggleClass('selected')
      })

      self.$document.on('keydown', (e) => {
        if ($(e.target).is('input, textarea')) {
          return
        }

        // delete
        const $chip  = self.$document.find(SELS.CHIP + SELS.SELECTED_CHIP)
        const $chips = $chip.closest(SELS.CHIPS)
        const length = $chip.siblings(SELS.CHIP).length
        let index

        if (!$chip.length) {
          return
        }

        const isBackspaceOrDelete = e.which === 8 || e.which === 46
        const isLeftArrow         = e.which === 37
        const isRightArrow        = e.which === 39

        if (isBackspaceOrDelete) {
          e.preventDefault()
          const chipsIndex = $chips.data('index')
          index          = $chip.index()
          self.deleteChip(chipsIndex, index, $chips)
          let selectIndex = null

          if (index + 1 < length) {
            selectIndex = index
          } else if (index === length || index + 1 === length) {
            selectIndex = length - 1
          }

          if (selectIndex < 0) {
            selectIndex = null
          }

          if (selectIndex !== null) {
            self.selectChip(chipsIndex, selectIndex, $chips)
          }
          if (!length) {
            $chips.find('input').focus()
          }

        } else if (isLeftArrow) {

          index = $chip.index() - 1
          if (index < 0) {
            return
          }
          $(SELS.CHIP).removeClass('selected')
          self.selectChip($chips.data('index'), index, $chips)

        } else if (isRightArrow) {

          index = $chip.index() + 1
          $(SELS.CHIP).removeClass('selected')
          if (index > length) {
            $chips.find('input').focus()
            return
          }
          self.selectChip($chips.data('index'), index, $chips)

        }
      })

      self.$document.on('focusin', `${SELS.CHIPS} ${SELS.INPUT}`, (e) => {
        $(e.target).closest(SELS.CHIPS).addClass('focus')
        $(SELS.CHIP).removeClass('selected')
      })

      self.$document.on('focusout', `${SELS.CHIPS} ${SELS.INPUT}`, (e) => {
        $(e.target).closest(SELS.CHIPS).removeClass('focus')
      })

      self.$document.on('keydown', `${SELS.CHIPS} ${SELS.INPUT}`, (e) => {
        const $target = $(e.target)
        const $chips = $target.closest(SELS.CHIPS)
        const chipsIndex = $chips.data('index')
        const chipsLength = $chips.children(SELS.CHIP).length

        const isEnter = e.which === 13

        if (isEnter) {
          e.preventDefault()
          self.addChip(
            chipsIndex,
            {
              tag: $target.val()
            },
            $chips
          )
          $target.val('')
          return
        }

        const isLeftArrowOrDelete = e.keyCode === 8 || e.keyCode === 37
        const isValueEmpty = $target.val() === ''

        if (isLeftArrowOrDelete && isValueEmpty && chipsLength) {
          self.selectChip(chipsIndex, chipsLength - 1, $chips)
          $target.blur()
          return
        }
      })

      self.$document.on('click', `${SELS.CHIPS} ${SELS.DELETE}`, (e) => {
        const $target = $(e.target)
        const $chips = $target.closest(SELS.CHIPS)
        const $chip = $target.closest(SELS.CHIP)
        e.stopPropagation()
        self.deleteChip(
          $chips.data('index'),
          $chip.index(),
          $chips
        )
        $chips.find('input').focus()
      })

    }

    this.chips = function ($chips) {
      let html    = ''
      $chips.data('chips').forEach((elem) => {
        html += self.renderChip(elem)
      })
      html += '<input class="input" placeholder="">'
      $chips.html(html)
      self.setPlaceholder($chips)
    }

    this.renderChip = function (elem) {
      if (!elem.tag) {
        return
      }

      let html = `<div class="chip">${elem.tag}`

      if (elem.image) {
        html += ` <img src="${elem.image}"> `
      }

      html += '<i class="close fa fa-times"></i>'
      html += '</div>'
      return html

    }

    this.setPlaceholder = function ($chips) {
      const options = $chips.data('options')
      if ($chips.data('chips').length && options.placeholder) {
        $chips.find('input').prop('placeholder', options.placeholder)
      } else if (!$chips.data('chips').length && options.secondaryPlaceholder) {
        $chips.find('input').prop('placeholder', options.secondaryPlaceholder)
      }
    }

    this.isValid = function ($chips, elem) {
      const chips = $chips.data('chips')
      let exists = false
      for (let i = 0; i < chips.length; i++) {
        if (chips[i].tag === elem.tag) {
          exists = true
          return
        }
      }
      return elem.tag !== '' && !exists
    }

    this.addChip = function (chipsIndex, elem, $chips) {
      if (!self.isValid($chips, elem)) {
        return
      }

      const chipHtml = self.renderChip(elem)
      $chips.data('chips').push(elem)
      $(chipHtml).insertBefore($chips.find('input'))
      $chips.trigger('chip.add', elem)
      self.setPlaceholder($chips)
    }

    this.deleteChip = function (chipsIndex, chipIndex, $chips) {
      const chip = $chips.data('chips')[chipIndex]
      $chips.find('.chip').eq(chipIndex).remove()
      $chips.data('chips').splice(chipIndex, 1)
      $chips.trigger('chip.delete', chip)
      self.setPlaceholder($chips)
    }

    this.selectChip = function (chipsIndex, chipIndex, $chips) {
      const $chip = $chips.find('.chip').eq(chipIndex)
      if ($chip && $chip.hasClass('selected') === false) {
        $chip.addClass('selected')
        $chips.trigger('chip.select', $chips.data('chips')[chipIndex])
      }
    }

    this.getChipsElement = function (index, $chips) {
      return $chips.eq(index)
    }

    // init
    this.init()

    if (!chipsHandleEvents) {
      this.handleEvents()
      chipsHandleEvents = true
    }
  }
}(jQuery))
