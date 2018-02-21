/** *****************
*  File input     *
******************/
(function ($) {


  $(document).on('change', '.file-field input[type="file"]',  (e) => {

    const $this       = $(e.target)
    const $file_field = $this.closest('.file-field')
    const $path_input = $file_field.find('input.file-path')
    const files       = $this[0].files
    const file_names  = []
    for (let i = 0; i < files.length; i++) {
      const file_name = files[i].name
      file_names.push(file_name)
    }
    $path_input.val(file_names.join(', '))
    $path_input.trigger('change')

  })

}(jQuery))
