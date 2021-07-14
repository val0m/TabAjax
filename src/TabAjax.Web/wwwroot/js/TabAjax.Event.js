// --- Element qui contient le focus (result) ---
// === Updated : 11/06/2019 à 11:30 - PASSE Valentin ===
var ElementFocus = undefined;

// --- Enumération qui permet de définire la sortie du contenu (result) ---
// === Updated : 11/06/2019 à 11:30 - PASSE Valentin ===
const EnumResult = {
    HTML: "HTML", // Retourne le résultat à l'intérieur de l'élément en écrasant les données.
    REPLACE: "REPLACE", // Remplace le résultat de l'élement.
    APPEND: "APPEND", // Retourne le résultat après le dernier enfant qui se situe à l'interieur de l'élément.
    AFTER: "AFTER", // Retourne le résultat juste après l'élément.
    BEFORE: "BEFORE", // Retourne le résultat juste avant l'élément.
    PARENT: "PARENT" // Retourne le résultat au parent de l'élément.
};

// --- Fonction qui retourne le contenu (result) en fonction du type de result ---
// === Updated : 11/06/2019 à 11:30 - PASSE Valentin ===
function ReturnResult(selector, result, typeResult) {
    if (isElement(selector) || (isString(selector) && isElement(document.getElementById(selector)))) {
        if (!isElement(selector)) { selector = '#' + selector; }
        switch (typeResult) {
            case EnumResult.HTML:
                $(selector).html(result);
                break;
            case EnumResult.REPLACE:
                $(selector).replaceWith(result);
                selector = $(selector).parent();
                break;
            case EnumResult.APPEND:
                $(selector).append(result);
                break;
            case EnumResult.AFTER:
                $(selector).after(result);
                break;
            case EnumResult.BEFORE:
                $(selector).before(result);
                break;
            case EnumResult.PARENT:
                $(selector).parent().replaceWith(result);
                selector = $(selector).parent();
                break;
            default:
                $(selector).html(result);
        }
        // Recharge les bibliothèques et fonctions
        LibraryReload(selector);
        // Charge les TabajaxReady
        TabajaxReady(selector);
        return true;
    }
    else { return false; }
}

// --- Fonction qui lance l'appel ajax via un id de retour, l'url et le type ---
// - selector -
// - url -
// - type -
// - reload -
// - filter -
// - filterLoad -
// === Updated : 11/06/2019 à 11:30 - PASSE Valentin ===
function AjaxLoad(selector, url, typeResult, reload, filter, filterLoad) {
    var elemAjaxLoad = undefined;
    if (isString(selector)) {
        if (isElement(selector)) {
            elemAjaxLoad = $(selector);
        }
        else if (isElement(document.getElementById(selector))) {
            elemAjaxLoad = $('#' + selector);
        }
    }
    else { elemAjaxLoad = selector; }

    if (!isUndefined(elemAjaxLoad) && !isNullOrEmpty(url)) {
        TabAjaxLoaderBegin(elemAjaxLoad);

        $.ajax({
            url: url,
            success: function (result) {
                AjaxLoadSuccess(result, elemAjaxLoad, typeResult, reload, filter, filterLoad);
            },
            //success: function (result) {
            //    if (ReturnResult(elemAjaxLoad, result, typeResult)) {
            //        // Recharge les bibliothèques et fonctions
            //        LibraryReload(elemAjaxLoad);
            //        // Charge les TabajaxReady
            //        TabajaxReady(elemAjaxLoad);
            //        // Enleve le module de chargement
            //        Reset(elemAjaxLoad);
            //    }
            //},
            error: function (result) {
                console.log('Erreur du chargement de la vue "' + elemAjaxLoad + '" : ' + result)
                AjaxLoadError(result, elemAjaxLoad, typeResult, reload, filter, filterLoad);
            }
        });
    }
}

// --- Fonction qui est effectué après l'ajax success via un result, selector, reload, filter ---
// - result -
// - selector -
// - reload -
// - filter -
// - filterLoad -
// === Updated : 26/06/2019 à 10:40 - PASSE Valentin ===
function AjaxLoadSuccess(result, selector, typeResult, reload, filter, filterLoad) {
    var elemAjaxLoadSuccess = selector;

    // Si 'Reload' existe, charge toutes les reload
    if (!isNullOrEmpty(reload)) {
        TabajaxReload(reload);
    }

    resultHtml = null;
    message = null;

    if (!isUndefined(result)) {
        if (!isUndefined(result.result)) {
            resultHtml = result.result;
        }
        if (!isUndefined(result.message)) {
            message = result.message;
        }
        if (isNull(message) && isNull(resultHtml)) {
            resultHtml = result;
        }
    }

    if (result !== true && !isNull(resultHtml)
        && ReturnResult(elemAjaxLoadSuccess, resultHtml, typeResult)) {

        if (!isNullOrEmpty(filter)) { TabajaxFilter(filter, filterLoad); }

        Reset(elemAjaxLoadSuccess);
    }
    else { Reset(); }

    if (message !== null) { TabAjaxMessage(message); }
}
// --- Fonction qui est effectué après l'ajax Error via un result, selector, reload, filter ---
// - result -
// - selector -
// - reload -
// - filter -
// - filterLoad -
// === Updated : 26/06/2019 à 10:40 - PASSE Valentin ===
function AjaxLoadError(result, selector, typeResult, reload, filter, filterLoad) {
    var elemAjaxLoadError = selector;

    // Si 'Reload' existe, charge toutes les reload
    if (!isNullOrEmpty(reload)) {
        TabajaxReload(reload);
    }

    resultHtml = null;
    message = null;

    if (!isUndefined(result)) {
        if (!isUndefined(result.responseJSON)) {
            if (!isUndefined(result.responseJSON.result)) {
                resultHtml = result.responseJSON.result;
            }
            if (!isUndefined(result.responseJSON.message)) {
                message = result.responseJSON.message;
                TabAjaxMessage(message);
            }
        }
        if (!isUndefined(result.responseText) && isNull(message) && isNull(resultHtml)) {
            TabAjaxErrorMessage(result.responseText);
        }
    }

    if (result !== true && !isNull(resultHtml)
        && ReturnResult(elemAjaxLoadError, result, typeResult)) {

        if (!isNullOrEmpty(filter)) { TabajaxFilter(filter, filterLoad); }

        Reset(elemAjaxLoadError);
    }
    else { Reset(); }

    console.log('Erreur d\'action : ' + result.responseText);
}

$(document).ready(function () {
    TabajaxReady('main');

    // =-=-=-=-=-=-=-= CLIQUE MENU - BLOC - MODAL - SUBMIT - ACTION =-=-=-=-=-=-=-=

    // --- Sous-menu en Ajax (dynamique) ---
    // - href/url -
    // === Updated : 24/05/2019 à 10:30 - PASSE Valentin ===
    $('body').on('click', '#menu-left ul li a[tabajax-type="dynamique"]', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        TabAjaxLoaderBegin();

        //TabAjaxUpdateFilter('load', 'false');
        var url = $(this).attrTabajaxUrl();

        //var a = $(this);
        var li = $(this).parent();

        if (!isNullOrEmpty(url)) {
            $.ajax({
                url: url,
                success: function (result) {
                    $('#page').html(result);
                    window.history.pushState("", "", url);

                    ResetMenuLeft();
                    SelectMenuLeft(li.attr('value'));
                    TabAjaxTitle(li);

                    LibraryReload('main');
                    TabajaxReady('main');

                    Reset();
                }
            });
        }
        else {
            console.log('Erreur de chargement du sous-menu "' + li.attr('value') + '" - #menu-left : Le lien Url n\' est pas valide.')
            Reset(id);
        }
    });// end [#menu-left]

    // --- Filters Tri ---
    // - Sort -
    // - order -
    $('body').on('click', 'table thead th[order] a[name]', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        if ($('#Panel-table').length) { TabAjaxLoaderBegin('Panel-table'); }
        else { TabAjaxLoaderBegin(); }

        // Verifie s'il est ascendant ou descendant
        var sort = $(this).attr('name');
        var order = TabAjaxFilterByKey('order');

        if (sort === TabAjaxFilterByKey('sort')
            && order === 'Asc') {
            order = TabAjaxUpdateFilter('order', 'Desc');
        } else {
            TabAjaxUpdateFilter('sort', $(this).attr('name'));
            order = TabAjaxUpdateFilter('order', 'Asc');
        }

        TabAjaxLoadData();
    });

    // --- Filters Export --- =================== ATTENTION ! VALEUR A CHANGER DANS L EXPORT - Actuellement Operea ===================
    // - affichage -
    $('body').on('click', '[tabajax-type="export"] a,[tabajax-type="export"] button, button[tabajax-type="export"], a[tabajax-type="export"]', function (event) {
        if ($(this).attr('fichier') !== undefined) {
            var params = '';
            var folder = '';
            var format = '';
            if ($(this).attr('params') !== undefined) {
                params = $(this).attr('params');
            }
            if ($(this).attr('folder') !== undefined) {
                folder = '%2f' + $(this).attr('folder');
            }
            if ($(this).attr('format') !== undefined) {
                format = $(this).attr('format');
            }

            TabAjaxExportByFilters('Operea' + folder, $(this).attr('fichier'), format, params);
        }
    });


    // =-=-=-=-=-=-=-= AUTRES COMPOSANTS =-=-=-=-=-=-=-=


    // --- Add new row [tabajax-row-add] ---
    $('body').on('click', '[tabajax-row-add]', function () {
        var row = $(this);
        var url = $(this).attr('tabajax-row-add');
        $.ajax({
            url: url,
            success: function (result) {
                $(result).insertBefore(row);
            }
        });
    });
    // --- Remove bloc by attr [tabajax-bloc-remove] ---
    $('body').on('click', '[tabajax-bloc-remove]', function () {
        var id = $(this).attr('tabajax-bloc-remove');
        if ($('[id="' + id + '"]').length === 1) {
            $('#' + id).remove();
        }
        else if ($('[id="' + id + '"]').length > 1) {
            var object = $(this).parent();
            var i = 0;
            while ($(object).attr('id') !== id && i < 15) {
                object = $(object).parent();
                i++;
            }
            if ($(object).attr('id') === id) {
                $(object).remove();
            }
        }
    });

    //// --- Add focus element at the variable "ElementFocus" --- A AMELIORER
    //$('body').on('focus', 'input', function () {
    //    ElementFocus = this;
    //});

    // =-=-=-=-=-=-=-= REGLAGE =-=-=-=-=-=-=-=

    //// --- Reglages affichage --- 
    //// - affichage -
    //$('body').on('click', 'li [id^="tab-affichage-"]', function (event) {
    //    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    //    TabAjaxLoaderBegin();

    //    if ($(this).attr('tabajax-size').length && !checkAffichage($(this).attr('tabajax-size'))) {
    //        var size = TabAjaxUpdateFilter('size', $(this).attr('tabajax-size'));
    //        if (size !== undefined && parseInt(size) === 0) {
    //            TabAjaxUpdateFilter('id', null);
    //            TabAjaxLoadData();
    //        }
    //        else {
    //            TabAjaxLoad();
    //        }
    //    }

    //    if (typeof $(this).attr('tabajax-change') !== typeof undefined && $(this).attr('tabajax-change') !== false) {
    //        $(this).hide(0);
    //        $('#' + $(this).attr('tabajax-change')).show(0);
    //    }

    //    Reset();
    //});

    //// --- Reglages affichage --- 
    //// - affichage -
    //$('body').on('click', 'li [id^="tab-affichage-"]', function (event) {
    //    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    //    TabAjaxLoaderBegin();

    //    if ($(this).hasAttr('tabajax-size') && !checkAffichage($(this).attr('tabajax-size'))) {
    //        var size = $(this).attr('tabajax-size');
    //        if (size === undefined || size === '') {
    //            var size = TabAjaxFilterByKey('size');
    //        }
    //        else {
    //            var size = TabAjaxUpdateFilter('size', size);
    //        }

    //        if (size !== undefined && parseInt(size) === 0) {
    //            TabAjaxUpdateFilter('id', null);
    //            TabAjaxLoadData();
    //        }
    //        else {
    //            TabAjaxLoad();
    //        }
    //    }

    //    if (typeof $(this).attr('tabajax-change') !== typeof undefined && $(this).attr('tabajax-change') !== false) {
    //        $(this).hide(0);
    //        $('#' + $(this).attr('tabajax-change')).show(0);
    //    }

    //    Reset();
    //});

    //// --- Reglages Options --- 
    //// - change -
    //$('body').on('click', 'li [id^="tab-option-"]', function (event) {
    //    event.preventDefault ? event.preventDefault() : (event.returnValue = false);

    //    if (typeof $(this).attr('tabajax-change') !== typeof undefined && $(this).attr('tabajax-change') !== false) {
    //        $(this).hide(0);
    //        $('#' + $(this).attr('tabajax-change')).show(0);
    //    }
    //});

    //// --- Reglages Close --- 
    //// - affichage -
    //$('body').on('click', '[tabajax-close]', function (event) {
    //    if (typeof $(this).attr('tabajax-close') !== typeof undefined && $(this).attr('tabajax-close') !== false) {
    //        $('#' + $(this).attr('tabajax-close')).empty();
    //    }
    //});

    // --- Reglages bloc affiche --- 
    // - affiche -
    $('body').on('click', '[tabajax-affiche]', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        $('#' + $(this).attr('tabajax-affiche')).each(function () {
            if ($(this).is(":visible")) {
                $(this).hide(400);
                $(event.currentTarget).children('i').attr('class', 'fa fa-plus');
            }
            else {
                $(this).show(400);
                $(event.currentTarget).children('i').attr('class', 'fa fa-minus');
            }
        });
    });

    // --- Reglages Print --- 
    // - affiche -
    $('body').on('click', '#tab-print', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        if ($('#Panel-details').length) { TabAjaxLoaderBegin('Panel-details'); }
        else { TabAjaxLoaderBegin(); }


        $('#tab-content > [id^="tab"]').printThis({
            importStyle: true
        });

        Reset();
    });

    // --- Reglages Raccourcie --- 
    // - Enter
    $('body').on('keypress', 'input[tabajaxFilter]:not(:disabled):focus,input[tabajaxUpdateAuto]:not(:disabled):focus', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            $(this).focusout();
        }
    });
    // - Enter
    $('body').on('mouseup', '[href],[tabajax-url],[tabajaxUrl]', function (event) {
        if (event.which === 2) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            window.open($(this).attrTabajaxUrl(), '_blank');
        }
    });
    // - Touche + Alt -
    $(document).keydown(function (e) {

        if (!$('input').is(":focus") && !$('select').is(":focus") && !$('textarea').is(":focus") && !$('span.select2').is(":focus")) {
            var isModal;
            var n
            if ($("#Modal").children('.modal').length) { isModal = $("#Modal").children('.modal').data('bs.modal').isShown; }
            else { isModal = false; }
            switch (e.which) {
                case 39: // Reglage Tab Suivant : →
                    if ($('li[id^="tab-view-"]').length && !isModal) {
                        event.preventDefault()
                        n = $('li[id^="tab-view-"][class~="active"]').index() + 2;
                        if ($('li[id^="tab-view-"]:nth-child(' + n + ') a').length) {
                            $('li[id^="tab-view-"]:nth-child(' + n + ') a').click();
                        }
                        else {
                            $('li[id^="tab-view-"]:first-child a').click()
                        }
                    }
                    break;
                case 37: // Reglage Tab Précédent : ←
                    if ($('li[id^="tab-view-"]').length && !isModal) {
                        event.preventDefault()
                        n = $('li[id^="tab-view-"][class~="active"]').index();
                        if ($('li[id^="tab-view-"]:nth-child(' + n + ') a').length) {
                            $('li[id^="tab-view-"]:nth-child(' + n + ') a').click();
                        }
                        else {
                            $('li[id^="tab-view-"]:last-child a').click()
                        }
                    }
                    break;
                case 40: // Reglage Row Suivant : ↓
                    if ($('a[tabajax-row]').length && !isModal) {
                        event.preventDefault()
                        n = $('a[tabajax-row][class~="row-selected"]').index() + 2;
                        if ($('a[tabajax-row]:nth-child(' + n + ')').length) {
                            $('a[tabajax-row]:nth-child(' + n + ')').click();
                        }
                        else {
                            $('a[tabajax-row]:first-child').click()
                        }
                    }
                    break;
                case 38: // Reglage Row Précédent : ↑
                    if ($('a[tabajax-row]').length && !isModal) {
                        event.preventDefault()
                        n = $('a[tabajax-row][class~="row-selected"]').index();
                        if ($('a[tabajax-row]:nth-child(' + n + ')').length) {
                            $('a[tabajax-row]:nth-child(' + n + ')').click();
                        }
                        else {
                            $('a[tabajax-row]:last-child').click()
                        }
                    }
                    break;
                case 106: // Reglage Visible : *
                    if ($('[id^="tab-reglage-"]').length) {
                        event.preventDefault()
                        $('[id^="tab-reglage-"]:visible').click();
                    }
                    break;
                case 188: // Reglage Help : ?
                    if (e.which && $('#tab-help').length) {
                        event.preventDefault()
                        $('#tab-help').click();
                    }
                    break;
                case 107: // Reglage Agrandir : +
                    if ($('#tab-affichage-agrandir').length) {
                        event.preventDefault()
                        $('#tab-affichage-agrandir').click();
                    }
                    break;
                case 109: // Reglage Réduire : -
                    if ($('#tab-affichage-reduire').length) {
                        event.preventDefault()
                        $('#tab-affichage-reduire').click();
                    }
                    break;
                case 111: // Reglage Affiche : /
                    if ($('[tabajax-affiche]').length) {
                        event.preventDefault()
                        $('[tabajax-affiche]:visible').click();
                    }
                    break;
                case 35: // Reglage Close : Fin
                    if ($('#tab-affichage-fermer').length) {
                        event.preventDefault()
                        $('#tab-affichage-fermer').click();
                    }
                    break;
            }
        }

        if (event.altKey && !$('input').is(":focus") && !$('select').is(":focus")) {
            event.preventDefault()
            switch (e.which) {
                case 80: // Reglage Print : Alt + P
                    if ($('#tab-print').length) {
                        $('#tab-print').click();
                    }
                    break;
                case 83: // Reglage Print : Alt + S
                    if ($('#submit').length) {
                        $('#submit').click();
                    }
                    break;
            }
        }
    });
});