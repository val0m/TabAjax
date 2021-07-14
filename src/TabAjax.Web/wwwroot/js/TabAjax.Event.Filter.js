// --- Fonction qui permet de générer le contenu via les filtres de TabajaxFilters ---
// - html -
// - href/url -
// - replace -
// === Updated : 14/02/2020 à 11:45 - PASSE Valentin ===
function TabajaxFilter(selector, load) {
    // Check if Array exist
    if (!isNullOrEmpty(selector)) {
        var arrayFilter = selector.split(',');

        // Effectue un chargement du Filter si "load" = true
        var isLoad = false;
        if (isNullOrEmpty(load) || (load !== false && load !== 'false' && load !== 'False')) { isLoad = true; }

        for (iFilter = 0; iFilter < arrayFilter.length; iFilter++) {

            // Récupère l'élèment du DOM
            var elemFilter = undefined;
            if (isElement(arrayFilter[iFilter])) {
                elemFilter = $(arrayFilter[iFilter]);
            }
            else if (isElement('#' + arrayFilter[iFilter])) {
                elemFilter = $('#' + arrayFilter[iFilter]);
            }

            if (!isUndefined(elemFilter)) {

                $(elemFilter).each(function () {

                    var filter = $(this);

                    // Verifie si l'element bloque le "load"
                    var elemLoad = isLoad;
                    if (elemLoad === true && ($(filter).attr('tabajaxFilterLoad') === 'false' || $(filter).attr('tabajaxFilterLoad') === 'False')) elemLoad = false;

                    // Récupère l'element de sortie (selector)
                    var html = $(filter).attrTabajaxHtml();

                    // Récupère le lien Url
                    var url = $(filter).attrTabajaxUrl();

                    // Récupère le type de résultat
                    var typeResult = $(filter).attrTabajaxResult();

                    if (!isNullOrEmpty(html) && !isNullOrEmpty(url)) {
                        // Commence par '?' avec le "start = true"
                        var start = true;

                        // Récupere toutes les variables de l'URL
                        var vars = getUrlVars(url);

                        // Supprime les variables dans l'URL à partir de '?'
                        url = getUrlWithoutVars(url);

                        // Supprime toutes les variables dans l'url qui bénificie d'un input filter dans le DOM
                        var varsFilter = vars;
                        vars.forEach(function (element) {
                            if ($('[tabajaxFilter*="' + arrayFilter[iFilter] + '"][name="' + element.name + '"],[tabajax-filter*="' + arrayFilter[iFilter] + '"][name="' + element.name + '"]').length) {
                                varsFilter = varsFilter.filter(function (el, index, arr) {
                                    return el.name !== element.name;
                                });
                            }
                        });
                        vars = varsFilter;

                        // Cherche tous les inputs, select et autres éléments de formulaires
                        $('main').find('[tabajaxFilter*="' + arrayFilter[iFilter] + '"][name]').each(function () {

                            var name = $(this).attr('name');
                            var value = $(this).val();
                            if (isNullOrEmpty(value)) { value = $(this).attr('value'); }

                            if ($(this).hasAttr('datepicker') || $(this).hasAttr('dateTimepicker')) {
                                var date = new Date(ParseDate($(this).val(), '/'));
                                if (isDate(date)) {
                                    value = dateFormat(date, "dd/mm/yyyy HH:MM:ss");
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

                        if (!isNullOrEmpty($(filter).attr('href'))) { $(filter).attr('href', url); }
                        else if (!isNullOrEmpty($(filter).attr('tabajaxUrl'))) { $(filter).attr('tabajaxUrl', url); }
                        else if (!isNullOrEmpty($(filter).attr('tabajax-url'))) { $(filter).attr('tabajax-url', url); }
                        else if (!isNullOrEmpty($(filter).attr('action'))) { $(filter).attr('action', url); }

                        if (elemLoad === true) {
                            AjaxLoad(html, url, typeResult);
                        }
                    }
                });

            }
        }
    }
}


$(document).ready(function () {
    var typingTimer;

    // --- Déclenche TabajaxFilter lorsque un changement est détécté ---
    // - Input simple, Textarea simple
    // === Updated : 07/02/2020 à 13:50 - PASSE Valentin ===
    $('body').on("keyup", "input[tabajaxFilter]:not([switch]):not([disabled]):not([datepicker]):not([datetimepicker]):not([type='checkbox']),textarea[tabajaxFilter]:not([disabled]):not([editor])", function () {
        var elem = $(this);
        var times = 200;
        if (elem.hasAttrTabajaxFilterTimes() && !isNullOrEmpty(elem.attrTabajaxFilterTimes())) { times = elem.attrTabajaxFilterTimes(); }
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            if ($(elem).val() !== $(elem).attr('valueDefault')) {
                $(elem).attr('value', $(elem).val());
                $(elem).attr('valueDefault', $(elem).val());

                TabajaxFilter($(elem).attrTabajaxFilter(), $(elem).attrTabajaxFilterLoad());
            }
        }, times);
    });
    $('body').on("keydown", "input[tabajaxFilter]:not([switch]):not([disabled]):not([datepicker]):not([datetimepicker]):not([type='checkbox']),textarea[tabajaxFilter]:not([disabled]):not([editor])", function () {
        clearTimeout(typingTimer);
    });
    // --- Déclenche TabajaxFilter lorsque un changement est détécté ---
    // - Input simple, Textarea simple
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxFilter]:not([switch]):not([disabled]):not([datepicker]):not([datetimepicker]):not([type='checkbox']),textarea[tabajaxFilter]:not([disabled]):not([editor])", function () {
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());

            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
    });
    // - Input Hidden
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxFilter]:not([disabled]):hidden", function () {
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());

            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
    });
    // - Input DatePicker
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxFilter][datepicker]:not([disabled]),input[tabajaxFilter][timepicker]:not([disabled]),input[tabajaxFilter][datetimepicker]:not([disabled]),input[tabajaxFilter][type='date']:not([disabled]),input[tabajaxFilter][type='datetime']:not([disabled])", function () {
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('valueDefault', $(this).val());

            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
    });
    // - Button
    // === Updated : 29/01/2021 à 16:30 - PASSE Valentin ===
    $('body').on("click", "button[tabajaxFilter]:not([disabled]),a[tabajaxFilter]:not([disabled]),li[tabajaxFilter]:not([disabled])", function () {
        if ($(this).attr('value') !== $(this).attr('valueDefault')) {
            $(this).attr('valueDefault', $(this).attr('value'));

            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
    });
    // - Textarea editor
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("focusout", "textarea[tabajaxFilter][editor]:not([disabled])", function () {
        if (decodeURIComponent($(this).val()) !== decodeURIComponent($(this).attr('valueDefault'))) {
            $(this).attr('valueDefault', decodeURIComponent($(this).val()));

            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
    });
    // - Select simple
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("change", "select[tabajaxFilter]:not([disabled])", function () {
        if ($(this).val() !== $(this).attr('valueDefault')) {
            $(this).attr('value', $(this).val());
            $(this).attr('valueDefault', $(this).val());

            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
    });
    // - Input checkbox simple
    // === Updated : 07/02/2020 à 10:00 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxFilter][type='checkbox']:not([disabled])", function () {
        var check = 'false';
        if ($(this).is(":checked")) { check = 'true'; }

        if ((isBooleanVirtual($(this).attr('value')) || isUndefined($(this).attr('value')) || isNullOrEmpty($(this).attr('value'))) && check !== $(this).attr('valueDefault')) {
            $(this).attr('value', check);
            $(this).attr('valueDefault', check);

            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
        else if (!isUndefined($(this).attr('value')) && !isNullOrEmpty($(this).attr('value')) && check !== $(this).attr('valueDefault')) {
            $(this).attr('valuecheck', check); // valuecheck signifie qu'on choisi sa valeur si le :checked est true sinon ne renvoi rien
            TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad());
        }
    });
    // - Input radio simple
    // === Updated : 11/06/2019 à 13:20 - PASSE Valentin ===
    $('body').on("change", "input[tabajaxFilter][type='radio']:not([disabled])", function () {
        if ($(this).is(":checked")) { TabajaxFilter($(this).attrTabajaxFilter(), $(this).attrTabajaxFilterLoad()); }
    });
    // PagedList
    // === Updated : 21/06/2019 à 12:20 - PASSE Valentin ===
    $('body').on('click', '.pagination-container[tabajaxFilter] .pagination a', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        var page = getUrlVars($(this).attr('href'), 'page');

        if (!isNullOrEmpty(page)) {
            var div = $(this).closest('.pagination-container');
            $(div).attr('name', 'page');
            $(div).attr('value', page);

            TabajaxFilter($(div).attrTabajaxFilter(), $(div).attrTabajaxFilterLoad());
        }
    });
});