/* SideNav */
(($) => {

    const menuWidth = 240;
    const sn_breakpoint = 1440;

    class SideNav {

        constructor(element, options) {

            let menuOut = false;

            const defaults = {
                menuWidth: menuWidth,
                edge: 'left',
                closeOnClick: false
            }

            options = $.extend(defaults, options);

            this.options = options;

            let $element = element;
            this.menu_id = $('#' + $element.attr('data-activates'));
            const mask_id = $('#' + this.menu_id.attr('id') + '> .sidenav-bg');

            // let menuOut = false;

            if (options.menuWidth != menuWidth) {
                this.menu_id.css('width', options.menuWidth);
                mask_id.css('width', options.menuWidth);
            }

            const dragTarget = $('<div class="drag-target"></div>');
            $('body').append(dragTarget);

            if (options.edge == 'left') {
                this.menu_id.css('transform', 'translateX(-100%)');
                dragTarget.css({
                    'left': 0
                });
            } else {
                this.menu_id.addClass('right-aligned').css('transform', 'translateX(100%)');
                dragTarget.css({
                    'right': 0
                });
            }

            if (this.menu_id.hasClass('fixed')) {

                if (window.innerWidth > sn_breakpoint) {
                    this.menu_id.css('transform', 'translateX(0)');
                }

                $(window).resize(() => {
                    if (window.innerWidth > sn_breakpoint) {
                        if ($('#sidenav-overlay').length) {
                            this.removeMenu(true);
                        } else {
                            this.menu_id.css('transform', 'translateX(0%)');
                        }
                    } else if (menuOut === false) {
                        if (options.edge === 'left') {
                            this.menu_id.css('transform', 'translateX(-100%)');
                        } else {
                            this.menu_id.css('transform', 'translateX(100%)');
                        }
                    }

                });
            }

            if (this.options.closeOnClick === true) {
                this.menu_id.on("click", "a:not(.collapsible-header)", () => {
                    sn.removeMenu();
                });
            }

            $element.click((e) => {
                e.preventDefault();
                if (menuOut === true) {
                    menuOut = false;
                    this.removeMenu();
                } else {
                    const $body = $('body');
                    let overlay = $('<div id="sidenav-overlay"></div>');
                    $body.append(overlay);

                    if (this.options.edge === 'left') {
                        this.menu_id.velocity({
                            'translateX': [0, -1 * options.menuWidth]
                        }, {
                            duration: 300,
                            queue: false,
                            easing: 'easeOutQuad'
                        });
                    } else {
                        this.menu_id.velocity({
                            'translateX': [0, options.menuWidth]
                        }, {
                            duration: 300,
                            queue: false,
                            easing: 'easeOutQuad'
                        });
                    }

                    overlay.click(() => {
                        this.removeMenu();
                    });
                }
            });


            // Touch Event
            dragTarget.click((e) => {
                this.removeMenu();
            })

            dragTarget.hammer({
                prevent_default: false
            }).bind('pan', (e) => {

                if (e.gesture.pointerType == "touch") {

                    var direction = e.gesture.direction;
                    var x = e.gesture.center.x;
                    var y = e.gesture.center.y;
                    var velocityX = e.gesture.velocityX;

                    // Disable Scrolling
                    var $body = $('body');
                    var oldWidth = $body.innerWidth();
                    $body.css('overflow', 'hidden');
                    $body.width(oldWidth);

                    // If overlay does not exist, create one and if it is clicked, close menu
                    if ($('#sidenav-overlay').length === 0) {
                        var overlay = $('<div id="sidenav-overlay"></div>');
                        overlay.css('opacity', 0).click((e) => {
                            this.removeMenu();
                        });
                        $('body').append(overlay);
                    }

                    // Keep within boundaries
                    if (options.edge === 'left') {
                        if (x > options.menuWidth) {
                            x = options.menuWidth;
                        } else if (x < 0) {
                            x = 0;
                        }
                    }

                    if (options.edge === 'left') {
                        // Left Direction
                        if (x < (options.menuWidth / 2)) {
                            menuOut = false;
                        }
                        // Right Direction
                        else if (x >= (options.menuWidth / 2)) {
                            menuOut = true;
                        }
                        this.menu_id.css('transform', 'translateX(' + (x - options.menuWidth) + 'px)');
                    } else {
                        // Left Direction
                        if (x < (window.innerWidth - options.menuWidth / 2)) {
                            menuOut = true;
                        }
                        // Right Direction
                        else if (x >= (window.innerWidth - options.menuWidth / 2)) {
                            menuOut = false;
                        }
                        var rightPos = (x - options.menuWidth / 2);
                        if (rightPos < 0) {
                            rightPos = 0;
                        }

                        this.menu_id.css('transform', 'translateX(' + rightPos + 'px)');
                    }


                    // Percentage overlay
                    var overlayPerc;
                    if (options.edge === 'left') {
                        overlayPerc = x / options.menuWidth;
                        $('#sidenav-overlay').velocity({
                            opacity: overlayPerc
                        }, {
                            duration: 10,
                            queue: false,
                            easing: 'easeOutQuad'
                        });
                    } else {
                        overlayPerc = Math.abs((x - window.innerWidth) / options.menuWidth);
                        $('#sidenav-overlay').velocity({
                            opacity: overlayPerc
                        }, {
                            duration: 10,
                            queue: false,
                            easing: 'easeOutQuad'
                        });
                    }
                }

            }).bind('panend', (e) => {

                if (e.gesture.pointerType == "touch") {
                    var velocityX = e.gesture.velocityX;
                    var x = e.gesture.center.x;
                    var leftPos = x - options.menuWidth;
                    var rightPos = x - options.menuWidth / 2;
                    if (leftPos > 0) {
                        leftPos = 0;
                    }
                    if (rightPos < 0) {
                        rightPos = 0;
                    }
                    //panning = false;

                    if (options.edge === 'left') {
                        // If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
                        if ((menuOut && velocityX <= 0.3) || velocityX < -0.5) {
                            if (leftPos != 0) {
                                this.menu_id.velocity({
                                    'translateX': [0, leftPos]
                                }, {
                                    duration: 300,
                                    queue: false,
                                    easing: 'easeOutQuad'
                                });
                            }

                            // menu_id.css({'translateX': 0});
                            $('#sidenav-overlay').velocity({
                                opacity: 1
                            }, {
                                duration: 50,
                                queue: false,
                                easing: 'easeOutQuad'
                            });
                            // dragTarget.css({width: '50%', right: 0, left: ''});
                            dragTarget.css({
                                width: '10px',
                                right: '',
                                left: 0
                            });

                        } else if (!menuOut || velocityX > 0.3) {
                            // Enable Scrolling
                            $('body').css({
                                overflow: '',
                                width: ''
                            });
                            // Slide menu closed
                            this.menu_id.velocity({
                                'translateX': [-1 * options.menuWidth - 10, leftPos]
                            }, {
                                duration: 200,
                                queue: false,
                                easing: 'easeOutQuad'
                            });
                            $('#sidenav-overlay').velocity({
                                opacity: 0
                            }, {
                                duration: 200,
                                queue: false,
                                easing: 'easeOutQuad',
                                complete: function() {
                                    $(this).remove();
                                }
                            });
                            // dragTarget.css({width: '50%', right: 0, left: ''});
                            dragTarget.css({
                                width: '10px',
                                right: '',
                                left: 0
                            });
                        }
                    } else {
                        if ((menuOut && velocityX >= -0.3) || velocityX > 0.5) {

                            this.menu_id.velocity({
                                'translateX': [0, rightPos]
                            }, {
                                duration: 300,
                                queue: false,
                                easing: 'easeOutQuad'
                            });
                            $('#sidenav-overlay').velocity({
                                opacity: 1
                            }, {
                                duration: 50,
                                queue: false,
                                easing: 'easeOutQuad'
                            });
                            dragTarget.css({
                                width: '50%',
                                right: '',
                                left: 0
                            });
                        } else if (!menuOut || velocityX < -0.3) {
                            // Enable Scrolling
                            $('body').css({
                                overflow: '',
                                width: ''
                            });

                            // Slide menu closed
                            this.menu_id.velocity({
                                'translateX': [options.menuWidth + 10, rightPos]
                            }, {
                                duration: 200,
                                queue: false,
                                easing: 'easeOutQuad'
                            });
                            $('#sidenav-overlay').velocity({
                                opacity: 0
                            }, {
                                duration: 200,
                                queue: false,
                                easing: 'easeOutQuad',
                                complete: () => {
                                    $(this).remove();
                                }
                            });
                            dragTarget.css({
                                width: '10px',
                                right: 0,
                                left: ''
                            });
                        }
                    }

                }
            });

        }

        removeMenu(restoreMenu) {

            let panning = false;
            let menuOut = false;

            let leftPos = '-' + this.options.menuWidth;
            let rightPos = window.innerWidth;

            $('body').css({
                overflow: '',
                width: ''
            });

            if (this.options.edge === 'left') {
                this.menu_id.velocity({
                    'translateX': '-100%'
                }, {
                    duration: 200,
                    queue: false,
                    easing: 'easeOutCubic',
                    complete: () => {
                        if (restoreMenu === true) {
                            this.menu_id.removeAttr('style');
                            this.menu_id.css('width', this.options.menuWidth);
                        }
                    }
                });
            } else {
                this.menu_id.velocity({
                    'translateX': '100%'
                }, {
                    duration: 200,
                    queue: false,
                    easing: 'easeOutCubic',
                    complete: () => {
                        if (restoreMenu === true) {
                            this.menu_id.removeAttr('style');
                            this.menu_id.css('width', this.options.menuWidth);
                        }
                    }
                });
            }

            $('#sidenav-overlay').velocity({
                opacity: 0
            }, {
                duration: 200,
                queue: false,
                easing: 'easeOutQuad',
                complete: () => {
                    $('#sidenav-overlay').remove();
                }
            });
        }

        show() {
            this.trigger('click');
        };

        hide() {
            $('#sidenav-overlay').trigger('click');
        }

    }

    $.fn.sideNav = function(options) {
        return this.each(function() {
            new SideNav($(this), options);
        });


        // if ( typeof SideNav.methodOrOptions + '()' === 'function' ) {
        //  // return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        //  console.log("I'm a funciton");
        // } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
        //  let sn = new SideNav();
        //  return sn.init( this, arguments );
        // } else {
        //  $.error( 'Method ' +  methodOrOptions + ' does not exist' );
        // }




    };

    $(document).ready(() => {
        $(".button-collapse").sideNav({
            // edge: 'right'
        });
    });

})(jQuery);