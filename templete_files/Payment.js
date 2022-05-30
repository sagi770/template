var payment = {

    error_codes_inputs: {
        "033": $('#credit_card_number_input'),
        "039": $('#credit_card_number_input')
    },

    brands: [
        { regex: '^(50|51|52|53|54|55|56|57|58)', logoUrl: 'Content/Images/MastercardLogo.png' },
        { regex: '^4', logoUrl: 'Content/Images/VisaLogo.png' },
        { regex: '^(67)', logoUrl: 'Content/Images/MaestroLogo.png' },
        { regex: '^(36|38|30)', logoUrl: 'Content/Images/DinersLogo.png' },
        { regex: '^(34|37|11)', logoUrl: 'Content/Images/AmexLogo.png' },
        { regex: '^(6011)', logoUrl: 'Content/Images/Discover.png' },
    ],

    init: function (generalpar) {
        if (payment.isIE() == 8) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }

        payment.generalpar = generalpar;

        $('#ParamX').val(generalpar.ParamX);

        //var langauge = '@Html.Raw(Model.Language)';
        //$("html").attr("lang", langauge);

        payment.submitModel = new SubmitModel();
        payment.errorMsg = '';

        (new Image).src = "../Content/Images/alazman-wait.png";
        (new Image).src = "../Content/Images/alazman-loader.gif";

        payment.rgx_mail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        payment.reg_mail_address_allowed_characters = new RegExp(/^([a-zA-Z0-9]|\.|_|-|@)+$/);
        payment.rgx_total = new RegExp(/^[\d-\.]+$/);
        payment.rgx_cardnumber = new RegExp(/^([\d*-]|[\d ])+$/);
        payment.rgx_stripped_card = new RegExp(/^([A-Za-z0-9])+=[A-Za-z0-9*]+$/);
        payment.rgx_number = new RegExp(/^\d+$/);
        payment.rgx_cvv = new RegExp(/^\d+|\*+$/);
        payment.rgx_phone = new RegExp(/^[\d-+]+$/);
        payment.rgx_business_number = new RegExp(/^[\d-]{0,9}$/);
        payment.rgx_name = new RegExp(/^([-`'A-Za-zא-ת\s])+$/);
        payment.rgx_remarks = new RegExp(/^[a-zA-Zא-ת|!@#$%^&()-_+=.,';:?>< ]*$/);
        payment.rgx_captcha = new RegExp(/^[0-9]{4}$/);
        payment.rgx_address = new RegExp(/^(?=\s*\S).*$/);
        payment.rgx_city = new RegExp(/^(?=\s*\S).*$/);
        payment.rgx_index = new RegExp('^[0-9]+$');


        //todo init constants
        payment.trueValue = 'true';
        payment.mustValue = 'must';
        payment.optionalValue = 'optional';
        payment.hideValue = 'hide';
        payment.autoeValue = 'auto';
        payment.manualValue = 'manual';

        payment.modifyPayments(true);
        payment.setFocus_IfNeeded();
        payment.checkInputsRealTime();
        payment.setApperance();
        payment.setDashToCreditcard_IfNeeded();
        payment.setBrandLogo();
        payment.handleRequiredFieldsArray();
        payment.showPopUp($('#info'), $('#info_popup'), payment.generalpar.CvvImageUrl || '../Content/Images/CardsCvvHelpS.PNG', '.modal-box-content', $('#closeInfoPopupButton'), message.cs_Cvv_Popup_Alt_Text);
        payment.clearCCnumber($('#credit_card_number_input_clear'), $('#credit_card_number_input'));
        payment.hidePayments_IfNeeded();
        payment.localAgentSubmission = false;
        payment.popUpConfirmed = false;

        $('#submitBtn').click(function () {
            $('#submitBtn').attr("disabled", true);
            payment.submitPaymentForm();
        });

        $('#cancelBtn').click(function () {
            payment.handleCancel();
        });

        if ($('#btnPaypal').length) {
            $('#btnPaypal').click(function () {
                payment.blockSubmitBtn();
                $('#form_pp').submit();
            });
        }

        if ($('#payPalTabBtn').length) {
            $('#payPalTabBtn').click(function () {
                payment.resetAllTabs();
                $(this).addClass('tab-button-selected');
                $("#creditCardRow").hide();
                $("#creditCardExpDateRow").hide();
                $("#NumOfPaymentRow").hide();
                $("#CvvContainer").hide();
                $("#submitBtn").hide();
                $("#btnPaypal").show();
            });
        }

        if ($('#cmdPinpad').length) {
            $('#cmdPinpad').click(function () {
                payment.callPinPad();
            });
        }

        if ($('#btnGamaPayBit').length) {
            $('#btnGamaPayBit').click(function () {
                payment.resetAllTabs();
                $(this).addClass('tab-button-selected');
                payment.callGamaStart('bit');
            });
        }

        if ($('#applePayTabBtn').length) {
            $('#applePayTabBtn').click(function () {
                payment.resetAllTabs();
                $(this).addClass('tab-button-selected');
                $("#creditCardRow").hide();
                $("#creditCardExpDateRow").hide();
                $("#submitBtn").hide();
                $("#CvvContainer").hide();
                $("#applePayButton").show();
                $("#captchaRow").hide();
            });
        }

        if ($('#btnTabCrediCard').length) {
            $('#btnTabCrediCard').click(function () {
                payment.resetAllTabs();
                $(this).addClass('tab-button-selected');
            });
        }

        payment.hideErrorField();

        if (payment.generalpar.PlaceholderCaptions == true) {
            payment.setPlaceholderCaptions();
        }

        else if (payment.generalpar.CaptionExpInput == true) {
            $('select[name=YearsList],select[name=MonthsList1]').each(function (i, elm) {
                elm = $(elm);
                $('<option selected disabled></option>').text(elm.data().placeholder).prependTo(elm);
            });
        }

        if (payment.generalpar.ShowAccessibilityMode == true &&
            payment.generalpar.RemoveAriaHiddenAttribute == true) {
            $('[aria-hidden=true]').removeAttr('aria-hidden');
        }

        payment.initModalLinks();

        var readOnlyFields = generalpar.ReadOnlyFields;

        if (readOnlyFields != null) {
            SetReadOnlyField("card_holder_name_input", readOnlyFields.CardHolderName);
            SetReadOnlyField("id_number_input", readOnlyFields.CustomerIdField);
            SetReadOnlyField("id_customer_address", readOnlyFields.CustomerAddressField);
            SetReadOnlyField("id_customer_city", readOnlyFields.CustomerCityField);
            SetReadOnlyField("id_customer_index", readOnlyFields.CustomerIndexField);
            SetReadOnlyField("id_customer_country", readOnlyFields.CustomerCountryField);
            SetReadOnlyField("email_input", readOnlyFields.EmailField);
            SetReadOnlyField("phone_input", readOnlyFields.TelField);
        }

        if (generalpar.FirstPaymentLock) {
            SetReadOnlyField("first_payment_input", generalpar.FirstPaymentLock);
        }

        //applePay
        if (payment.generalpar.ApplePay.enabled && payment.generalpar.ApplePay.label.length > 0) {
            if (isIframe()) {
                AddIframeEventListener();
                document.body.onload = function () {
                    parent.postMessage({ type: 'applepay', method: 'canMakePayments' }, getParentUrl());
                }
            } else {
                applePayLogic();
            }
        }

        $('#closeConfirmationPopupButton_gama').bind('click', function (e) {
            $('#info_popup_confirmation_gama').bPopup().close();
        });

        $('#btnPopUpConfirmation_gama').bind('click', function (e) {
            payment.confirmationPopUpGamaSubmit();
        });
    },
    fillSubmitModel: function () {
        payment.submitModel.TransactionId = payment.generalpar['TransactionId'];

        if ($('#credit_card_number_input').length)
            payment.submitModel.CreditCardNumber = $('#credit_card_number_input').val().trim();

        if ($('#token_input').length)
            payment.submitModel.Token = $('#token_input').val().trim();

        if ($('#card_holder_name_input').length)
            payment.submitModel.CreditCardHolder = $('#card_holder_name_input').val().trim();

        if ($('#id_number_input').length)
            payment.submitModel.IdNumber = $('#id_number_input').val().trim();

        if ($('#credit_card_number_input').length)
            payment.submitModel.CreditCardDate = $('#date_month_input').find(":selected").text() + $('#date_year_input').find(":selected").text().substring(2, 4);

        if ($('#cvv_input').length)
            payment.submitModel.CvvNumber = $('#cvv_input').val().trim();

        if ($('#free_total_input').length)
            payment.submitModel.FreeTotal = $('#free_total_input').val();

        if ($('#num_of_payments').length)
            payment.submitModel.NumOfPayments = $('#num_of_payments').val();
        else
            payment.submitModel.NumOfPayments = '1';

        if ($('#first_payment_input').length)
            payment.submitModel.FirstPayment = $('#first_payment_input').val();

        if ($('#each_payment_input').length)
            payment.submitModel.EachPayment = $('#each_payment_input').val();

        if ($('#email_input').length)
            payment.submitModel.Email = $('#email_input').val();

        if ($('#phone_input').length)
            payment.submitModel.Phone = $('#phone_input').val();

        if ($('input[name=BusinessNumber]').length)
            payment.submitModel.BusinessNumber = $('input[name=BusinessNumber]').val();

        if ($('#remarks_input').length)
            payment.submitModel.Remarks = $('#remarks_input').val();

        if ($('#id_customer_address').val()) {
            payment.submitModel.Address = $('#id_customer_address').val();
        }

        if ($('#id_customer_city').val()) {
            payment.submitModel.City = $('#id_customer_city').val();
        }

        if ($('#id_customer_index').val()) {
            payment.submitModel.AddressIndex = $('#id_customer_index').val();
        }

        if ($('#id_customer_country').val()) {
            payment.submitModel.Country = $('#id_customer_country').val();
        }

        if ($('#id_captcha_code').length) {
            payment.submitModel.Captcha = $('#id_captcha_code').val();
        }
    },
    initModalLinks: function () {
        var iframeElement = $('#linksIframe');
        var lightBox = iframeElement.closest('.light-box');

        lightBox.find('[data-toggle=modal]').click(function () { lightBox.fadeOut(); });

        $('a[data-open-in-modal=True][href]').click(function (event) {
            event.preventDefault();

            iframeElement.attr('src', event.target.href);
            lightBox.fadeIn();
        });
    },
    setPlaceholderCaptions: function () {
        $('label[for]').each(function (i, label) {
            var element = $('#' + $(label).attr('for'));
            element.attr('placeholder', $(label).text().trim());
            $(label).remove();
        });

        $('select[data-placeholder]').each(function (i, elm) {
            elm = $(elm);
            $('<option selected disabled></option>').text(elm.data().placeholder).prependTo(elm);
        });
    },
    submitPaymentForm: function () {

        // run PP routine if CC is missing
        if ($('#cmdPinpad').length && $('#credit_card_number_input').length) {
            if ($('#credit_card_number_input').val().trim() == '') {
                payment.callPinPad();
                return;
            }
        }

        payment.hideErrorField();

        var result = payment.checkInputsAfterSubmit();
        var success = result[0];
        var errMsg = result[1];

        if (success) {
            if (payment.checkAllowedBlockedBINS()) {

                //payment.hideErrorField();

                payment.submitModel.TransactionId = payment.generalpar['TransactionId'];

                if ($('#credit_card_number_input').length)
                    payment.submitModel.CreditCardNumber = $('#credit_card_number_input').val().trim();

                if ($('#token_input').length)
                    payment.submitModel.Token = $('#token_input').val().trim();

                if ($('#card_holder_name_input').length)
                    payment.submitModel.CreditCardHolder = $('#card_holder_name_input').val().trim();

                if ($('#id_number_input').length)
                    payment.submitModel.IdNumber = $('#id_number_input').val().trim();

                if ($('#credit_card_number_input').length)
                    payment.submitModel.CreditCardDate = $('#date_month_input').find(":selected").text() + $('#date_year_input').find(":selected").text().substring(2, 4);

                if ($('#cvv_input').length)
                    payment.submitModel.CvvNumber = $('#cvv_input').val().trim();

                if ($('#free_total_input').length)
                    payment.submitModel.FreeTotal = $('#free_total_input').val();

                if ($('#num_of_payments').length)
                    payment.submitModel.NumOfPayments = $('#num_of_payments').find(":selected").text();
                else
                    payment.submitModel.NumOfPayments = '1';

                if ($('#first_payment_input').length)
                    payment.submitModel.FirstPayment = $('#first_payment_input').val();

                if ($('#each_payment_input').length)
                    payment.submitModel.EachPayment = $('#each_payment_input').val();

                if ($('#email_input').length)
                    payment.submitModel.Email = $('#email_input').val();

                if ($('#phone_input').length)
                    payment.submitModel.Phone = $('#phone_input').val();

                if ($('input[name=BusinessNumber]').length)
                    payment.submitModel.BusinessNumber = $('input[name=BusinessNumber]').val();

                if ($('#remarks_input').length)
                    payment.submitModel.Remarks = $('#remarks_input').val();

                if ($('#id_customer_address').val()) {
                    payment.submitModel.Address = $('#id_customer_address').val();
                }

                if ($('#id_customer_city').val()) {
                    payment.submitModel.City = $('#id_customer_city').val();
                }

                if ($('#id_customer_index').val()) {
                    payment.submitModel.AddressIndex = $('#id_customer_index').val();
                }

                if ($('#id_customer_country').val()) {
                    payment.submitModel.Country = $('#id_customer_country').val();
                }

                if ($('#id_captcha_code').length) {
                    payment.submitModel.Captcha = $('#id_captcha_code').val();
                }

                payment.blockSubmitBtn();

                payment.sendAjax(payment.generalpar['urlTransaction'], payment.submitModel);

            }
            else {
                $('#submitBtn').removeAttr("disabled");
                payment.showError(message.CreditCardNotAccepted, false);
            }
        }
        else {
            $('#submitBtn').removeAttr("disabled");
            payment.showError(errMsg, false);
        }

    },
    redirectPaymentFormOnTimeOut: function () {

        payment.hideErrorField();

        payment.submitModel.TransactionId = payment.generalpar['TransactionId'];
        payment.submitModel.CreditCardNumber = $('#credit_card_number_input').val().trim();

        if ($('#card_holder_name_input').length)
            payment.submitModel.CreditCardHolder = $('#card_holder_name_input').val().trim();

        if ($('#id_number_input').length)
            payment.submitModel.IdNumber = $('#id_number_input').val().trim();

        payment.submitModel.CreditCardDate = $('#date_month_input').find(":selected").text() + $('#date_year_input').find(":selected").text().substring(2, 4);

        if ($('#cvv_input').length)
            payment.submitModel.CvvNumber = $('#cvv_input').val().trim();

        if ($('#free_total_input').length)
            payment.submitModel.FreeTotal = $('#free_total_input').val();

        if ($('#num_of_payments').length)
            payment.submitModel.NumOfPayments = $('#num_of_payments').find(":selected").text();
        else
            payment.submitModel.NumOfPayments = '1';

        if ($('#first_payment_input').length)
            payment.submitModel.FirstPayment = $('#first_payment_input').val();

        if ($('#each_payment_input').length)
            payment.submitModel.EachPayment = $('#each_payment_input').val();

        if ($('#email_input').length)
            payment.submitModel.Email = $('#email_input').val();

        if ($('#phone_input').length)
            payment.submitModel.Phone = $('#phone_input').val();

        if ($('#remarks_input').length)
            payment.submitModel.Remarks = $('#remarks_input').val();

        if ($('#id_captcha_code').length) {
            payment.submitModel.Captcha = $('#id_captcha_code').val();
        }

        payment.blockSubmitBtn();

        var errorUrl = $('#TimeoutRedirect').val();
        payment.sendAjax(errorUrl, payment.submitModel);

    },
    callPinPad: function () {

        payment.hideErrorField();

        var result = payment.checkPinPadInputsAfterSubmit();
        var success = result[0];
        var errMsg = result[1];

        if (success) {
            payment.submitModel.TransactionId = payment.generalpar['TransactionId'];

            payment.submitModel.AgentCallTrxId = "PP";

            $('#credit_card_number_input').val('');
            $('#token_input').val('');
            $('#cvv_input').val('');

            if ($('#card_holder_name_input').length)
                payment.submitModel.CreditCardHolder = $('#card_holder_name_input').val().trim();

            if ($('#id_number_input').length)
                payment.submitModel.IdNumber = $('#id_number_input').val().trim();

            if ($('#credit_card_number_input').length)
                payment.submitModel.CreditCardDate = $('#date_month_input').find(":selected").text() + $('#date_year_input').find(":selected").text().substring(2, 4);

            if ($('#free_total_input').length)
                payment.submitModel.FreeTotal = $('#free_total_input').val();

            if ($('#num_of_payments').length)
                payment.submitModel.NumOfPayments = $('#num_of_payments').find(":selected").text();
            else
                payment.submitModel.NumOfPayments = '1';

            if ($('#first_payment_input').length)
                payment.submitModel.FirstPayment = $('#first_payment_input').val();

            if ($('#each_payment_input').length)
                payment.submitModel.EachPayment = $('#each_payment_input').val();

            if ($('#email_input').length)
                payment.submitModel.Email = $('#email_input').val();

            if ($('#phone_input').length)
                payment.submitModel.Phone = $('#phone_input').val();

            if ($('#remarks_input').length)
                payment.submitModel.Remarks = $('#remarks_input').val();

            if (payment.generalpar['ParamX'].length)
                pp_paramX = payment.generalpar['ParamX'];

            if ($('#id_customer_address').val()) {
                payment.submitModel.Address = $('#id_customer_address').val();
            }

            if ($('#id_customer_city').val()) {
                payment.submitModel.City = $('#id_customer_city').val();
            }

            if ($('#id_customer_index').val()) {
                payment.submitModel.AddressIndex = $('#id_customer_index').val();
            }

            payment.blockSubmitBtnForPinPad();
            payment.sendAjax(payment.generalpar['urlTransaction'], payment.submitModel);

        }
        else {
            $('#submitBtn').removeAttr("disabled");
            payment.showError(errMsg, false);
        }
        // TODO wait and call afterSubmit()
    },

    resetAllTabs: function () {
        $('.tab-button-selected').removeClass('tab-button-selected');
        payment.hideErrorField();
        $("#creditCardRow").show();
        $("#creditCardExpDateRow").show();
        $("#captchaRow").show();
        $("#applePayButton").hide();
        $("#btnPaypal").hide();
        $("#submitBtn").show();
    },

    callGamaStart: function (walletType) {

        payment.popUpConfirmed = false;

        $('#confirmationModalGamaContent').children(0).attr('alt', message.alt_Confirmation_box);

        // copy
        if ($('#card_holder_name_input').length)
            $('#card_holder_name_gama_input').val($('#card_holder_name_input').val());

        if ($('#phone_input').length)
            $('#phone_input_gama').val($('#phone_input').val().replace('-', ''));


        $('#confirmationModalGamaText').html($('#confirmationModalGamaText_' + walletType).val());
        $('#btnPopUpConfirmation_gama').html($('#btnPopUpConfirmationText_' + walletType).val());

        $('#info_popup_confirmation_gama').bPopup({
            onClose: function () {
                if (payment.popUpConfirmed == true) {
                    payment.callGama(walletType);
                }
            }// ,  autoClose: 20 * 1000
        });

        $('#closeInfoPopupButton').focus();

    },
    confirmationPopUpGamaSubmit: function () {
        // --- validations for phone number input ---

        $('#errorRowGama').html('');
        $('#errorRowGama').hide();

        var validationGamaErrorMsg = '';

        payment.changeBorderColorPositive($('#phone_input_gama'), true);
        payment.changeBorderColorPositive($('#card_holder_name_gama_input'), true);
        // '0,OK'
        var resultPhone = payment.checkInputIsOk('phone_input_gama', payment.generalpar['CaptionSet']['cs_phone'], payment.rgx_cardnumber, true, false);
        if (resultPhone[0] != 0) {
            payment.changeBorderColorByStatus($('#phone_input_gama'), resultPhone[0], true);
            validationGamaErrorMsg = resultPhone[1];
        }

        var resultHoldername = payment.checkInputIsOk('card_holder_name_gama_input', payment.generalpar['CaptionSet']['cs_holdername'], payment.rgx_name, true, true);
        if (resultHoldername[0] != 0) {
            payment.changeBorderColorByStatus($('#card_holder_name_gama_input'), resultHoldername[0], true);
            if (validationGamaErrorMsg != '')
                validationGamaErrorMsg = validationGamaErrorMsg + ' | ';
            validationGamaErrorMsg = validationGamaErrorMsg + resultHoldername[1];
        }

        // ------------------------------------

        if (validationGamaErrorMsg == "") {
            payment.popUpConfirmed = true;
            $('#info_popup_confirmation_gama').bPopup().close();

        }
        else {
            $('#errorRowGama').html('<div class="container"><div id="error" class="error" tabindex="0">' + validationGamaErrorMsg + '</div></div>')
            $('#errorRowGama').show();
        }
    },
    callGama: function (walletType) {

        $('#credit_card_number_input').val('');
        $('#token_input').val('');
        $('#cvv_input').val('');

        payment.submitModel.TransactionId = payment.generalpar['TransactionId'];

        payment.submitModel.AgentCallTrxId = "GM_" + walletType;

        if ($('#card_holder_name_gama_input').length)
            payment.submitModel.CreditCardHolder = $('#card_holder_name_gama_input').val().trim();

        if ($('#id_number_input').length)
            payment.submitModel.IdNumber = $('#id_number_input').val().trim();

        if ($('#credit_card_number_input').length)
            payment.submitModel.CreditCardDate = $('#date_month_input').find(":selected").text() + $('#date_year_input').find(":selected").text().substring(2, 4);

        if ($('#free_total_input').length)
            payment.submitModel.FreeTotal = $('#free_total_input').val();

        if ($('#num_of_payments').length)
            payment.submitModel.NumOfPayments = $('#num_of_payments').find(":selected").text();
        else
            payment.submitModel.NumOfPayments = '1';

        if ($('#first_payment_input').length)
            payment.submitModel.FirstPayment = $('#first_payment_input').val();

        if ($('#each_payment_input').length)
            payment.submitModel.EachPayment = $('#each_payment_input').val();

        if ($('#email_input').length)
            payment.submitModel.Email = $('#email_input').val();

        if ($('#phone_input_gama').length)
            payment.submitModel.Phone = $('#phone_input_gama').val();

        if ($('#remarks_input').length)
            payment.submitModel.Remarks = $('#remarks_input').val();

        if (payment.generalpar['ParamX'].length)
            pp_paramX = payment.generalpar['ParamX'];

        if ($('#id_customer_address').val()) {
            payment.submitModel.Address = $('#id_customer_address').val();
        }

        if ($('#id_customer_city').val()) {
            payment.submitModel.City = $('#id_customer_city').val();
        }

        if ($('#id_customer_index').val()) {
            payment.submitModel.AddressIndex = $('#id_customer_index').val();
        }

        var isSms = true;
        // -- platform --
        if (payment.isAndroid()) {
            payment.submitModel.Platform = "Android";
            isSms = false;
        }

        if (payment.isiPhone()) {
            payment.submitModel.Platform = "iPhone";
            isSms = false;
        }

        console.log('Platform detected:' + payment.submitModel.Platform);
        // --------------
        // DEBUG!!!
        // payment.submitModel.Platform = "Android";



        payment.submitModel.WalletType = walletType;

        payment.blockSubmitBtnForGama(walletType, isSms);

        payment.sendAjax(payment.generalpar['urlTransaction'], payment.submitModel);


    },
    sendAjax: function (url, dataObj) {

        var submitData = dataObj;
        payment.localAgentSubmission = false;

        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(dataObj),
            contentType: "application/json; charset=utf-8",
            // timeout: 120000,
            timeout: 600000,
            success: function (result) {
                payment.afterSubmit(result, submitData);
            },
            error: function (request, status, err) {
                payment.showError(status, false);
                payment.unblockUI($('#content_container'));
            }
        });
    },
    sendAjaxToAgent: function () {

        payment.localAgentSubmission = true;
        pp_prevResult = '';
        pp_prevTrxId = '';
        pp_currentTotal = payment.getCurrentTotal();
        pp_sugAshrai = payment.checkSugAshrai();
        pp_paramX = '';
        pp_approveNumber = '';
        pp_reserved1 = '';
        pp_reserved2 = '';

        if (payment.submitModel.AuthorizationNumber != null)
            pp_approveNumber = payment.submitModel.AuthorizationNumber

        if (payment.AjaxResultObj != null) {
            pp_prevTrxId = payment.AjaxResultObj['Debit_trx_id'];
            pp_prevResult = payment.AjaxResultObj['StatusCode'];
        }

        if (payment.generalpar['ParamX'].length)
            pp_paramX = payment.generalpar['ParamX'];

        dataToPost = new Object({
            total: pp_currentTotal,
            sugash: pp_sugAshrai,
            paramX: pp_paramX,
            prevResult: pp_prevResult,
            prevTrxId: pp_prevTrxId,
            approveNumber: pp_approveNumber,
            reserved1: pp_reserved1,
            reserved2: pp_reserved2,
            formData: payment.submitModel
        });

        $.ajax({
            url: "https://agent.pelecard.biz:8017/peleclient/InitPinpad",
            type: "POST",
            data: JSON.stringify(dataToPost),
            dataType: 'json',
            cache: false,
            contentType: "application/json; charset=utf-8",
            timeout: 600000, // 10min
            success: function (result) {
                if (result != null && result['LandingURL'] != null)
                    payment.afterSubmit(result);
                else if (result != null && result['StatusCode'] != null)
                    payment.showError(result['StatusCode'] + ' ' + result['StatusDescription'], false);
                else
                    payment.showError('שגיאה בפינפאד', false);
            },
            error: function (request, status, err) {
                payment.showError(status, false);
                payment.unblockUI($('#content_container'));
            }
        });
    },
    afterSubmit: function (result) {

        if (typeof result == 'object')
            payment.AjaxResultObj = result;
        else
            payment.AjaxResultObj = JSON.parse(result);

        payment.generalpar['TransactionId'];

        if (payment.AjaxResultObj['LandingURL'].trim().length == 0) {

            if (payment.AjaxResultObj["StatusDescription"] == "Gama Completion Required") {
                // gama step 2

                console.log("gama step 2");

                payment.showError(payment.AjaxResultObj["StatusDescription"]);
                var isSmsLink = true;
                if (payment.isiPhone() && payment.AjaxResultObj["WalletProviderApplicationSchemeAndroid"].trim().length) {
                    isSmsLink = false;
                    window.open(payment.AjaxResultObj["WalletProviderApplicationSchemeAndroid"], "_blank");
                }

                if (payment.isAndroid() && payment.AjaxResultObj["WalletProviderApplicationSchemeIos"].trim().length) {
                    isSmsLink = false;
                    window.open(payment.AjaxResultObj["WalletProviderApplicationSchemeIos"], "_blank");
                }

                $("#bitDeepLinkTextTest").val(payment.AjaxResultObj["WalletProviderApplicationSchemeAndroid"]);

                payment.submitModel.AgentCallTrxId = "GMST2_" + payment.submitModel.WalletType;

                payment.blockSubmitBtnForGama(payment.submitModel.WalletType, isSmsLink);

                payment.sendAjax(payment.generalpar['urlTransaction'], payment.submitModel);

                return;
            }
            payment.showError(payment.AjaxResultObj["StatusDescription"] + " " + payment.AjaxResultObj['StatusCode'] + "", false);
            payment.unblockUI($('#content_container'));

            // 003 means that user must call the credit company for authorization number.
            // displaying a dialog for that number.
            if (payment.AjaxResultObj['DisplayIshurPopUp'] == true) {
                $("#authNumFromCreditCompany").dialog({
                    autoShow: false,
                    modal: true,
                    draggable: false,
                    resizable: false,
                    position: ['center', 'center'],
                    show: 'blind',
                    hide: 'blind',
                    width: 300,
                    height: 250,
                    dialogClass: 'ui-dialog-osx',
                });
            }

            if (payment.error_codes_inputs[payment.AjaxResultObj['StatusCode']]) {
                payment.error_codes_inputs[payment.AjaxResultObj['StatusCode']].addClass('error');
            }

            return;
        }



        var pageRedirector = new redirector(payment.AjaxResultObj['LandingURL'],
            payment.AjaxResultObj['Target'],
            payment.generalpar['TransactionId'],
            payment.AjaxResultObj['StatusCode'],
            payment.AjaxResultObj['StatusDescription'],
            payment.AjaxResultObj['ApprovalNo'],
            payment.AjaxResultObj['Token'],
            payment.AjaxResultObj['ConfirmationKey'],
            payment.AjaxResultObj['ParamX'],
            payment.AjaxResultObj['UserKey'],
            payment.AjaxResultObj['UseEndOfProcess'],
            payment.AjaxResultObj['FeedbackDataTransferMethod']
        );



        logMessage(payment.AjaxResultObj['UseEndOfProcess']);

        if (payment.AjaxResultObj['UseEndOfProcess'] == "true")
            pageRedirector.redirectByEOP();   // EOP
        else if (payment.AjaxResultObj['FeedbackDataTransferMethod'] == "post")
            pageRedirector.redirectByPost();  // POST
        else
            pageRedirector.redirectByGet();    // GET
    },
    setApperance: function () {
        var hidableFields = { 'first_payment': true, 'each_payment': true };

        if (payment.generalpar.HideFields) {
            var hideFields = payment.generalpar.HideFields.split(',');

            for (var i in hideFields) {
                if (hidableFields[hideFields[i]]) {
                    $('#' + hideFields[i]).addClass('hidden-field').hide();
                }
            }
        }
        // TODO: Tedect if this is IFRAME and set orderDetailsLabel mode

        //if (payment.generalpar['Appearance'] == 'iframe') {
        //    $('#orderDetailsLabel').addClass("lnk-toggle");
        //    $('#order_details').toggle();
        //    $('#orderDetailsLabel').click(function () {
        //        $('#order_details').toggle();
        //    });
        //}
        //else {
        //    $('#orderDetailsLabel').addClass("active");

        //}

        $('#orderDetailsLabel').addClass("active");
    },
    handleRequiredFieldsArray: function () {

        requiredFieldsObjects = $('.required').toArray();

        for (var prop in requiredFieldsObjects) {
            requiredFields.push(requiredFieldsObjects[prop].id);
        }

    },
    handleCancel: function () {
        if ($('#cancelBtn').length) {
            var target = payment.generalpar['FeedbackOnTop'].toLowerCase() == "true" ? "_top" : "_self";

            var pageRedirector = new redirector(payment.generalpar['urlCancel'].trim(),
                target,
                payment.generalpar['TransactionId'],
                "555",
                "Transaction cancel",
                "",
                "",
                "",
                payment.generalpar['ParamX'],
                payment.generalpar['UserKey'],
                "",
                payment.generalpar['FeedbackDataTransferMethod']);

            if (payment.generalpar['FeedbackDataTransferMethod'].toLowerCase() == "post")
                pageRedirector.redirectByPost();  // POST
            else
                pageRedirector.redirectByGet();    // GET
        }
    },
    setFocus_IfNeeded: function () {
        switch (payment.generalpar['SetFocus']) {
            case 'cc':
                if ($('#credit_card_number_input').is(":visible"))
                    $('#credit_card_number_input').focus();
                break;
            case 'cch':
                if ($('#card_holder_name_input').is(":visible"))
                    $('#card_holder_name_input').focus();
                break;
            default:
                break;
        }
    },
    hidePayments_IfNeeded: function () {

        if (
            payment.checkSugAshrai() == 'IntrestPayments') {

            $('#lbl_intrest_payments').show();
            $('#first_payment').hide();
            $('#first_payment_input').val('');
            $('#each_payment').hide();
            $('#each_payment_input').val('');
        }
        else if ($('#num_of_payments').find(":selected").text() == 1) {
            $('#lbl_intrest_payments').hide();
            $('#first_payment').hide();
            $('#first_payment_input').val('');
            $('#each_payment').hide();
            $('#each_payment_input').val('');
        } else {
            $('#lbl_intrest_payments').hide();
            $('#first_payment:not(.hidden-field)').show();
            $('#each_payment:not(.hidden-field)').show();
        }
    },
    showPopUp: function (element, elementToPop, imageUrl, container, closeButton, popupAltText) {
        element.bind('click', function (e) {
            e.preventDefault();
            elementToPop.bPopup({
                content: 'image', //'ajax', 'iframe' or 'image'
                contentContainer: container,
                loadUrl: imageUrl,
                onClose: function () {
                    $('#info').focus();
                }
            });

            $('#modalBoxContentPelecardId').children(0).attr('alt', popupAltText);

            $('#closeInfoPopupButton').focus();
        });

        closeButton.bind('click', function (e) {
            $('#info').focus();
            elementToPop.bPopup().close();
        });
    },
    clearCCnumber: function (element, ccElement) {
        element.bind('click', function (e) {
            ccElement.val('');
            element.hide();
            ccElement.focus();
            payment.submitModel.Track2 = '';
        });
    },
    blockSubmitBtn: function () {
        $('#content_container').block({
            message:
                '<div class="block_ui_container">' +
                '<img src="../Content/Images/alazman-wait.png" class="block_ui_background" />' +
                '<p class="block_ui_text">' + message.BlockUiWait + '</p>' +
                '<img src="../Content/Images/alazman-loader.gif" class="block_ui_loader" />' +
                '</div>',
            fadeIn: 250,
            css: {
                backgroundColor: 'transparent',
                border: 'none',
                width: '200px'
            }
        });
    },
    blockSubmitBtnForPinPad: function () {
        $('#content_container').block({
            message:
                '<div class="block_ui_container">' +
                '<img src="../Content/Images/alazman-wait.png" class="block_ui_background" />' +
                '<p class="block_ui_text_pp">' + message.BlockUiWaitPinPad + '</p>' +
                '<img src="../Content/Images/alazman-loader.gif" class="block_ui_loader" />' +
                '</div>',
            fadeIn: 250,
            css: {
                backgroundColor: 'transparent',
                border: 'none',
                width: '200px'
            }
        });
    },
    blockSubmitBtnForGama: function (walletType, isSMSLink) {

        var msgGamaWaitText = '';
        if (isSMSLink)
            msgGamaWaitText = message.BlockUiWaitWalletSms.replace('XXX', walletType);
        else
            msgGamaWaitText = message.BlockUiWaitWallet.replace('XXX', walletType);

        $('#content_container').block({
            message:
                '<div class="block_ui_container">' +
                '<img src="../Content/Images/alazman-wait.png" class="block_ui_background_heigth1" />' +
                '<p class="block_ui_text_gama">' + msgGamaWaitText + '</p>' +
                '<img src="../Content/Images/alazman-loader.gif" class="block_ui_loader" />' +
                '</div>',
            fadeIn: 250,
            css: {
                backgroundColor: 'transparent',
                border: 'none',
                width: '200px'
            }
        });
    },
    blockUI: function (element, message) {
        element.block({
            message:
                message,
            fadeIn: 250,
            css: {
                backgroundColor: 'transparent',
                border: 'none',
                width: '200px'
            }


        });
    },
    unblockUI: function (element) {
        $('#submitBtn').removeAttr("disabled");
        element.unblock();
    },
    checkSugAshrai: function () {
        var numOfPayment = parseInt($('#num_of_payments').find(":selected").text());

        var minPaymentForCredit = payment.generalpar['MinPaymentsForCredit'];

        if (numOfPayment == 1)
            return 'OnePayment';
        else if (numOfPayment < minPaymentForCredit || minPaymentForCredit == 0)
            return 'MultipePayments';
        else
            return 'IntrestPayments';
    },

    //// InputChecks

    checkAllowedBlockedBINS: function () {

        if (!$('#credit_card_number_input').length)
            return true;

        var allowedBINs = (payment.generalpar['AllowedBINs'] == null) ? '' : payment.generalpar['AllowedBINs'].split(",");
        var blockedBINs = (payment.generalpar['BlockedBINs'] == null) ? '' : payment.generalpar['BlockedBINs'].split(",");

        //window.console.log('checkAllowedBlockedBINS function: allowedBINs=' + allowedBINs + ' blockedBINs=' + blockedBINs);

        var creditNum = $('#credit_card_number_input').val().trim().replace(/\-/g, '').replace(/\s/g, '');

        if (creditNum != '') {

            // if (allowedBINs != '' && $.inArray(creditNum.substring(0, 6), allowedBINs) == -1)
            //     return false;

            //if ($.inArray(creditNum.substring(0, 6), blockedBINs) > -1)
            //    return false;


            if (allowedBINs != '') {
                var arrayLength = allowedBINs.length;
                var matchAlloedBIN = false;
                for (var i = 0; i < arrayLength; i++) {
                    matchAlloedBIN = payment.compareBins(allowedBINs[i].trim(), creditNum.substring(0, allowedBINs[i].trim().length));
                    if (matchAlloedBIN)
                        return true;
                }
                return false;
            }

            if (blockedBINs != '') {
                var arrayLength = blockedBINs.length;
                var matchBlockedBIN = false;
                for (var i = 0; i < arrayLength; i++) {
                    matchBlockedBIN = payment.compareBins(blockedBINs[i].trim(), creditNum.substring(0, blockedBINs[i].trim().length));
                    if (matchBlockedBIN)
                        return false;
                }
            }

            return true;

        }

        return true;
    },
    compareBins: function (binPattern, cardPrefix) {
        var match = false;
        for (var i = 0; i < binPattern.length; i++) {
            if (binPattern[i] == '?')
                match = true;
            else
                match = cardPrefix[i] == binPattern[i];

            if (!match)
                return false;
        }
        return match;
    },
    validateExpirationDates: function (ErrorMsg) {

        var today = new Date(); var currentMonth = (today.getMonth() + 1).toString(); var currentYear = today.getFullYear().toString();

        var result = payment.checkDateTimeHelper(currentYear, currentMonth, $('#date_year_input').find(":selected").text(), $('#date_month_input').find(":selected").text());
        var required = true; //payment.isInArray(elementId, requiredFields);

        if (result == 'OK') {
            payment.changeBorderColorPositive($('#date_month_input'), required);
            payment.changeBorderColorPositive($('#date_year_input'), required);
            payment.hideErrorField();
        }
        else {
            ErrorMsg = (ErrorMsg == '') ? result : ErrorMsg;
            payment.changeBorderColorByStatus($('#date_month_input'), 1, required);
            payment.changeBorderColorByStatus($('#date_year_input'), 1, required);
        }
        logMessage(ErrorMsg);
        return ErrorMsg;
    },
    checkInputsAfterSubmit: function () {

        var firstErrorMsg = '';

        var inputsToCheck = [];

        if ($('#credit_card_number_input').length)
            inputsToCheck.push(new elementObj('credit_card_number_input', payment.generalpar['CaptionSet']['cs_cardnumber'], payment.rgx_cardnumber)); // 'Credit Card Number'

        if ($('#token_input').length)
            inputsToCheck.push(new elementObj('token_input', payment.generalpar['CaptionSet']['cs_token'], payment.rgx_cardnumber)); //'Token '

        if ($('#card_holder_name_input').length)
            inputsToCheck.push(new elementObj('card_holder_name_input', payment.generalpar['CaptionSet']['cs_holdername'], payment.rgx_name)); //'holder name'

        if ($('#id_number_input').length)
            if ((payment.generalpar['Track2Swipe'].toLowerCase() != 'true') || (payment.generalpar['Track2Swipe'].toLowerCase() == 'true' && payment.submitModel.Track2 == ""))
                inputsToCheck.push(new elementObj('id_number_input', payment.generalpar['CaptionSet']['cs_id'], payment.rgx_number)); //'id number'

        if ($('#cvv_input').length)
            if ((payment.generalpar['Track2Swipe'].toLowerCase() != 'true') || (payment.generalpar['Track2Swipe'].toLowerCase() == 'true' && payment.submitModel.Track2 == ""))
                inputsToCheck.push(new elementObj('cvv_input', payment.generalpar['CaptionSet']['cs_cvv'], payment.rgx_cvv)); //'CVV Number'

        if ($('#free_total_input').length)
            inputsToCheck.push(new elementObj('free_total_input', payment.generalpar['CaptionSet']['cs_free_total'], payment.rgx_total)); //'Extra Credits'

        if ($('#email_input').length)
            inputsToCheck.push(new elementObj('email_input', payment.generalpar['CaptionSet']['cs_email'], payment.rgx_mail));    //'Email Number'

        if ($('#phone_input').length)
            inputsToCheck.push(new elementObj('phone_input', payment.generalpar['CaptionSet']['cs_phone'], payment.rgx_cardnumber)); //'Phone Number'

        if ($('#remarks_input').length)
            inputsToCheck.push(new elementObj('remarks_input', payment.generalpar['CaptionSet']['cs_remarks'], payment.rgx_remarks)); //'remarks'

        if ($('#business_number_input').length)
            inputsToCheck.push(new elementObj('business_number_input', payment.generalpar['CaptionSet']['cs_business_number'], payment.rgx_business_number));

        if ($('#first_payment_input').length)
            inputsToCheck.push(new elementObj('first_payment_input', payment.generalpar['CaptionSet']['cs_first_payment'], payment.rgx_total)); //'First Payment'

        if ($('#id_customer_address').length) {
            inputsToCheck.push(new elementObj('id_customer_address', payment.generalpar['CaptionSet']['cs_customer_address'], payment.rgx_address)); //'Customer Address
        }

        if ($('#id_customer_city').length && $('#id_customer_city').hasClass("required")) {
            inputsToCheck.push(new elementObj('id_customer_city', payment.generalpar['CaptionSet']['cs_customer_city'], payment.rgx_city)); //'Customer City
        }
        if ($('#id_customer_index').length) {
            //rgx_index
            var elem = new elementObj('id_customer_index', payment.generalpar['CaptionSet']['cs_customer_index'], payment.rgx_cardnumber);
            inputsToCheck.push(elem); //'Customer Index
        }
        if ($('#id_customer_country').length && $('#id_customer_country').hasClass("required")) {
            inputsToCheck.push(new elementObj('id_customer_country', payment.generalpar['CaptionSet']['cs_customer_country'], payment.rgx_city)); //'Customer Country
        }

        if ($('#id_captcha_code').length && $('#id_captcha_code').hasClass("required")) {
            inputsToCheck.push(new elementObj('id_captcha_code', payment.generalpar['CaptionSet']['cs_captcha'], payment.rgx_captcha)); //captcha
        }

        $.each(inputsToCheck, function (index, value) {

            var elementName = value.name;
            var elementId = value.id;
            var regex = value.regex;
            var required = payment.isInArray(elementId, requiredFields);

            //window.console.log('elementName:' + elementName + ', elementId:' + elementId + ', required:' + required + ',regex ' + value.regex)

            if (elementId == 'first_payment_input' && $("#num_of_payments").val() == 1)
                return;

            var result = payment.checkInputIsOk(elementId, elementName, regex, required, false);

            //window.console.log('checkInputIsOk: Id=' + elementId + ' required=' + required + ' result=' + result);

            var statusCode = result[0];
            var errMsg = result[1];

            //window.console.log('statusCode:' + statusCode)
            //window.console.log('errMsg:' + errMsg)
            //window.console.log('statusCode:' + statusCode + ', elementId:' + elementId)

            if (statusCode == 0) {
                payment.changeBorderColorPositive($('#' + elementId + ''), required); //changeBorderColor($('#' + elementId + ''), 'green');
            }
            else {
                firstErrorMsg = (firstErrorMsg == '') ? errMsg : firstErrorMsg;
                payment.changeBorderColorByStatus($('#' + elementId + ''), statusCode, required);
            }

        });

        if ($('#credit_card_number_input').length)
            firstErrorMsg = payment.validateExpirationDates(firstErrorMsg);


        if ($('#free_total_input').length) {
            if ($('#totalAll').val() == undefined && ($.trim($('#free_total_input').val()) == '' || $('#free_total_input').val() <= 0)) {
                firstErrorMsg = (firstErrorMsg == '') ? payment.generalpar['CaptionSet']['cs_free_total'] + " " + message.PositiveErr : firstErrorMsg
            }
        }


        if ($("#agree").length) {
            if ($('#agree').prop('checked')) {
                payment.paintCheckBoxGreen($('#agree'))
            }
            else {
                payment.paintCheckBoxRed($('#agree'))
                firstErrorMsg = (firstErrorMsg == '') ? message.AcceptTerms : firstErrorMsg;
            }
        }

        if (firstErrorMsg == '')
            return [true, firstErrorMsg]
        else
            return [false, firstErrorMsg]
    },
    checkPinPadInputsAfterSubmit: function () {

        var firstErrorMsg = '';

        if ($('#free_total_input').length) {
            if ($('#totalAll').val() == undefined && ($.trim($('#free_total_input').val()) == '' || $('#free_total_input').val() <= 0)) {
                firstErrorMsg = (firstErrorMsg == '') ? payment.generalpar['CaptionSet']['cs_free_total'] + " " + message.PositiveErr : firstErrorMsg
            }
        }

        if (firstErrorMsg == '')
            return [true, firstErrorMsg]
        else
            return [false, firstErrorMsg]
    },
    checkInputsRealTime: function () { //todo check if hidden(to check if falls in older Browsers)

        var clearIfBadFormated = true;

        if ($('#cvv_input').length) {
            $('#cvv_input').change(function () {

                var required = payment.isInArray('cvv_input', requiredFields);
                var result = payment.checkInputIsOk('cvv_input', payment.generalpar['CaptionSet']['cs_cvv'], payment.rgx_cvv, required, true);
                var statusCode = result[0];
                var errMsg = result[1];

                //console.log('statusCode:' + statusCode)
                //console.log('errMsg:' + errMsg)

                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#cvv_input'), required);
                }
                else {
                    payment.showError(errMsg, false);
                    payment.changeBorderColorByStatus($('#cvv_input'), statusCode, required);
                }

            });
        }

        if ($('#id_customer_index').length) {
            $('#id_customer_index').change(function () {
                var required = payment.isInArray('id_customer_index', requiredFields);
                var result = payment.checkInputIsOk('id_customer_index', payment.generalpar['CaptionSet']['cs_customer_index'], payment.rgx_number, required, true);
                var statusCode = result[0];
                var errMsg = result[1];

                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#id_customer_index'), required);
                }
                else {
                    payment.showError(errMsg, false);
                    payment.changeBorderColorByStatus($('#id_customer_index'), statusCode, required);
                }

            });
        }

        if ($('#card_holder_name_input').length) {
            $('#card_holder_name_input').change(function () {

                var required = payment.isInArray('card_holder_name_input', requiredFields);
                var result = payment.checkInputIsOk('card_holder_name_input', payment.generalpar['CaptionSet']['cs_holdername'], payment.rgx_name, required, true);
                var statusCode = result[0];
                var errMsg = result[1];


                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#card_holder_name_input'), required);
                }
                else {
                    payment.showError(errMsg, false);
                    payment.changeBorderColorByStatus($('#card_holder_name_input'), statusCode, required);
                }

            });
        }

        if ($('#id_number_input').length) {
            $('#id_number_input').change(function () {

                var required = payment.isInArray('id_number_input', requiredFields);
                var result = payment.checkInputIsOk('id_number_input', payment.generalpar['CaptionSet']['cs_id'], payment.rgx_number, required, true);
                var statusCode = result[0];
                var errMsg = result[1];


                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#id_number_input'), required);
                }
                else {
                    payment.showError(errMsg, false);
                    payment.changeBorderColorByStatus($('#id_number_input'), statusCode, required);
                }

            });
        }


        $('#credit_card_number_input').change(function () {
            var elementId = 'credit_card_number_input';
            var currentElement = $('#credit_card_number_input');
            var elementName = payment.generalpar['CaptionSet']['cs_cardnumber'];
            var required = payment.isInArray(elementId, requiredFields);

            var result = [];
            if (currentElement.val().trim() == '') {
                if (required)
                    result = [1, elementName + ' ' + message.CantBeEmptyErr];
                else
                    result = [0, ''];
            }
            else if (currentElement.val().replace(/\-/g, '').replace(/\ /g, '').trim().match(payment.rgx_stripped_card) && currentElement.val().replace(/\-/g, '').trim().length > 30) {

                // If Track2Bypass is true store the Track2 value for the payment process in the model
                if (payment.generalpar['Track2Bypass'].toLowerCase() == 'true' || payment.generalpar['Track2Swipe'].toLowerCase() == 'true') {
                    payment.submitModel.Track2 = currentElement.val().replace(/\-/g, '').replace(/\ /g, '').trim().toLowerCase();
                }
                cardStrip.init();
                return;
            }
            else if (!currentElement.val().trim().replace(/\-/g, '').replace(/\ /g, '').match(payment.rgx_number)) {
                currentElement.val('');

                result = [2, elementName + ' ' + message.BadFormatErr];
            }
            else {
                result = payment.isInputLogical(elementId);
            }

            var statusCode = result[0];
            var errMsg = result[1];

            if (statusCode == 0) {
                payment.hideErrorField();
                payment.changeBorderColorPositive($('#' + elementId + ''), required);
            }
            else {
                payment.showError(errMsg, false);
                payment.changeBorderColorByStatus($('#' + elementId + ''), statusCode, required);
            }
        });

        $('#date_year_input').change(function () {
            payment.validateExpirationDates();
        });

        $('#date_month_input').change(function () {
            payment.validateExpirationDates();
        });


        if ($('#free_total_input').length) {
            $('#free_total_input').change(function () {
                $('#free_total_input').val(payment.toFixedNew($('#free_total_input').val(), 2));
                var elementName = payment.generalpar['CaptionSet']['cs_free_total'];
                var elementId = 'free_total_input';
                var required = payment.isInArray(elementId, requiredFields);

                var result = payment.checkInputIsOk(elementId, elementName, payment.rgx_total, required, true);
                var statusCode = result[0];
                var errMsg = result[1];

                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.modifyPayments(true);
                    payment.changeBorderColorPositive($('#first_payment_input'), payment.isInArray('first_payment_input', requiredFields));
                    payment.changeBorderColorPositive($('#free_total_input'), required);
                }
                else {
                    payment.showError(errMsg, true);
                    payment.modifyPayments(true);
                    payment.changeBorderColorByStatus($('#first_payment_input'), statusCode, payment.isInArray('first_payment_input', requiredFields));
                    payment.changeBorderColorPositive($('#free_total_input'), required, required);
                }
            });
        }

        if ($('#first_payment_input').length && $('#first_payment_input').val() != 'auto') {
            $('#first_payment_input').change(function () {
                var elementName = payment.generalpar['CaptionSet']['cs_first_payment'];
                var elementId = 'first_payment_input';
                var required = payment.isInArray(elementId, requiredFields);

                var result = payment.checkInputIsOk(elementId, elementName, payment.rgx_total, required, true);
                var statusCode = result[0];
                var errMsg = result[1];
                //console.log('statusCode:' + statusCode);
                //console.log('errMsg:' + errMsg);

                //console.log(requiredFields);

                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.modifyPayments(false);
                    payment.changeBorderColorPositive($('#first_payment_input'), required);
                    payment.changeBorderColorPositive($('#free_total_input'), payment.isInArray('free_total_input', requiredFields));
                }
                else {
                    payment.showError(errMsg, true);
                    payment.modifyPayments(true);
                    payment.changeBorderColorByStatus($('#first_payment_input'), statusCode, required);
                    payment.changeBorderColorPositive($('#free_total_input'), payment.isInArray('free_total_input', requiredFields));
                }
            });
        }

        if ($('#num_of_payments').length) {
            $("#num_of_payments").change(function () {
                payment.hidePayments_IfNeeded();
                payment.modifyPayments(true);
                payment.changeBorderColorPositive($('#first_payment_input'), $.inArray('first_payment_input', requiredFields) > -1);
            });
        }

        if ($('#email_input').length) {
            $('#email_input').change(function () {
                var elementId = 'email_input';
                var email = $('#' + elementId + '').val();
                var required = payment.isInArray('email_input', requiredFields);

                if ((!required && email == '') || (payment.rgx_mail.test(email) && payment.reg_mail_address_allowed_characters.test(email))) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#' + elementId + ''), required);  //changeBorderColor($('#' + elementId + ''), 'green');
                }
                else {
                    payment.showError(payment.generalpar['CaptionSet']['cs_email'] + ' ' + message.BadFormatErr, false);
                    payment.changeBorderColor($('#' + elementId + ''), 'red');
                }
            });
        }

        if ($('#phone_input').length) {
            $('#phone_input').change(function () {
                var elementName = payment.generalpar['CaptionSet']['cs_phone'];
                var elementId = 'phone_input';
                var phone = $('#' + elementId + '').val();
                var required = payment.isInArray(elementId, requiredFields);

                var result = payment.checkInputIsOk(elementId, elementName, payment.rgx_phone, required, true);
                var statusCode = result[0];
                var errMsg = result[1];

                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#' + elementId + ''), required);
                }
                else {
                    payment.changeBorderColorByStatus($('#' + elementId + ''), statusCode, required);
                    payment.showError(errMsg, false);
                }
            });
        }

        if ($('#remarks_input').length) {
            $('#remarks_input').change(function () {
                var elementName = payment.generalpar['CaptionSet']['cs_remarks'];
                var elementId = 'remarks_input';
                var remarks = $('#' + elementId + '').val();
                var required = payment.isInArray(elementId, requiredFields);

                var result = payment.checkInputIsOk(elementId, elementName, payment.rgx_remarks, required, !clearIfBadFormated);
                var statusCode = result[0];
                var errMsg = result[1];

                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#' + elementId + ''), required);
                }
                else {
                    payment.changeBorderColorByStatus($('#' + elementId + ''), statusCode, required);
                    payment.showError(errMsg, false);
                }
            });
        }

        if ($('#id_captcha_code').length) {
            $('#id_captcha_code').change(function () {
                var elementName = payment.generalpar['CaptionSet']['cs_captcha'];
                var elementId = 'id_captcha_code';
                var required = payment.isInArray(elementId, requiredFields);

                var result = payment.checkInputIsOk(elementId, elementName, payment.rgx_captcha, required, false);
                var statusCode = result[0];
                var errMsg = result[1];

                if (statusCode == 0) {
                    payment.hideErrorField();
                    payment.changeBorderColorPositive($('#' + elementId + ''), required);
                }
                else {
                    payment.changeBorderColorByStatus($('#' + elementId + ''), statusCode, required);
                    payment.showError(errMsg, false);
                }

            });
        }
    },
    checkInputIsOk: function (elementId, elementName, regex, isRequired, clearIfBadFormated) {


        var currentElement = $('#' + elementId + '');

        if (currentElement.val().trim() == '') {
            if (isRequired)
                return [1, elementName + ' ' + message.CantBeEmptyErr];
            else
                return [0, ''];
        }

        if (!currentElement.val().trim().match(regex)) {
            if (clearIfBadFormated) {
                currentElement.val('');
                return [2, elementName + ' ' + message.BadFormatErr];
            }
            else
                return [1, elementName + ' ' + message.BadFormatErr];
        }

        var isInputLogical = payment.isInputLogical(elementId);



        return isInputLogical;
    },
    isInputLogical: function (elementId) {
        switch (elementId) {
            case 'credit_card_number_input':
                if ($('#credit_card_number_input').val().length < 6)
                    return [1, payment.generalpar['CaptionSet']['cs_cardnumber'] + ' ' + message.GeneralErr];
                break;
            case 'id_number_input':
                if ($('#id_number_input').val().length < 7)
                    return [1, payment.generalpar['CaptionSet']['cs_id'] + ' ' + message.GeneralErr];
                break;
            case 'cvv_input':
                if ($('#cvv_input').val().trim().length < 3)
                    return [1, payment.generalpar['CaptionSet']['cs_cvv'] + ' ' + message.GeneralErr];
                break;
            //case 'id_customer_index':
            //if ($('#id_customer_index').val().trim().length < 3)
            //return [1, payment.generalpar['CaptionSet']['id_customer_index'] + ' ' + message.GeneralErr];
            //break;
            case 'free_total_input':
                if (parseFloat(payment.getCurrentTotal()) <= parseFloat($('#first_payment_input').val())) { //parseInt($('#free_total_input').val()) < parseInt(payment.getCurrentTotal()) || parseInt($('#free_total_input').val()) < parseInt($('#first_payment_input').val()
                    return [3, payment.generalpar['CaptionSet']['cs_free_total'] + ' ' + message.GeneralErr];
                }
                break;
            case 'first_payment_input':
                if ($('#first_payment_input').val() == 0) {
                    return [3, payment.generalpar['CaptionSet']['cs_first_payment'] + ' ' + message.ZeroErr];
                }

                var flTotal = parseFloat(payment.getCurrentTotal());
                var flFirstPayment = parseFloat($('#first_payment_input').val());

                if (flTotal < 0)
                    flTotal = flTotal * -1;

                if (flFirstPayment)
                    flFirstPayment = flFirstPayment * -1;

                if (flTotal <= flFirstPayment) {

                    return [3, payment.generalpar['CaptionSet']['cs_first_payment'] + ' ' + message.GeneralErr];
                }

                break;
            default:
                break;
        }

        return [0, "OK"];
    },
    modifyPayments: function (firstPaymentToZero) {

        var currentTotal = payment.getCurrentTotal();

        var numOfPayments = $('#num_of_payments').find(":selected").text();

        if (numOfPayments == 1)
            return;

        var firstPayment = (payment.generalpar['FirstPaymentMode'] == 'auto' || firstPaymentToZero) ? 0 : payment.setZeroIfEmpty('first_payment_input');

        payment.calcPayments(currentTotal, numOfPayments, parseFloat(firstPayment));


    },
    calcPayments: function (total, numOfPayments, firstPaymentInput) {

        var firstPayment;
        var eachPayment;
        var diff;
        var minFirsPayment = Number(payment.generalpar['MinFirstPayment']);

        total = Math.abs(total);

        if (firstPaymentInput == 0) { // auto payments

            payment.calcFirstAndLast(total, numOfPayments);


            //if (flt_FirstPayment < minFirsPayment) {
            if (minFirsPayment > 0) { // the default value was provided

                firstPayment = minFirsPayment;

                payment.calcFirstAndLast((total * 10 - firstPayment * 10) / 10, numOfPayments - 1); // * 10 is workaround for double values issue

                diff = flt_FirstPayment - flt_EachPayment;  // get the difference between 2d and 3d payment

                firstPayment = firstPayment + diff; // roll this difference to the first payment

            }
            else {
                firstPayment = flt_FirstPayment;
            }

            eachPayment = flt_EachPayment;

        }
        else { // manual payments

            firstPayment = firstPaymentInput;

            if (firstPayment < minFirsPayment) {
                firstPayment = minFirsPayment;
            }

            payment.calcFirstAndLast((total * 10 - firstPayment * 10) / 10, numOfPayments - 1); // * 10 is workaround for double values issue

            diff = flt_FirstPayment - flt_EachPayment; // get the difference between 2d and 3d payment

            firstPayment = firstPayment + diff; // roll this difference to the first payment

            eachPayment = flt_EachPayment;

        }

        $('#first_payment_input').val(payment.toFixedNew(firstPayment, 2));
        $('#each_payment_input').val(payment.toFixedNew(eachPayment, 2));

    },
    calcFirstAndLast: function (total, numOfPayments) {
        if (total == 0) { flt_EachPayment = flt_FirstPayment = 0; return; }
        var rem;

        flt_EachPayment = ~~((total * 100) / (numOfPayments)); // get absolute [~~] amount of each payment:

        rem = (total * 100) % flt_EachPayment;
        flt_FirstPayment = flt_EachPayment + rem;

        flt_EachPayment = flt_EachPayment / 100;
        flt_FirstPayment = flt_FirstPayment / 100;

    },

    setBrandLogo: function () {

        if (payment.generalpar['ShowBrandLogo']) {

            $('#credit_card_number_input').keyup(function () {

                var currenctVal = $(this).val().replace(/\-/g, '').replace(/\ /g, '');

                for (var i in payment.brands) {
                    var brand = payment.brands[i];

                    if (new RegExp(brand.regex).test(currenctVal)) {
                        $('#brand_icon').attr('src', brand.logoUrl).show();
                        return;
                    }
                }

                $('#brand_icon').attr('src', null).hide();
            });
        }
    },

    setDashToCreditcard_IfNeeded: function () {
        if (payment.generalpar['SplitCCNumber'] == payment.trueValue) {
            var splitChar = payment.generalpar['SplitCCNumberWithSpaces'] ? ' ' : '-';
            $('#credit_card_number_input').keydown(function (evt) {
                //console.log('keydown')
                //if (evt.keyCode == 8 ||
                //    evt.keyCode == 9 ||
                //    (evt.which >= 48 && evt.which <= 57) ||
                //    (evt.which >= 96 && event.which <= 105) ||
                //    (evt.which >= 37 && event.which <= 40) ||
                //    (evt.which == 40))
                //    return true;
                //else{
                //    return false;
                //}
                switch (evt.keyCode) {
                    case 8:
                        //ON Backspace Press DoNothing
                        break;
                    case 9:
                        //ON Tab Press DoNothing
                        break;
                    default:
                        var filteredCCNum = $(this).val().split(splitChar).join(' ').replace(/\ /g, '').toString(); //remove dashes if any
                        var modifiedCCNum = '';
                        if ((filteredCCNum.length) % 4 == 0) {
                            for (var i = 1; i < filteredCCNum.length + 1; i++) {
                                modifiedCCNum += (i % 4 == 0) ? filteredCCNum[i - 1] + splitChar : filteredCCNum[i - 1];
                            }
                            $(this).val(modifiedCCNum);

                        }
                        break;
                }
            });
        }
    },

    ////Helpers
    isIE: function () {
        var myNav = navigator.userAgent.toLowerCase();

        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
    },
    isiPhone: function () {
        var myNav = navigator.platform;
        return (myNav.indexOf('iPhone') != -1);
    },
    isAndroid: function () {
        var myNav = navigator.userAgent;
        return (myNav.indexOf('Android') != -1);
    },
    getCurrentTotal: function () {

        var freeTotal;
        var totalAll;

        if ($('#free_total_input').length)
            freeTotal = $('#free_total_input').val() == '' ? 0 : Number($('#free_total_input').val());
        else
            freeTotal = 0;

        if ($('#totalAll').length)
            totalAll = $('#totalAll').val() == '' ? 0 : Number($('#totalAll').val());
        else
            totalAll = 0;

        return totalAll + freeTotal;
    },
    checkHidden: function (elementId) {
        return $('#' + elementId + '').is(":visible");
    },
    setZeroIfEmpty: function (elementId) {
        return ($('#' + elementId + '').val() == '') ? 0 : $('#' + elementId + '').val();
    },
    checkFieldAndErace: function (element, regex) {
        if (element.val().trim().match(regex))
            return true;
        else {
            element.val('');
            return false;
        }
    },
    isInArray: function (element, arr) {
        return ($.inArray(element, arr) >= 0);
    },
    isRequired: function (element) {
        return ($.inArray(element, requiredFields >= 0));
    },
    addToRequired: function (elementId) {
        requiredFields.push(elementId);
    },
    changeBorderColorPositive: function (element, isRequired) {
        //console.log('element:' + element.attr('id') + ',isRequired:' + isRequired);
        if (isRequired)
            payment.changeBorderColor(element, 'green');
        else
            payment.changeBorderColor(element, 'none');
    },
    changeBorderColorByStatus: function (element, statusCode, isRequired) {
        //console.log('changeBorderColorByStatus-element:' + element.attr('id') + ',statusCode:' + statusCode + ',isRequired:' + isRequired);
        if ((statusCode == 0 || statusCode == 3) && isRequired)
            payment.changeBorderColor(element, 'green');
        else if (statusCode == 1) {
            payment.changeBorderColor(element, 'red');
        }
        else //if (statusCode == 2)
            payment.changeBorderColor(element, 'none');
    },
    changeBorderColor: function (element, color) {
        if (!payment.generalpar.CustomErrorHandling) {
            switch (color) {
                case 'green':
                    element.css('border', '#066600 2px solid');
                    break;
                case 'red':
                    element.css('border', '#C00000 2px solid');
                    break;
                case 'none':
                    //element.css('border', 'none');
                    element.css('border', 'black 1px solid');
                    break;
                default:
                    break;
            }
        }
        else {

            $(element).removeClass(payment.generalpar.ErrorClass);
            $(element).removeClass(payment.generalpar.RequiredValidatedClass);

            switch (color) {
                case 'green':
                    $(element).addClass(payment.generalpar.RequiredValidatedClass);
                    break;
                case 'red':
                    $(element).addClass(payment.generalpar.ErrorClass);
                    break;
            }
        }
    },
    paintCheckBoxRed: function (element) {
        element.css('outline-color', 'red');
        element.css('outline-style', 'solid');
        element.css('outline-width', 'thin');
    },
    paintCheckBoxGreen: function (element) {
        element.css('outline-color', 'green');
        element.css('outline-style', 'solid');
        element.css('outline-width', 'thin');
    },
    showError: function (error_msg, showAlways) {

        //if (payment.isAfterFirstSubmit == 'true' || showAlways) {
        logMessage('showError: ' + error_msg);

        $('#errorRow').html('<div class="container"><div id="error" class="error" tabindex="0">' + error_msg + '</div></div>')
        $('#errorRow').show();

        //$('#error').text(error_msg);

        // $('#error').attr('role', "alert");
        //$('#errorRow').css("background-color", "red");


        //        $('#error').show();

        payment.unblockUI($('#content_container'));

        //}
    },
    hideErrorField: function (elementId) {


        //   $('#error').removeAttr("role");
        //$('#error').text('');
        //$('#error').hide();

        $('#errorRow').hide();//css("background-color", "green");
        $('#errorRow').html('');


    },
    checkDateTimeHelper: function (currentYear, currentMonth, inputYear, inputMonth) { //, currentMonth, inputYear, inputMonth
        if (inputMonth.length == 1) inputMonth = 0 + inputMonth;
        if (currentMonth.length == 1) currentMonth = 0 + currentMonth;

        return (parseInt(currentYear + currentMonth) <= parseInt(inputYear + inputMonth)) ? 'OK' : message.CreditCardDateFormatErr;
    },
    toFixedNew: function (value, precision) {
        var precision = precision || 0,
            neg = value < 0,
            power = Math.pow(10, precision),
            value = Math.round(value * power),
            integral = String((neg ? Math.ceil : Math.floor)(value / power)),
            fraction = String((neg ? -value : value) % power),
            padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

        return precision ? integral + '.' + padding + fraction : integral;
    },
    replaceAt: function (index, character) {
        return this.substr(0, index) + character + this.substr(index + character.length);
    }
};

$("#authorizationNumberSubmitBtn").click(function () {

    var input = $("#authorizationNumber").val();

    if (input.length <= 10) {
        var url = $(this).data("url");

        payment.submitModel.AuthorizationNumber = input.toLowerCase();
        payment.hideErrorField();

        if (payment.localAgentSubmission == false) {
            payment.blockSubmitBtn();
            payment.sendAjax(url, payment.submitModel);
        }
        else {
            payment.blockSubmitBtnForPinPad();
            payment.sendAjaxToAgent();
        }


        $("#authNumFromCreditCompany").dialog("close");
    }
    else {
        $('#dialogError').text(payment.generalpar['CaptionSet']['cs_validAuthNumMessage']);
        $('#dialogErrorRow').show();
    }
})

var flt_EachPayment;
var flt_FirstPayment;

var requiredFields = [];

function optionalField(input, container) {
    this.input = input;
    this.container = container;
}

function elementObj(id, name, regex) {
    this.id = id;
    this.name = name;
    this.regex = regex;
}

var cardObject = function () {
    cardObject.creditCardStrip = '';
    cardObject.transactionId = '';
    cardObject.returnDashedNumber = '';
}

function SubmitModel() {
    this.TransactionId = '';
    this.CreditCardNumber = '';
    this.CreditCardHolder = '';
    this.IdNumber = '';
    this.CreditCardDate = '';
    this.CvvNumber = '';
    this.FreeTotal = '';
    this.NumOfPayments = '';
    this.FirstPayment = '';
    this.EachPayment = '';
    this.Email = '';
    this.Phone = '';
    this.Address = '';
    this.City = '';
    this.Country = '';
    this.AddressIndex = '';
    this.Track2 = '';
    this.Token = '';
    this.AgentCallTrxId = '';
    this.Platform = '';
    this.WalletType = '';
    this.Captcha = '';
}

function SetReadOnlyField(fieldId, value) {
    if (value) {
        $('#' + fieldId).attr('disabled', '');
    }
}

function logMessage(message) {
    if (typeof console == "object") {
        console.log(message);
    }
}

var cardStrip = {
    init: function () {

        $('#credit_card_number_input').attr('readonly', 'readonly'); //.css('background', '#f0f0f0')
        $('#date_month_input, #date_year_input').attr('disabled', 'disabled');
        $('#credit_card_number_input_clear').show();

        cardStrip.cardObj = new cardObject();

        cardStrip.cardObj.transactionId = payment.generalpar['TransactionId'];

        var creditNum = $('#credit_card_number_input').val() + "";

        cardStrip.cardObj.creditCardStrip = creditNum.toLowerCase();

        cardStrip.cardObj.returnDashedNumber = payment.generalpar['SplitCCNumber'] == payment.trueValue ? 'true' : 'false';

        payment.blockSubmitBtn();

        cardStrip.ajaxCall(payment.generalpar['urlCheckCreditCard'], cardStrip.cardObj);
    },
    ajaxCall: function (url, dataObj) {
        $.ajax({
            url: url,
            type: "POST",
            timeout: 30000,
            data: dataObj,
            success: function (result) {
                cardStrip.succeed(result);
            }
            ,
            error: function (result) {
                logMessage('Error ' + result);
                cardStrip.fail();
            }
        });
    },
    succeed: function (result) {

        cardStrip.resultModel = eval('(' + result + ')');

        $('#credit_card_number_input').val(cardStrip.resultModel['cardNumber']);
        $('#date_month_input').val(cardStrip.resultModel['month']);
        $('#date_year_input').val(cardStrip.resultModel['year']);

        logMessage('cardNumber:' + cardStrip.resultModel['cardNumber']);
        logMessage('month:' + cardStrip.resultModel['month']);
        logMessage('year:' + cardStrip.resultModel['year']);

        $('#credit_card_number_input').removeAttr('readonly', 'readonly'); //.css('background', '#f0f0f0')
        $('#date_month_input, #date_year_input').removeAttr('disabled', 'disabled');

        payment.changeBorderColor($('#credit_card_number_input'), 'green');

        var err = payment.validateExpirationDates('');
        if (err.length)
            payment.showError(err, true);

        if (cardStrip.resultModel['year'] != $('#date_year_input').val()) {
            payment.showError(message.CreditCardDateFormatErr + " " + cardStrip.resultModel['month'] + "-" + cardStrip.resultModel['year'], true);
        } else if (payment.generalpar['showSubmitButton'] == false || payment.generalpar['Track2Swipe'].toLowerCase() == 'true') {
            payment.submitPaymentForm();
            return; // Leave it locked
        }

        payment.unblockUI($('#content_container'));
    },
    fail: function (result) {
        payment.unblockUI($('#content_container'));
        alert('Failed to reach the server') //todo alert on ajax error
    }
}

function isIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function AddIframeEventListener() {
    if (window.addEventListener) {
        window.addEventListener("message", messageParentListener, false);
    }
    else {
        window.attachEvent("onmessage", messageParentListener);
    }
}

function GetApplePayRequest() {
    var freeTotal = Number($('#free_total_input').val()) || 0;
    var total = Number(payment.generalpar.total) || 0;

    var request = {
        countryCode: 'IL',
        currencyCode: payment.generalpar.currencyCode,
        supportedNetworks: ["amex", "visa", "masterCard"],
        merchantCapabilities: ["supports3DS"], // must be supplied
        lineItems: [],
        total: {
            label: payment.generalpar.ApplePay.label,
        },
        requiredShippingContactFields: payment.generalpar.ApplePay.requiredShippingContactFields
    }

    for (var i in payment.generalpar.ApplePay.lineItems) {
        request.lineItems.push(payment.generalpar.ApplePay.lineItems[i]);
    }

    if (request.lineItems.length == 0) {
        request.lineItems.push({ label: payment.generalpar['CaptionSet']['cs_total'], amount: total });
    }

    if (freeTotal > 0) {
        request.lineItems.push({ label: payment.generalpar['CaptionSet']['cs_free_total'], amount: freeTotal });
    }

    request.total.amount = total + freeTotal;
    request.total.amount = Math.round(request.total.amount * 100) / 100; // this fixes js bug when adding certain numbers (e.g. 2.56 + 3.00)

    return request;
}

function getParentUrl() {
    var url = (window.location != window.parent.location) ? document.referrer : document.location.href;
    url = 'https://' + url.match(/:\/\/(.[^/]+)/)[1];
    return url;
}

function ApplePayOnPaymentAuthorized(eventPayment) {
    if (eventPayment.shippingContact) {
        $('#card_holder_name_input').val([eventPayment.shippingContact.givenName, eventPayment.shippingContact.familyName].join(' '));
        $('#id_customer_address').val(eventPayment.shippingContact.addressLines.join());
        $('#id_customer_city').val(eventPayment.shippingContact.locality);
        $('#id_customer_index').val(eventPayment.shippingContact.postalCode);
        $('#id_customer_country').val(eventPayment.shippingContact.country);
        $('#email_input').val(eventPayment.shippingContact.emailAddress);
        $('#phone_input').val(eventPayment.shippingContact.phoneNumber);
    }

    payment.fillSubmitModel();
    payment.submitModel.ApplePayPaymentToken = JSON.stringify(eventPayment.token);
}

function messageParentListener(evt) {
    var type = evt.data.type;
    var method = evt.data.method;
    var message = evt.data.message;

    if (type === 'applePayResponse') {
        if (method === 'canMakePayments' && message) {
            $('#applePayTab').show();
            $('#applePayButton').click(function () {
                var request = GetApplePayRequest();
                parent.postMessage({ type: 'applepay', method: 'clickButton', message: request, generalpar: payment.generalpar }, getParentUrl());
            });
        } else if (method === 'onvalidatemerchant') {
            var query = { validationURL: evt.data.validationURL, transactionId: payment.generalpar.TransactionId, initiativeContext: getParentUrl() };
            $.ajax({
                url: '/PaymentGW/ApplePayPaymentSession?' + $.param(query),
                success: function (response) {
                    parent.postMessage({ type: 'applepay', method: 'paymentSession', message: response }, getParentUrl());
                },
                error: function (response) {
                    console.log(response);
                }
            });
        } else if (method === 'onpaymentauthorized') {
            ApplePayOnPaymentAuthorized(message);
            var authorizationResult = {
                status: ApplePaySession.STATUS_SUCCESS,
                errors: []
            };

            $.ajax({
                url: payment.generalpar['urlTransaction'],
                type: "POST",
                data: JSON.stringify(payment.submitModel),
                contentType: 'application/json',
                complete: function () {
                    parent.postMessage({ type: 'applepay', method: 'onpaymentauthorized', message: authorizationResult }, getParentUrl());
                    payment.submitModel.ApplePayPaymentToken = undefined;
                },
                success: function (response) {
                    if (typeof response == 'string') {
                        response = JSON.parse(response);
                    }
                    if (Number(response.StatusCode) != 0) {
                        authorizationResult.status = ApplePaySession.STATUS_FAILURE;
                    }
                    payment.afterSubmit(response);
                },
                error: function (response, status) {
                    authorizationResult.status = ApplePaySession.STATUS_FAILURE;
                }
            });
        }
    }
}

function applePayLogic() {
    if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
        $('#applePayTab').show();

        $('#applePayButton').click(function () {
            var version = 3;
            while (ApplePaySession.supportsVersion(version + 1)) {
                version++;
            }

            var request = GetApplePayRequest();
            var session = new ApplePaySession(version, request);

            session.onvalidatemerchant = function (event) {

                var query = { validationURL: event.validationURL, transactionId: payment.generalpar.TransactionId, initiativeContext: getParentUrl() };

                $.ajax({
                    url: '/PaymentGW/ApplePayPaymentSession?' + $.param(query),
                    success: function (response) {
                        var merchantSession = JSON.parse(response.merchantSession);
                        session.completeMerchantValidation(merchantSession);
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            };

            session.onshippingcontactselected = function (event) {

                console.log('onshippingcontactselected');

                try {
                    var update = {
                        newLineItems: request.lineItems,
                        newTotal: request.total,
                        errors: []
                    };

                    var requiredFieldsCaptions = {
                        "locality": payment.generalpar.CaptionSet.cs_customer_city,
                        "postalCode": payment.generalpar.CaptionSet.cs_customer_index,
                        "country": payment.generalpar.CaptionSet.cs_customer_country,
                    };

                    var missingFields = [];

                    for (var requiredAddressField in payment.generalpar.ApplePay.requiredAddressFields) {
                        requiredAddressField = payment.generalpar.ApplePay.requiredAddressFields[requiredAddressField];

                        if (!event.shippingContact[requiredAddressField]) {
                            missingFields.push(requiredAddressField);
                        }
                    }

                    for (var i in missingFields) {
                        var missingField = missingFields[i];
                        var message = missingFields.map(function (f) { return requiredFieldsCaptions[f]; }).join(',');

                        update.errors.push(new ApplePayError("shippingContactInvalid", missingField, payment.generalpar.CaptionSet.cs_mustfields + ': ' + message));
                        update.status = ApplePaySession.STATUS_FAILURE;
                    }

                    session.completeShippingContactSelection(update);
                } catch (e) {
                }
            };

            session.onpaymentauthorized = function (event) {
                console.log('onpaymentauthorized');
                ApplePayOnPaymentAuthorized(event.payment);
                var authorizationResult = {
                    status: ApplePaySession.STATUS_SUCCESS,
                    errors: []
                };

                $.ajax({
                    url: payment.generalpar['urlTransaction'],
                    type: "POST",
                    data: JSON.stringify(payment.submitModel),
                    contentType: 'application/json',
                    complete: function () {
                        session.completePayment(authorizationResult);
                        payment.submitModel.ApplePayPaymentToken = undefined;
                    },
                    success: function (response) {
                        if (typeof response == 'string') {
                            response = JSON.parse(response);
                        }
                        if (Number(response.StatusCode) != 0) {
                            authorizationResult.status = ApplePaySession.STATUS_FAILURE;
                        }
                        payment.afterSubmit(response);
                    },
                    error: function (response, status) {
                        authorizationResult.status = ApplePaySession.STATUS_FAILURE;
                    }
                });
            }

            session.begin();
        });
    }
}