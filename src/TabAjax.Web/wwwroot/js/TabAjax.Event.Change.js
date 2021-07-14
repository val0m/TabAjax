// --- Fonction qui permet de changer l'url via l'attribut TabajaxChangeUrl ---
// - id/html -
// - href/url -
// === Updated : 11/06/2019 à 11:30 - PASSE Valentin ===
function TabajaxChangeUrl(selector) {
    var elemChangeUrl = undefined;
    if (isString(selector)) {
        if (isElement(selector)) {
            elemChangeUrl = $(selector);
        }
        else if (isElement(document.getElementById(selector))) {
            elemChangeUrl = $('#' + selector)
        }
    }
    else { elemChangeUrl = selector; }

    if (isElement(elemChangeUrl) && $(elemChangeUrl).hasAttrTabajaxChangeUrl()) {
        var url = undefined;

        if (($(elemChangeUrl).attr('tabajax-changeUrl') === "true" || $(elemChangeUrl).attr('tabajax-changeUrl') === "True")
            || ($(elemChangeUrl).attr('tabajaxChangeUrl') === "true" || $(elemChangeUrl).attr('tabajaxChangeUrl') === "True")) {
            url = $(elemChangeUrl).attrTabajaxUrl();
        }
        else {
            url = $(elemChangeUrl).attrTabajaxChangeUrl();
        }

        ChangeUrl(url);
    }
}

// --- Fonction qui permet de changer l'url via le parametre url ---
// - url -
// === Updated : 18/09/2019 à 13:30 - PASSE Valentin ===
function ChangeUrl(url) {
    if (!isNullOrEmpty(url)) {
        if (typeof (history.pushState) !== "undefined") {
            var obj = { Page: null, Url: url };
            history.pushState(null, obj.Page, obj.Url);
        } else {
            alert("Browser does not support HTML5.");
        }
    }
}

// --- Fonction qui permet de changer un parametre via l'attribut TabajaxChangeParameter ---
// - id/html -
// - href/url -
// === Updated : 12/02/2020 à 09:45 - PASSE Valentin ===
async function TabajaxChangeParameter(selector) {
    var elemChangeParameter = undefined;
    if (isString(selector)) {
        if (isElement(selector)) {
            elemChangeParameter = $(selector);
        }
        else if (isElement('#' + selector)) {
            elemChangeParameter = $('#' + selector)
        }
    }
    else { elemChangeParameter = selector; }

    if (isElement(elemChangeParameter) && $(elemChangeParameter).hasAttrTabajaxChangeParameter()) {

        var arrayChangeParameter = $(elemChangeParameter).attrTabajaxChangeParameter().split(',');

        for (var iChangeParameter = 0; iChangeParameter < arrayChangeParameter.length; iChangeParameter++) {

            //var elemParameter = $('#' + arrayChangeParameter[iChangeParameter]);
            // Récupère l'élèment du DOM
            var elemParameter = undefined;
            if (isElement(arrayChangeParameter[iChangeParameter])) {
                elemParameter = $(arrayChangeParameter[iChangeParameter]);
            }
            else if (isElement('#' + arrayChangeParameter[iChangeParameter])) {
                elemParameter = $('#' + arrayChangeParameter[iChangeParameter]);
            }

            if (isElement(elemParameter)) {
                var value = $(elemChangeParameter).val();
                if (isNullOrEmpty(value)) { value = $(elemChangeParameter).attr('value'); }

                if ($(elemParameter).hasAttr('datepicker') || $(elemParameter).hasAttr('dateTimepicker')) {
                    var date = new Date(ParseDate(value, '/'));
                    if (isDate(date)) {
                        $(elemParameter).attr('value', dateFormat(date, "dd/mm/yyyy HH:MM:ss"));
                    }
                    else { value = undefined; }
                }
                else if ($(elemParameter).is('[type="checkbox"]') || $(elemParameter).is('[type=radio]')) {
                    if (value === true || value === 'true' || value === 'True') { $(elemParameter).prop('checked', true); }
                    else { $(elemParameter).prop('checked', false); }

                }
                else {
                    $(elemParameter).attr('value', value);
                }
            }
        }
        //for (iChangeParameter = 0; iChangeParameter < arrayChangeParameter.length; iChangeParameter++) {
        //    $(elemParameter).change();
        //}

        for (var iChangeParameter = 0; iChangeParameter < arrayChangeParameter.length; iChangeParameter++) {
            var elemParameter = undefined;
            if (isElement(arrayChangeParameter[iChangeParameter])) {
                elemParameter = $(arrayChangeParameter[iChangeParameter]);
            }
            else if (isElement('#' + arrayChangeParameter[iChangeParameter])) {
                elemParameter = $('#' + arrayChangeParameter[iChangeParameter]);
            }
            await $(elemParameter).change();
        }
    }
}

$(document).ready(function () {

    // --- button - lorsque un click est détécté ---
    // - Input simple, Textarea simple
    $('body').on("click", "button[tabajaxChangeParameter]:not([disabled]):not([tabajaxBloc]):not([tabajax-bloc]):not([tabajaxSubmit]):not([tabajax-submit],a[tabajaxChangeParameter]:not([disabled]):not([tabajaxBloc]):not([tabajax-bloc]):not([tabajaxSubmit]):not([tabajax-submit]),li[tabajaxChangeParameter]:not([disabled]):not([tabajaxBloc]):not([tabajax-bloc]):not([tabajaxSubmit]):not([tabajax-submit])", function () {
        TabajaxChangeParameter(this);
    });
    // --- Sumbit Auto - lorsque un changement est détécté ---
    // - Input simple, Textarea simple
    $('body').on("focusout", "input[tabajaxChangeParameter]:not([switch]):not([type='checkbox']):not([disabled]):not([datepicker]):not([datetimepicker]),textarea[tabajaxChangeParameter]:not([disabled]):not([editor])", function () {
        //debugger;
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());
            TabajaxChangeParameter(this);
        }
    });
    // - Input DatePicker
    $('body').on("change", "input[tabajaxChangeParameter][datepicker]:not([switch]):not([disabled]),input[tabajaxChangeParameter][datetimepicker]:not([switch]):not([disabled]),input[tabajaxChangeParameter][type='date']:not([switch]):not([disabled]),input[tabajaxChangeParameter][type='datetime']:not([switch]):not([disabled])", function () {
        //debugger;
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());
            TabajaxChangeParameter(this);
        }
    });
    // - Textarea editor
    $('body').on("focusout", "textarea[tabajaxChangeParameter][editor]:not([disabled])", function () {
        //debugger;
        if (decodeURIComponent($(this).val()) !== decodeURIComponent($(this).attr('valueDefault'))) {
            $(this).attr('value', decodeURIComponent($(this).val()));
            $(this).attr('valueDefault', decodeURIComponent($(this).val()));
            TabajaxChangeParameter(this);
        }
    });
    // - Select simple
    $('body').on("change", "select[tabajaxChangeParameter]:not([disabled])", function () {
        //debugger;
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());
            TabajaxChangeParameter(this);
        }
    });
    // - Input checkbox simple
    $('body').on("change", "input[tabajaxChangeParameter][type='checkbox']:not([disabled])", function () {
        //debugger;
        var check = 'false';
        if ($(this).is(":checked")) { check = 'true'; }

        if (check !== $(this).attr('valueDefault')) {
            $(this).attr('value', check);
            $(this).attr('valueDefault', check);
            TabajaxChangeParameter(this);
        }
    });
    // - Input radio simple
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxChangeParameter][type='radio']:not([disabled])", function () {
        if ($(this).is(":checked")) { TabajaxChangeParameter(this); }
    });
});