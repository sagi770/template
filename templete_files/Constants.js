var message = {
    init: function () {
        message.trueValue = 'true';
        message.mustValue = 'must';
        message.optionalValue = 'optional';
        message.hideValue = 'hide';
        message.autoeValue = 'auto';
        message.manualValue = 'manual';
        message.autoeValue = 'auto';
        message.autoeValue = 'auto';
    },
    //TODO: Messages are different in languages ? (Alexey)
    defaults:
    {

        he: [
            { ErrorName: 'CreditCardFormatErr', Decription: 'מספר כרטיס לא תקין' },
            { ErrorName: 'CreditCardDateFormatErr', Decription: 'תוקף הכרטיס לא תקין' },
            { ErrorName: 'IdFormatErr', Decription: 'מספר ת.ז לא תקין' },
            { ErrorName: 'CvvFormatErr', Decription: 'קוד אימות לא תקין' },
            { ErrorName: 'cs_Cvv_Popup_Alt_Text', Decription: 'מסך צף עם הסברים על קוד אימות כרטיס' },
            { ErrorName: 'GeneralErr', Decription: 'לא תקין' },
            { ErrorName: 'ZeroErr', Decription: 'לא יכול להיות אפס' },
            { ErrorName: 'CantBeEmptyErr', Decription: 'לא יכול להיות ריק' },
            { ErrorName: 'BadFormatErr', Decription: 'לא בפורמט הנכון' },
            { ErrorName: 'AcceptTerms', Decription: 'אנא אשר\י את תנאי ההסכם' },
            { ErrorName: 'PositiveErr', Decription: 'חייב להיות מספר חיובי' },
            { ErrorName: 'CvvImage', Decription: 'CardsCvvHelpS.PNG' },
            { ErrorName: 'BlockUiWait', Decription: 'המתן' },
            { ErrorName: 'BlockUiWaitPinPad', Decription: 'ממתין לפינפד‬‎' },
            { ErrorName: 'CreditCardNotAccepted', Decription: 'מספר הכרטיס אינו נתמך' },
            { ErrorName: 'BlockUiWaitWalletSms', Decription: '‬‎נשלח SMS לנייד. נא להשלים את התשלום דרך האפליקציית XXX. אין לסגור את החלון!' },
            { ErrorName: 'BlockUiWaitWallet', Decription: '‬‎נא להשלים את התשלום דרך האפליקציית XXX. אין לסגור את החלון!' },
            { ErrorName: 'alt_Confirmation_box', Decription: 'נא לאשר' },
            { ErrorName: 'bitConfirametion', Decription: 'בחרת/ה לבצע תשלום דרך אפליקציית ביט. התשלום יבוצע באמצעות סמארטפון.' }
        ],
        en: [
            { ErrorName: 'CreditCardFormatErr', Decription: 'Illegal Credit Card Number' },
            { ErrorName: 'CreditCardDateFormatErr', Decription: 'Credit card Expired' },
            { ErrorName: 'IdFormatErr', Decription: 'Illegal ID number' },
            { ErrorName: 'CvvFormatErr', Decription: 'Illegal CVV number' },
            { ErrorName: 'cs_Cvv_Popup_Alt_Text', Decription: 'Explanation about CvC(Card Verification Code) popup' },
            { ErrorName: 'FreeMoneyLogicErr', Decription: 'Illegal Extra payment, Total + Extra payment must be larger that the first payment' },
            { ErrorName: 'FirstPaymentLogicErr:', Decription: 'Illegal first payment, Total + Extra payment must be larger that the first payment' },
            { ErrorName: 'ZeroErr', Decription: 'must be larger than 0' },
            { ErrorName: 'CantBeEmptyErr', Decription: 'cant be empty' },
            { ErrorName: 'BadFormatErr', Decription: 'not in the right format' },
            { ErrorName: 'AcceptTerms', Decription: 'Please accept terms and conditions' },
            { ErrorName: 'PositiveErr', Decription: 'Must be a positive number' },
            { ErrorName: 'CvvImage', Decription: 'CardsCvvHelpS.PNG' },
            { ErrorName: 'BlockUiWait', Decription: 'Please Wait' },
            { ErrorName: 'BlockUiWaitPinPad', Decription: 'Waiting For Pinpad‬‎' },
            { ErrorName: 'CreditCardNotAccepted', Decription: 'This credit card number is not accepted' },
            { ErrorName: 'BlockUiWaitWalletSms', Decription: '‬‎We sent you an SMS. Please complete the payment in the XXX app. Don`t close this window!' },
            { ErrorName: 'BlockUiWaitWallet', Decription: 'Please complete the payment in the XXX app. Don`t close this window!' },
            { ErrorName: 'alt_Confirmation_box', Decription: 'Please confirm' },
            { ErrorName: 'bitConfirametion', Decription: 'You have chosen to pay by the Bit app. Payment will be made via smartphone.' }
        ],
        ru: [

            { ErrorName: 'CreditCardFormatErr', Decription: 'Ошибка в номере кредитной карты' },
            { ErrorName: 'CreditCardDateFormatErr', Decription: 'Ошибка в дате срока действия карты' },
            { ErrorName: 'IdFormatErr', Decription: 'Ошибка в номере УЛ' },
            { ErrorName: 'CvvFormatErr', Decription: 'Введён неверный код безопасности (CVV)' },
            { ErrorName: 'cs_Cvv_Popup_Alt_Text', Decription: 'Экран с объяснениями о проверочном коде карты' },
            { ErrorName: 'FreeMoneyLogicErr', Decription: 'Ошибка в поле добавочной суммы' },
            { ErrorName: 'FirstPaymentLogicErr:', Decription: 'Ошибка в сумме первого платежа' },
            { ErrorName: 'ZeroErr', Decription: 'должен быть больше 0' },
            { ErrorName: 'CantBeEmptyErr', Decription: 'не может быть незаполненным' },
            { ErrorName: 'BadFormatErr', Decription: 'введено неверно' },
            { ErrorName: 'AcceptTerms', Decription: 'Пожалуйста подтвердите условия соглашения' },
            { ErrorName: 'PositiveErr', Decription: 'Должно быть положительным числом' },
            { ErrorName: 'CvvImage', Decription: 'CardsCvvHelpS.PNG' },
            { ErrorName: 'BlockUiWait', Decription: 'в процессе' },
            { ErrorName: 'BlockUiWaitPinPad', Decription: 'Ожидание терминала' },
            { ErrorName: 'CreditCardNotAccepted', Decription: 'Карты этого типа не принимаются к оплате' },
            { ErrorName: 'BlockUiWaitWalletSms', Decription: '‬‎Мы отправили вам SMS. Пожалуйста, завершите оплату в приложении XXX. Не закрывайте это окно! ' },
            { ErrorName: 'BlockUiWaitWallet', Decription: '‬‎Пожалуйста, завершите оплату в приложении XXX. Не закрывайте это окно! ' },
            { ErrorName: 'alt_Confirmation_box', Decription: 'пожалуйста подтвердите' },
            { ErrorName: 'bitConfirametion', Decription: 'Вы выбрали оплату через приложение Bit. Оплата будет произведена через аппликацию на смартфоне.' }
        ]
    }



    ,
    setLang: function (lang) {
        message.lang = lang;

        $("html").attr("lang", lang);

        for (var prop in this.defaults[lang]) {
            var errDefautObj = this.defaults[lang][prop];

            var errSetupObj = $.grep(generalParameters.CustomCanRetrayErrors, function (item) {
                return item.ErrorName == errDefautObj.ErrorName;
            });

            message[errDefautObj.ErrorName] = errSetupObj.length > 0 ? errSetupObj[0].Description : errDefautObj.Decription;
        }
    }
}