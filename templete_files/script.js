var csrf = $.ajax({
    url: '/action.php?typ=getCsrf',
    async: false
}).responseText;

$('input[name=csrf]').val(csrf);

function load2() {
    window.top.document.getElementById("form-success").style.display = "none";
    window.top.document.getElementById("form-fail").style.display = "none";
    window.top.document.getElementById("dialog-form").style.display = "block";
    window.top.document.getElementById("mail_remember").value = "";
}

function submitF(id) {
    document.getElementById(id).submit();
}

function checkForm() {
    if (document.getElementById("user_pass").value != "" && document.getElementById("user_pass2").value != "") {
        if (document.getElementById("user_pass").value == document.getElementById("user_pass2").value) {
            document.getElementById("formReg").submit();
        } else {
            window.top.document.getElementById("passErr").style.display = "block";
        }
    } else {
        document.getElementById("formReg").submit();
    }
}

function checkField() {
    text = document.getElementById("com_typ").value;
    if (text == "אחר") {
        document.getElementById("com_typ2").type = "text";
        document.getElementById("com_typ2").value = "";
    } else {

        document.getElementById("com_typ2").value = text;
        document.getElementById("com_typ2").type = "hidden";
    }
}

function copymail() {
    document.getElementById("email2").value = document.getElementById("email").value;
}

function copyphone() {
    document.getElementById("phone2").value = document.getElementById("phone").value;
}

function copymail2() {
    document.getElementById("email").value = document.getElementById("email2").value;
}

function copyphone2() {
    document.getElementById("phone").value = document.getElementById("phone2").value;
}

function IsNumeric(e) {
    var keyCode = e.which ? e.which : e.keyCode
    var ret = (keyCode >= 48 && keyCode <= 57);
    return ret;
}

function LegalTz(num) {
    if (!num)
        return true;
    var tot = 0;
    var tz = new String(num);
    for (i = 0; i < 8; i++) {
        x = (((i % 2) + 1) * tz.charAt(i));
        if (x > 9) {
            x = x.toString();
            x = parseInt(x.charAt(0)) + parseInt(x.charAt(1))
        }
        tot += x;
    }

    if ((tot + parseInt(tz.charAt(8))) % 10 == 0) {
        return true;
    } else {

        alert("מספר זהות לא תקין")
        return false;
    }
}


function recaptha_callback(token) {
    _form.submit();
    //console.log(token);
}

function recaptcha() {

    grecaptcha.render('recaptcha', {
        'sitekey': recaptcha_site_key,
        'theme': 'light',
        "callback": function(token) {
            $(_form).find("input[name=g-recaptcha-response]").val(token);
            _form.submit();
            showLoader();
        }
    });

    setInterval(function() {
        let $reCaptchaIframe = $('iframe[title="recaptcha challenge"]');
        if ($reCaptchaIframe) {
            let $reCaptchaOverlay = $reCaptchaIframe.parent();
            $reCaptchaOverlay.css('position', 'fixed');
        }
    }, 1000);
    // $(this).hide();
}

var _form;

function validForm(form, callback) {
    _form = form;
    // $('.form-alert').hide();
    var id = form ? form.IsraelID : IsraelID;
    if (id) {
        var val = LegalTz(id.value);
        if (!val)
            return false;
    }

    // var captcha = $(form).find('.g-recaptcha-response');
    // if (captcha.length && !captcha.val()) {
    //     alert('לא סומן "אני לא רובוט"');
    //     return false;
    // }

    if (callback)
        callback();

    //   $(form).append($('#recaptcha'));
    grecaptcha.execute();

    //  showLoader();
    return false;
}


var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
        return parts.pop().split(";").shift();
}