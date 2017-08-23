 /*******************
*  File input     *
******************/
(function($) {


    $(document).on('change', '.file-field input[type="file"]',  function(e) {

        let $this       = $(e.target);
        let $file_field = $this.closest('.file-field');
        let $path_input = $file_field.find('input.file-path');
        let files       = $this[0].files;
        let file_names  = [];
        for (let i = 0; i < files.length; i++) {
            let file_name = files[i]["name"];
            file_names.push(file_name);
        }
        $path_input.val(file_names.join(', '))
        $path_input.trigger('change');

    });

})(jQuery);