$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};
// for case insensitive name attribute contains selector
$.expr[':'].filter = function (node, stackIndex, properties) {
    if (node.attributes.filter !== null && node.attributes.filter !== undefined) {
        var value = node.attributes['filter'].value;
        value = value.toLowerCase();
        return value.toLowerCase() === properties[3];
    }
    else return false;
};
(function ($) {
    $.fn.getAttributes = function () {
        var attributes = {};

        if (this.length) {
            $.each(this[0].attributes, function (index, attr) {
                attributes[attr.name] = attr.value;
            });
        }

        return attributes;
    };
})(jQuery);
function resizeIframe(obj, minHeight) {
    var iframe = obj.contentDocument;
    var height = iframe.body.offsetHeight;
    if (isNumber(minHeight) && minHeight > height) { height = minHeight; }
    obj.style.height = height + "px";
}

// =====================================================================
// ========================= FONCTIONS FILTERS =========================
// =====================================================================


// --- Retourne la valeur du filtre qui est en parametre ---
function TabAjaxFilterByKey(key) {
    return $('input[name^="filter"][filter="' + key + '"]').val();
}
// --- Change la valeur du filtre avec la nouvelle valeur inscrite en parametre ---
// Retourne la valeur finale (ou vide si jamais il y a la valeur qui est incorrecte)
function TabAjaxUpdateFilter(key, value) {
    if (key === undefined || key === '' || key === 'function ' + key + '()') {
        key = '';
    }
    if (value === undefined || value === '' || value === 'function ' + value + '()') {
        value = '';
    }
    $('input[name^="filter"]:filter("' + key.toLowerCase() + '")').val(value);

    return value;
}
(function ($) {
    $.fn.TabAjaxUpdateFilter = function () {
        var data = $(this).getAttributes();
        for (var filter in data) {
            if (filter.startsWith('tabajax-data-')) {
                TabAjaxUpdateFilter(filter.substr(13), data[filter]);
            }
        }
    };
})(jQuery);

// =====================================================================
// =========================== FONCTIONS URL ===========================
// =====================================================================

//// --- Change l'url de la page ---
//// Avertissement au retour en arrière (le prend en compte dans le navigateur)
//function ChangeUrl(page, url) {
//    if (typeof (history.pushState) !== "undefined") {
//        var obj = { Page: page, Url: url };
//        history.pushState(null, obj.Page, obj.Url);
//    } else {
//        alert("Browser does not support HTML5.");
//    }
//}
// --- Change l'url avec l'ID et l'onglet selectionné ---
function TabAjaxUrl() {
    var urlHistory = window.location.href.split('?')[0];
    // Check si l'url ne possède pas d'ID
    // else si l'url possède un ID autre que le sien
    if (urlHistory.split('/')[urlHistory.split('/').length - 1] !== TabAjaxFilterByKey('id')) {
        var numeric = $.isNumeric(urlHistory.split('/')[urlHistory.split('/').length - 1]);
        if (!numeric) {
            if (TabAjaxFilterByKey('tab') !== '' || TabAjaxFilterByKey('tab') !== undefined) {
                window.history.pushState("", "", urlHistory + '?id=' + TabAjaxFilterByKey('id') + '&tab=' + TabAjaxFilterByKey('tab'));
            }
            else {
                window.history.pushState("", "", urlHistory + '?id=' + TabAjaxFilterByKey('id'));
            }
        }
        else {
            if (TabAjaxFilterByKey('tab') !== '' || TabAjaxFilterByKey('tab') !== undefined) {
                window.history.pushState("", "", urlHistory.replace('/' + urlHistory.split('/')[urlHistory.split('/').length - 1], '?id=' + TabAjaxFilterByKey('id') + '&tab=' + TabAjaxFilterByKey('tab')));
            }
            else {
                window.history.pushState("", "", urlHistory.replace('/' + urlHistory.split('/')[urlHistory.split('/').length - 1], '?id=' + TabAjaxFilterByKey('id')));
            }
        }
    }
}
// --- Récupère l'url sans ces paramètres ---
// Exemple : getUrlWithoutVars(url)
function getUrlWithoutVars(url) {
    if (!isNullOrEmpty(url) && url.indexOf("?") !== -1) {
        url = url.substring(0, url.indexOf('?'));
    }
    return url;
}
// --- Récupère la variable dans l'url qui correspond à son nom ---
// Exemple : getUrlVars(url, variable)
function getUrlVars(url, name) {
    var vars = [];
    var hashes;
    if (isNullOrEmpty(url)) {
        hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    } else if (url.indexOf("?") !== -1) {
        hashes = url.slice(url.indexOf('?') + 1).split('&');
    }
    else return vars;

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        var obj = {
            'name': hash[0],
            'value': hash[1]
        };
        vars.push(obj);
    }

    if (!isNullOrEmpty(name)) { return vars.find(x => x.name === name).value; }
    else { return vars; }
}

// --- Renvoie une Url avec tous les champs masquer de la page qui ont "filter" comme paramètre ---
// Avertissement : Pour une amélioration, faire améliorer l'url pour qu'elle prenne en compte "?..."
// Champ name="filter" : Donnée simple
// Champ name="filter[]" : Données composées
function TabAjaxUrlByFilters(url, isExport) {
    var exp = (isExport) ? '[export="True"]' : '';
    var filters = new Array();
    $('input[name="filter"]' + exp).each(function (index, el) {
        filters[$(el).attr('filter')] = $(el).val();
    });
    for (var filter1 in filters) {
        if (filters[filter1] !== undefined && filters[filter1] !== '') {
            url = url + '&' + filter1 + '=' + filters[filter1];
        }
        else if (isExport && $('input[name="filter"][filter="' + filter1 + '"]').attr('isnull') === 'True') {
            url = url + '&' + filter1 + ':isnull=true';
        }
    }

    var filtersArray = new Array();
    $('input[name="filter[]"]' + exp).each(function (index, el) {
        filtersArray[$(el).attr('filter')] = $(el).val();
    });
    for (var filter2 in filtersArray) {
        if (filtersArray[filter2] !== undefined && filtersArray[filter2] !== '') {
            var arrayList = filtersArray[filter2].split(',');
            for (var arr in arrayList) {
                if (arrayList[arr] !== '' && arrayList[arr] !== undefined) {
                    url = url + '&' + filter2 + '=' + arrayList[arr];
                }
            }
        }
        else if (isExport && $('input[name="filter[]"][filter="' + filter2 + '"]').attr('isnull') === 'True') {
            url = url + '&' + filter2 + ':isnull=true';
        }
    }

    return url;
}

// =====================================================================
// ========================= FONCTIONS AUTRES ==========================
// =====================================================================

// --- Ajoute une class au body de la view pour un style de chargement en cours visible par l'utilisateur ---
function TabAjaxLoaderBegin(selector) {
    if (!isNullOrEmpty(selector) && isElement($(selector)) && !$(selector).hasClass("ajax-preloader")) {
        $(selector).addClass("ajax-preloader");
        $('#loading').css('display', 'inline-block');
    }
    else if (!$('#page').hasClass("ajax-preloader")) {
        $('#page').addClass("ajax-preloader");
        $('#loading').css('display', 'inline-block');
    }
}
// --- Supprime une class au body de la view pour un style de chargement en cours visible par l'utilisateur ---
function TabAjaxLoaderEnd(selector) {
    if (!isNullOrEmpty(selector) && isElement($(selector)) && $(selector).hasClass("ajax-preloader")) {
        $(selector).removeClass("ajax-preloader");

        if ($('.ajax-preloader').length == 0) {
            $('#loading').hide();
        }
    }
    else {
        $('.ajax-preloader').each(function () {
            $(this).removeClass("ajax-preloader");
        });

        $('#loading').hide();
    }
}
// --- Réinitialise toutes les commandes visible par l'utilisateur ---
function Reset(selector) {
    if (!isNullOrEmpty(selector) && isElement($(selector))) {
        TabAjaxLoaderEnd(selector)
        $(selector).find('a').blur();
        $(selector).find('button').blur();
        $(selector).find('select').blur();
        $(selector).find('[data-toggle="tooltip"]').tooltip();
        $(selector).find('.tooltip').hide();
        $(selector).find('[data-toggle="popover"]').popover();
        $(selector).find('.popover').hide();
    }
    else {
        TabAjaxLoaderEnd();
        $('a').blur();
        $('button').blur();
        $('select').blur();
        $('[data-toggle="tooltip"]').tooltip();
        $('.tooltip').hide();
        $('[data-toggle="popover"]').popover();
        $('.popover').hide();
    }
}