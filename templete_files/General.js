function redirector(LandingURL, Target, TransactionId, StatusCode, StatusDescription, ApprovalNo, Token, ConfirmationKey, ParamX, UserKey, UseEndOfProcess,
    FeedbackDataTransferMethod)
{

    this.LandingURL = LandingURL.trim();
    this.Target = Target.trim();
    this.TransactionId = TransactionId.trim();
    this.StatusCode = StatusCode.trim();
    this.StatusDescription = StatusDescription.trim();
    this.ApprovalNo = ApprovalNo.trim();
    this.Token = Token.trim();
    this.ConfirmationKey = ConfirmationKey.trim();
    if (ParamX)
    {
        this.ParamX = ParamX.trim();
    }
    this.UserKey = UserKey.trim();
    this.UseEndOfProcess = UseEndOfProcess.trim();
    this.FeedbackDataTransferMethod = FeedbackDataTransferMethod.trim();
    
    this.redirectByGet = function() {

        if (typeof console == "object") {
            console.log(LandingURL);
        }
        var queryString = addQueryStringParameter(LandingURL, 'PelecardTransactionId', TransactionId);
        queryString = addQueryStringParameter(queryString, 'PelecardStatusCode', StatusCode);
        queryString = addQueryStringParameter(queryString, 'ApprovalNo', ApprovalNo);
        queryString = addQueryStringParameter(queryString, 'Token', Token);
        queryString = addQueryStringParameter(queryString, 'ConfirmationKey', ConfirmationKey);
        queryString = addQueryStringParameter(queryString, 'ParamX', ParamX);
        queryString = addQueryStringParameter(queryString, 'UserKey', UserKey);

        if (Target == '_top')
            top.window.location = queryString;
        else
            window.location = queryString;
    };

    this.redirectByPost = function () {
        var form = $('<form action="' + LandingURL + '" target="' + Target + '" method="POST"></form>');
        form.append('<input type="hidden" name="PelecardTransactionId" value="' + TransactionId + '" />');
        form.append('<input type="hidden" name="PelecardStatusCode" value="' + StatusCode + '" />');
        form.append('<input type="hidden" name="ApprovalNo" value="' + ApprovalNo + '" />');
        form.append('<input type="hidden" name="Token" value="' + Token + '" />');
        form.append('<input type="hidden" name="ConfirmationKey" value="' + ConfirmationKey + '" />');
        form.append('<input type="hidden" name="ParamX" value="' + ParamX + '" />');
        form.append('<input type="hidden" name="UserKey" value="' + UserKey + '" />');

        $('body').append(form);
        $(form).submit();

    };

    this.redirectByEOP = function () {
        var form = $('<form action="PaymentGW/EndOfProcess" target="' + Target + '" method="POST"></form>');
        form.append('<input type="hidden" name="PelecardTransactionId" value="' + TransactionId + '" />');
        form.append('<input type="hidden" name="StatusCode" value="' + StatusCode + '" />');
        form.append('<input type="hidden" name="StatusDescription" value="' + StatusDescription + '" />');
        form.append('<input type="hidden" name="ApprovalNo" value="' + ApprovalNo + '" />');
        form.append('<input type="hidden" name="Token" value="' + Token + '" />');
        form.append('<input type="hidden" name="ConfirmationKey" value="' + ConfirmationKey + '" />');
        form.append('<input type="hidden" name="ParamX" value="' + ParamX + '" />');
        form.append('<input type="hidden" name="UserKey" value="' + UserKey + '" />');
        form.append('<input type="hidden" name="LandingURL" value="' + LandingURL + '" />');
        form.append('<input type="hidden" name="FeedbackDataTransferMethod" value="' + FeedbackDataTransferMethod + '" />');
        form.append('<input type="hidden" name="UseEndOfProcess" value="' + UseEndOfProcess + '" />');
        $('body').append(form);
        $(form).submit();

    }

}



function addQueryStringParameter(url, key, value) {
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
    if (url.match(re)) {
        return url.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        var hash = '';
        var separator = url.indexOf('?') !== -1 ? "&" : "?";
        if (url.indexOf('#') !== -1) {
            hash = url.replace(/.*#/, '#');
            url = url.replace(/#.*/, '');
        }
        return url + separator + key + "=" + value + hash;
    }
}

function blockScreenAjaxLoading ()
{
    var bg = "rgb(0,0,0)";
    var msg = "<h3 style='direction:rtl;'><span style='color:white; margin-left:14px;'>טוען...</span><img src ='/Content/images/ajaxloader.gif' style='margin-top: -6px;'/></h3>";

    $(document).ajaxStart($.blockUI({
        overlayCSS: { backgroundColor: 'transparent' }, message: msg, css:
        {
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            'border-radius': '10px',
            opacity: .75,
            background: bg,
            border: 'none', left: '45%', height: '60px', width: '160px'
       }
    })).ajaxStop($.unblockUI);
}

function WaitScreen()
{
    $(document).block({
        message:
            '<div class="block_ui_container">' +
                '<img src="../Content/Images/alazman-wait.png" class="block_ui_background" />' +
                '<p class="block_ui_text">' + "המתן" + '</p>' +
                '<img src="../Content/Images/alazman-loader.gif" class="block_ui_loader" />' +
            '</div>',
        fadeIn: 250,
        css: {
            backgroundColor: 'transparent',
            border: 'none',
            width: '200px'
        }
    });
}

