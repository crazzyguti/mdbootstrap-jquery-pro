/* FORMS */
(($) => {
    $(document).ready(() => {

        // Text based inputs
        const input_selector = ["text","password","email","url","tel","number","search","search-md"]
                .map(selector => `input[type=${selector}]`)
                .join(", ") + ", textarea";

        const text_area_selector = '.materialize-textarea';

        const update_text_fields = ($input) => {

            let $labelAndIcon  = $input.siblings("label, i");
            let hasValue       = $input.val().length;
            let hasPlaceholder = $input.attr("placeholder");
            // let isValid     = $input.validity.badInput === true;
            let addOrRemove    = (hasValue || hasPlaceholder? "add" : "remove") + "Class";

            $labelAndIcon[addOrRemove]("active");

        }

        const validate_field = ($input) => {

            if($input.hasClass("validate")) {
                let value   = $input.val();
                let noValue = !value.length;
                let isValid = !$input[0].validity.badInput;

                if(noValue && isValid)
                    $input.removeClass("valid").removeClass("invalid");
                else {
                    let valid  = $input.is(":valid");
                    let length = +$input.attr("length") || 0;
                    
                    if(valid && (!length || length > value.length))
                        $input.removeClass("invalid").addClass("valid");    
                    else
                        $input.removeClass("valid").addClass("invalid");

                }

            }

        };

        const textarea_auto_resize = () => {

            let $textarea  = $(this);
            if($textarea.val().length) {
                let $hiddenDiv = $(".hiddendiv");
                let fontFamily = $textarea.css('font-family');
                let fontSize   = $textarea.css('font-size');

                if (fontSize)
                    hiddenDiv.css('font-size', fontSize);
                if (fontFamily)
                    hiddenDiv.css('font-family', fontFamily);
                if ($textarea.attr('wrap') === "off")
                    hiddenDiv.css('overflow-wrap', "normal").css('white-space', "pre");


                $hiddenDiv.text($textarea.val() + '\n');
                let content = hiddenDiv.html().replace(/\n/g, '<br>');
                $hiddenDiv.html(content);

                // When textarea is hidden, width goes crazy.
                // Approximate with half of window size
                $hiddenDiv.css('width', $textarea.is(':visible') ? $textarea.width() : ($(window).width() / 2));
                $textarea.css('height', $hiddenDiv.height());
            }

        }

        // Set active on labels and icons (DOM ready scope);
        $(input_selector).each((index, input) => {
            let $this          = $(input);
            let $labelAndIcon  = $this.siblings("label, i");
            update_text_fields($this);
            let isValid        = input.validity.badInput; // pure js 
            if(isValid)
                $labelAndIcon.addClass("active");
        });

        // Add active when element has focus
        $(document).on('focus', input_selector, e => {
            $(e.target).siblings('label, i').addClass('active');
        });

        // Remove active on blur when not needed or invalid 
        $(document).on('blur', input_selector, e => {
            let $this         = $(e.target);
            let noValue       = !$this.val();
            let invalid       = !e.target.validity.badInput;
            let noPlaceholder = $this.attr("placeholder") === undefined;

            if(noValue && invalid && noPlaceholder)
                $this.siblings('label, i').removeClass('active');
            
            validate_field($this);
        });

        // Add active if form auto complete
        $(document).on('change', input_selector, e => {
            let $this = $(e.target);
            update_text_fields($this);
            validate_field($this);
        }); 

        // Handle HTML5 autofocus
        $("input[autofocus]").siblings("label, i").addClass("active");

        // HTML form reset
        $(document).on('reset', e => {
            let $formReset = $(e.target);
            if($formReset.is('form')) {

                let $formInputs = $formReset.find(input_selector);
                // Reset inputs
                $formInputs
                    .removeClass("valid")
                    .removeClass("invalid")
                    .each((index, input) => {
                        let $this          = $(input);
                        let noDefaultValue = !$this.val();
                        let noPlaceholder  = !$this.attr("placeholder");
                        if(noDefaultValue && noPlaceholder)
                            $this.siblings("label, i").removeClass("active");
                    });
                    
                // Reset select
                $formReset.find('select.initialized').each((index, select) => {
                    let $select        = $(select);
                    let $visible_input = $select.siblings("input.select-dropdown");
                    let default_value  = $select.children("[selected]").val();

                    $select.val(default_value);
                    $visible_input.val(default_value);
                });
            }
        });

        // Textarea Auto Resize
        if (!$('.hiddendiv').first().length) {
            $hiddenDiv = $('<div class="hiddendiv common"></div>');
            $('body').append($hiddenDiv);
        }

        $(text_area_selector).each(textarea_auto_resize);
        $('body').on('keyup keydown', text_area_selector, textarea_auto_resize);

    });

})(jQuery);