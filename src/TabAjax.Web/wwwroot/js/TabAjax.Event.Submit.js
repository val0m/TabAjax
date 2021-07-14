// --- Fonction qui permet de générer le contenu via les filtres de TabajaxSubmit ---
// - id -
// - action -
// === Updated : 11/07/2019 à 14:30 - PASSE Valentin ===
function TabajaxSubmitAuto(selector) {
    var elemSubmitAuto = undefined;
    if (isString(selector)) {
        if (isElement(selector)) {
            elemSubmitAuto = $(selector);
        }
        else if (isElement(document.getElementById(selector))) {
            elemSubmitAuto = $('#' + selector)
        }
    }
    else { elemSubmitAuto = selector; }

    if (isElement(elemSubmitAuto)) {

        var id = $(elemSubmitAuto).attr('id');
        var url = $(elemSubmitAuto).attr('action');

        if (!isNullOrEmpty(id) && !isNullOrEmpty(url) && $('[tabajaxSubmit="' + id + '"]').length) {
            // Commence par '?' avec le "start = true"
            var start = true;

            // Récupere toutes les variables de l'URL
            var vars = getUrlVars(url);

            // Supprime les variables dans l'URL à partir de '?'
            url = getUrlWithoutVars(url);

            // Supprime toutes les variables dans l'url qui bénificie d'un input filter dans le DOM
            var varsSubmit = vars;
            vars.forEach(function (element) {
                if ($('[tabajaxSubmit*="' + $(elemSubmitAuto).attr('id') + '"][name="' + element.name + '"],[tabajax-submit*="' + $(elemSubmitAuto).attr('id') + '"][name="' + element.name + '"]').length) {
                    varsSubmit = varsSubmit.filter(function (el, index, arr) {
                        return el.name !== element.name;
                    });
                }
            });
            vars = varsSubmit;

            // Cherche tous les inputs, select et autres éléments de formulaires
            $('main').find('[tabajaxSubmit="' + id + '"][name]').each(function () {
                var name = $(this).attr('name');
                var value = $(this).val();
                if (isNullOrEmpty(value)) { value = $(this).attr('value'); }

                if ($(this).hasAttr('datepicker') || $(this).hasAttr('dateTimepicker')) {
                    var date = new Date(ParseDate($(this).val(), '/'));
                    if (isDate(date)) {
                        value = dateFormat(date, "mm/dd/yyyy HH:MM:ss");
                    }
                    else { value = undefined; }
                }
                else if ($(this).is('[type="checkbox"]')) {
                    // A Checker il existe valuecheck, si oui, remplacer le boolean par la valeur et supprimer si le check est null
                    if ($(this).hasAttr('valuecheck')) {
                        if ($(this).attr('valueCheck') !== 'true') {
                            value = undefined;
                        }
                    }
                    else {
                        if (value === 'on') { value = undefined; }
                        else if ($(this).is(":checked")) { value = 'true'; }
                        else { value = 'false'; }
                    }
                }
                else if ($(this).is('[type=radio]') && !$(this).is(':checked')) {
                    value = undefined;
                }

                if (vars.indexOf(name) !== -1) {
                    if (!isNullOrEmpty(value) && value !== vars[name]) {
                        if (!isNullOrEmpty(vars[name])) {
                            let obj = {
                                'name': name,
                                'value': value
                            }
                            vars.push(obj);
                        }
                        else { vars.find(x => x.name === name).value = value; }
                    }
                }
                else {
                    let obj = {
                        'name': name,
                        'value': value
                    }
                    vars.push(obj);
                }
            });

            // Ajoute à l'url tous les variables
            vars.forEach(function (element) {
                if (!isNullOrEmpty(element.value)) {
                    if (start === true) {
                        url = url + '?';
                        start = false;
                    }
                    else { url = url + '&'; }

                    if (isArray(element.value)) {

                        var arrayVarsStart = true;
                        var arrayVars = element.value;
                        for (var arr in arrayVars) {
                            if (!arrayVarsStart) { url = url + '&'; }
                            else { arrayVarsStart = false; }

                            if (!isNullOrEmpty(arrayVars[arr])) { url = url + element.name + '=' + arrayVars[arr]; }
                            else { url = url + element.name + '='; }
                        }
                    }
                    else { url = url + element.name + '=' + element.value; }
                }
            });

            $(elemSubmitAuto).attr('action', url);
        }

    }
}
// --- Fonction qui permet d'éxecuter TabajaxSubmit en fonction du formulaire ---
// - element ($(this)) -
// === Updated : 07/02/2020 à 10:10 - PASSE Valentin ===
function executeSubmit(element) {
    if (isElement(element)) {
        if ($(element).hasAttr('TabajaxSubmit')) { $('form[id="' + $(element).attr('TabajaxSubmit') + '"').submit(); }
        else { $(element).closest('form').submit(); }
    }
}

$(document).ready(function () {
    // --- Clique Submit en Ajax  ---
    // - form -
    // - [html] -
    // - [Reload] -
    // === Updated : 11/07/2019 à 14:45 - PASSE Valentin ===
    $('body').on('submit', '[tabajaxSubmit=true],[tabajaxSubmit=True],[tabajax-submit=true],[tabajax-submit=True]', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        // Récupère l'element de sortie (selector)
        var html = $(this).attrTabajaxHtml(false);
        if (isUndefined(html)) { html = ''; }

        // Récupère l'element de loading (selector)
        var loading = $(this).attrTabajaxLoading(false);
        if (isUndefined(loading)) { loading = html; }

        // TabAjaxLoaderBegin : Demarre le Loader
        TabAjaxLoaderBegin(loading);

        // Récupère le type de résultat
        var typeResult = $(this).attrTabajaxResult();

        // Cache tous les modal
        var modal = $(this).closest('.modal:visible');
        if ($(modal).length) { TabajaxModalClose('#' + $(modal).attr('id')) }
        else { TabajaxModalClose(); }

        // Définis les Reload s'il y en a
        var reload = $(this).attrTabajaxReload();

        //Si TabajaxFilter existe, cela signifie qu'il s'agit de faire un TabajaxFilter après l'appel ajax
        var filter = $(this).attrTabajaxFilter();
        var filterLoad = $(this).attrTabajaxFilterLoad();

        TabajaxChangeUrl(this);
        TabajaxChangeParameter(this);

        // Génère l'url de l'action
        TabajaxSubmitAuto(this);

        var dataSerialize = $(this).serializeArray();

        //if ($(this).validate()) {
        $.ajax({
            url: this.action,
            type: this.method,
            //dataType: 'JSON',  
            data: dataSerialize,
            success: function (result) {
                AjaxLoadSuccess(result, html, typeResult, reload, filter, filterLoad);
            },
            error: function (result) {
                AjaxLoadError(result, html, typeResult, reload, filter, filterLoad);
            }
        });

    });


    //// - Button submit 
    //// === Updated : 19/06/2019 à 15:00 - PASSE Valentin ===
    //$('body').on("click", "button[tabajaxFilter]:not([disabled]),a[tabajaxFilter]:not([disabled])", function () {
    //    if ($(this).attr('value') !== $(this).attr('valueDefault')) {
    //        $(this).attr('valueDefault', $(this).attr('value'));

    //        TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
    //    }
    //});

    // - Action submit 
    // === Updated : 25/11/2020 à 10:32 - PASSE Valentin ===
    $('body').on("click", "a[tabajaxSubmit]:not([disabled]),a[tabajax-submit]:not([disabled]),button[tabajaxSubmit]:not([disabled]),button[tabajax-submit]:not([disabled]),td[tabajaxSubmit]:not([disabled]),td[tabajax-submit]:not([disabled]),li[tabajaxSubmit]:not([disabled]),li[tabajax-submit]:not([disabled])", function () {
        var form = $(this).attrTabajaxSubmit();

        if (form === 'true' || form === 'True') {
            TabajaxChangeParameter(this);
            $(this).closest('form').submit();
        }
        else if (form !== 'false' && form !== 'False' && isElement(form)) {
            TabajaxChangeParameter(this);
            $(form).submit();
        }
    });

    // --- Sumbit Auto - lorsque un changement est détécté ---
    // - Input simple, Textarea simple
    $('body').on("focusout", "input[tabajaxUpdateAuto]:not([switch]):not([type='checkbox']):not([disabled]):not([datepicker]):not([datetimepicker]),textarea[tabajaxUpdateAuto]:not([disabled]):not([editor])", function () {
        //debugger;
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());
            executeSubmit($(this));
            //if ($(this).hasAttr('TabajaxSubmit')) { $('form[id="' + $(this).attr('TabajaxSubmit') + '"').submit(); }
            //else { $(this).closest('form').submit(); }
        }
    });
    // --- Déclenche TabajaxFilter lorsque un changement est détécté ---
    // - Input simple, Textarea simple
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxUpdateAuto]:not([switch]):not([type='checkbox']):not([disabled]):not([datepicker]):not([datetimepicker]),textarea[tabajaxUpdateAuto]:not([disabled]):not([editor])", function () {
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());
            executeSubmit($(this));
            //if ($(this).hasAttr('TabajaxSubmit')) { $('form[id="' + $(this).attr('TabajaxSubmit') + '"').submit(); }
            //else { $(this).closest('form').submit(); }
        }
    });
    // - Input DatePicker
    $('body').on("change", "input[tabajaxUpdateAuto][datepicker]:not([switch]):not([disabled]),input[tabajaxUpdateAuto][datetimepicker]:not([switch]):not([disabled]),input[type='date']:not([switch]):not([disabled]),input[type='datetime'][datetimepicker]:not([switch]):not([disabled])", function () {
        //debugger;
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());
            executeSubmit($(this));
            //if ($(this).hasAttr('TabajaxSubmit')) { $('form[id="' + $(this).attr('TabajaxSubmit') + '"').submit(); }
            //else { $(this).closest('form').submit(); }
        }
    });
    // - Textarea editor
    $('body').on("focusout", "textarea[tabajaxUpdateAuto][editor]:not([disabled])", function () {
        //debugger;
        if (decodeURIComponent($(this).val()) !== decodeURIComponent($(this).attr('valueDefault'))) {
            $(this).attr('value', decodeURIComponent($(this).val()));
            $(this).attr('valueDefault', decodeURIComponent($(this).val()));
            executeSubmit($(this));

            //if ($(this).hasAttr('TabajaxSubmit')) { $('form[id="' + $(this).attr('TabajaxSubmit') + '"').submit(); }
            //else { $(this).closest('form').submit(); }
        }
    });
    // - Select simple
    $('body').on("change", "select[tabajaxUpdateAuto]:not([disabled])", function () {
        //debugger;
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());
            executeSubmit($(this));
            //if ($(this).hasAttr('TabajaxSubmit')) { $('form[id="' + $(this).attr('TabajaxSubmit') + '"').submit(); }
            //else { $(this).closest('form').submit(); }
        }
    });
    // - Input checkbox simple
    // === Updated : 07/02/2020 à 10:00 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxUpdateAuto][type='checkbox']:not([disabled])", function () {
        //debugger;
        var check = 'false';
        if ($(this).is(":checked")) { check = 'true'; }

        if ((isBooleanVirtual($(this).attr('value')) || isUndefined($(this).attr('value')) || isNullOrEmpty($(this).attr('value'))) && check !== $(this).attr('valueDefault')) {
            $(this).attr('value', check);
            $(this).attr('valueDefault', check);

            executeSubmit($(this));
            //if ($(this).hasAttr('TabajaxSubmit')) { $('form[id="' + $(this).attr('TabajaxSubmit') + '"').submit(); }
            //else { $(this).closest('form').submit(); }
        }
        else if (!isUndefined($(this).attr('value')) && !isNullOrEmpty($(this).attr('value')) && check !== $(this).attr('valueDefault')) {
            $(this).attr('valuecheck', check); // valuecheck signifie qu'on choisi sa valeur si le :checked est true sinon ne renvoi rien
            executeSubmit($(this));
            //if ($(this).hasAttr('TabajaxSubmit')) { $('form[id="' + $(this).attr('TabajaxSubmit') + '"').submit(); }
            //else { $(this).closest('form').submit(); }
        }
    });
});