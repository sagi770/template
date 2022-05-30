var $loading = $('#loading').hide();

function showLoader() {
   $loading.show();
}

function hideLoader() {
   $loading.hide();
}

function login() {
    if (isMobile.any())
        location.href = '.?page=login';
    else {
        $('#login-popup').addClass('active');
        hideLoader();
    }
}
$(document).ready(function () {
    $('.menu-toggle').click(function () {
        $('.para-drop').toggle();
    });
    $('.main-para.menu-toggle').click(function () {
        $('.para-drop').removeClass('hide');
    });
    $('.menu-bg-close').click(function () {
        $('.para-drop').addClass('hide');
    });
});
$(document).ready(function () {
    $('.basket-drop').click(function () {
        $('.sec-shadow').addClass('active');
    })
})
$(document).ready(function () {
    $('.back-arrow').click(function () {
        $('.sec-shadow').removeClass('active');
    })
})
$(document).ready(function () {
    $('.basket-menu-drop').click(function () {
        $('.sec-shadow1').toggle();
    })
    $('.menu-btn').click(function () {
        $('.menu-image-tab').addClass('show');
        $('.navbar-collapse').collapse('hide');
    })
    $('.menu-close-img').click(function () {
        $('.menu-image-tab').removeClass('show');
    })
    $('.navbar-toggler').click(function () {
        $('body').toggleClass('overflow-hidden');
    })
    $('.menu-close-img').click(function () {
        $('body').removeClass('overflow-hidden');
    })
    $('.menu-close-img').click(function () {
        $('#navbarSupportedContent').removeClass('show');
    })
    $('.basket-drop').click(function () {
        $('.basket-submenu').addClass('show');
    })
    $('.back-arrow').click(function () {
        $('.basket-submenu').removeClass('show');
    })
})
// var headOffset;
// jQuery(window).scroll(function() {
//     var sticky = jQuery('.shadow-head-1, .basket-fixed-heading'),
//         scroll = jQuery(window).scrollTop();
//     if (scroll >= headOffset) sticky.addClass('fixed');
//     else sticky.removeClass('fixed');
// });

if (!isMobile.any()) {
    $(document).ready(function () {
        $('.login-nav-btn, .login-btn').click(function () {
            $('#login-popup').addClass('active');
            //$('body').addClass('popup-opened');
            return false;
        })

        $('.register-nav-btn, .register-btn').click(function () {
            $('#register-popup').addClass('active');
            //  $('body').addClass('popup-opened');
            return false;
        })
    });
}


// $(document).ready(function() {
//     $('.register-btn').click(function() {
//         $('#login-popup').removeClass('active');
//         return false;
//     })
// });
// $(document).ready(function() {
//     $('.login-btn').click(function() {
//         $('#register-popup').removeClass('active');
//         return false;
//     })
// });
$(document).ready(function () {
    $('.login-close').click(function () {
        $('.login-register-popup').removeClass('active');
        $('.search-overlay').removeClass('active');
    })
});
$(document).ready(function () {
    $('.search').click(function () {
        $('.search-bar').addClass('active').find('input').focus();
        $('.search-overlay').addClass('active');
        $("body").addClass("popup-opened");
    })
});
$(document).ready(function () {
    $('input[name="login_submit"]').click(function () {
        if ($('#login_number').val() == '') {
            //alert('helo');
            $('#login_number').parent('div.input-field').find(".input_error").addClass('d-block');

        }
        if ($('#login_sec').val() == '') {
            //alert('helo');
            $('#login_sec').parent('div.input-field').find(".input_error").addClass('d-block');

        }

    })
});
$(document).ready(function () {
    $('input[name="register_submit"]').click(function () {
        if ($('#first_name').val() == '') {
            //alert('helo');
            $('#first_name').parent('div.input-field').find(".input_error").addClass('d-block');

        }
        if ($('#last_name').val() == '') {
            //alert('helo');
            $('#last_name').parent('div.input-field').find(".input_error").addClass('d-block');

        }
        if ($('#register_email').val() == '') {
            //alert('helo');
            $('#register_email').parent('div.input-field').find(".input_error").addClass('d-block');

        }
        if ($('#cellular').val() == '') {
            //alert('helo');
            $('#cellular').parent('div.input-field').find(".input_error").addClass('d-block');

        }
        if ($('#register_id').val() == '') {
            //alert('helo');
            $('#register_id').parent('div.input-field').find(".input_error").addClass('d-block');

        }
        if ($('#number_employee').val() == '') {
            //alert('helo');
            $('#number_employee').parent('div.input-field').find(".input_error").addClass('d-block');

        }

    })
});
$(document).click(function () {
    if ($(".search-bar").hasClass("active")) {
        $("body").removeClass("popup-opened");
        $(".search-bar").removeClass("active");
        $(".search-overlay").removeClass("active");
    }
});
$(".search-bar").click(function (e) {
    e.stopPropagation();
});
$(".search").click(function (e) {
    e.stopPropagation();
});


$('#login_number').on('keyup', function (e) {
    e.preventDefault();
    if (!$('#login_number').val().match('[0-9]')) {
        $('#login_number').val('');

    } else if ($('#login_number').val().length < 10) {
        if (!jQuery(this).parent().find(".input_error").hasClass('d-block')) {
            jQuery(this).parent().find(".input_error").addClass('d-block');
        }
    } else {
        if ($('#login_number').val().length > 10) {
            var strVal = $('#login_number').val();
            $('#login_number').val(strVal.substring(0, 10));
        }

        jQuery(this).parent().find(".input_error").removeClass('d-block');

    }

});

$('#register_id').on('keyup', function (e) {
    e.preventDefault();
    if (!$('#register_id').val().match('[0-9]')) {
        $('#register_id').val('');

    } else if ($('#register_id').val().length < 9) {
        if (!jQuery(this).parent().find(".input_error").hasClass('d-block')) {
            jQuery(this).parent().find(".input_error").addClass('d-block');
        }
    } else {
        if ($('#register_id').val().length > 9) {
            var strVal = $('#register_id').val();
            $('#register_id').val(strVal.substring(0, 9));
        }

        jQuery(this).parent().find(".input_error").removeClass('d-block');

    }

});


$('.input-validate').on('keyup', function (e) {

    if ($(this).val() != "") {

        jQuery(this).parent().find(".input_error").removeClass('d-block');
    }


});
$('#cellular').on('keyup', function (e) {
    e.preventDefault();
    if (!$('#cellular').val().match('[0-9]')) {
        $('#cellular').val('');

    } else if ($('#cellular').val().length < 10) {
        if (!jQuery(this).parent().find(".input_error").hasClass('d-block')) {
            jQuery(this).parent().find(".input_error").addClass('d-block');
        }
    } else {
        if ($('#cellular').val().length > 10) {
            var strVal = $('#cellular').val();
            $('#cellular').val(strVal.substring(0, 10));
        }

        jQuery(this).parent().find(".input_error").removeClass('d-block');

    }

});