
// ======================================================================================================================================================== //
// tabajax-display //
// ======================================================================================================================================================== //

// --- Reglages bloc display : affiche certains éléments --- 
// - affiche -
$('body').on('click', '[tabajax-display]', function (event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);

    if ($('[tabajax-ondisplay="' + $(this).attr('tabajax-display') + '"').first().is(":visible")) {
        if ($(this).children('i').length && $(this).hasAttr('tabajax-display-off')) {
            $(this).children('i').first().attr('class', $(this).attr('tabajax-display-off'));
        }
        $('[tabajax-ondisplay="' + $(this).attr('tabajax-display') + '"').each(function () {
            $(this).hide(400);
            if ($(this).hasAttr('tabajax-display-url')) {
                $(this).empty();
            }
        });
    }
    else {
        if ($(this).children('i').length && $(this).hasAttr('tabajax-display-on')) {
            $(this).children('i').first().attr('class', $(this).attr('tabajax-display-on'));
        }
        $('[tabajax-ondisplay="' + $(this).attr('tabajax-display') + '"').each(function () {
            if ($(this).hasAttr('tabajax-display-url')) {
                displayView($(this));
            }
            else {
                $(this).show(400);
            }
        });
    }
});
$('body').on('click', '[tabajax-display-all-on]', function (event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);

    if ($(this).children('i').length && $(this).hasAttr('tabajax-display-on')) {
        $(this).children('i').first().attr('class', $(this).attr('tabajax-display-on'));
    }
    $('[tabajax-ondisplay*="' + $(this).attr('tabajax-display-all-on') + '"').each(function () {
        if ($(this).hasAttr('tabajax-display-url')) {
            displayView($(this));
        }
        else {
            $(this).show(400);
        }
    });
});
$('body').on('click', '[tabajax-display-all-off]', function (event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);

    if ($(this).children('i').length && $(this).hasAttr('tabajax-display-off')) {
        $(this).children('i').first().attr('class', $(this).attr('tabajax-display-off'));
    }
    $('[tabajax-ondisplay*="' + $(this).attr('tabajax-display-all-off') + '"').each(function () {
        $(this).hide(400);
        if ($(this).hasAttr('tabajax-display-url')) {
            $(this).empty();
        }
    });
});

// ======================================================================================================================================================== //
// tabajax-display-source //
// ======================================================================================================================================================== //

// Génère les display source en fonction des choix déjà selectionné
$('body').on('change', 'select:not([disabled]),input[type="checkbox"]:not([disabled]),input[type="radio"]:checked:not([disabled])', function (event) {
    var id = $(this).attr('id');
    if (id !== undefined && id !== "" && !$(this).hasAttr('tabajax-display-onloading')) {
        $('[tabajax-display-source]').filter(
            function (index) {
                return $(this).attr('tabajax-display-source').split(',').includes(id);
            }).each(function () { // Boucle sur tous les items possedant le 'display-source'
                displaySource(this);
            });
    }
});

$('body').on('focusout', 'input[type="text"]:not([switch]):not([disabled]),textarea[type="text"]:not([disabled])', function (event, state) {
    var id = $(this).attr('id');
    if (id !== undefined && id !== "" && !$(this).hasAttr('tabajax-display-onloading')) {
        $('[tabajax-display-source]').filter(
            function (index) {
                return $(this).attr('tabajax-display-source').split(',').includes(id);
            }).each(function () { // Boucle sur tous les items possedant le 'display-source'
                displaySource(this);
            });
    }
});
$('body').on('keyup', 'input[type="text"]:not([switch]):not([disabled]),textarea[type="text"]:not([disabled])', function (event, state) {
    var id = $(this).attr('id');
    if (id !== undefined && id !== "" && !$(this).hasAttr('tabajax-display-onloading')) {
        $('[tabajax-display-source]').filter(
            function (index) {
                return $(this).attr('tabajax-display-source').split(',').includes(id);
            }).each(function () { // Boucle sur tous les items possedant le 'display-source'
                displaySource(this);
            });
    }
});
// Génère les display source en fonction des choix déjà selectionné
$('body').on('change', 'select[tabajax-display-view][tabajax-display-url]', function (event) {
    var id = $(this).attr('id');
    var value = $('#' + id + ' option:selected').val();

    if ($(this).hasAttr('tabajax-display-view') && $(this).attr('tabajax-display-view') !== '' && $(this).attr('tabajax-display-view') !== null && $(this).attr('tabajax-display-view') !== undefined && !$(this).hasAttr('tabajax-display-onloading')) {
        if ($(this).hasAttr('tabajax-display-url') && $(this).hasAttr('tabajax-display-parameter')) {
            if ($(this).attr('tabajax-display-url').indexOf('?') >= 0) {
                $(this).attr('tabajax-display-url', $(this).attr('tabajax-display-url') + '&' + $(this).attr('tabajax-display-parameter') + '=' + value);
            }
            else {
                $(this).attr('tabajax-display-url', $(this).attr('tabajax-display-url') + '?' + $(this).attr('tabajax-display-parameter') + '=' + value);
            }
        }
        displayView(this);
    }
});
// Génère les display view en fonction des choix déjà selectionné
$('body').on('click', 'a[tabajax-display-view],button[tabajax-display-view],li[tabajax-display-view]', function (event) {
    if ($(this).hasAttr('tabajax-display-view') && $(this).attr('tabajax-display-view') !== '' && $(this).attr('tabajax-display-view') !== null && $(this).attr('tabajax-display-view') !== undefined && !$(this).hasAttr('tabajax-display-onloading')) {
        displayView(this);
    }
});

function TabajaxDisplayLoad() {
    $('[tabajax-display-source]').each(function () {
        var item = $(this);
        if ($(item).hasAttr('tabajax-display-onloading')) { return false; }

        var arraySource = $(item).attr('tabajax-display-source').split(','); // Array de toutes les sources de l'item

        for (var sourceId in arraySource) {
            var source = $('#' + arraySource[sourceId]);

            if (isElement(source)) {
                displaySource(item);
            }
        }
    });
}

function displaySource(item) {
    if ($(item).length && $(item).hasAttr('tabajax-display-source')) {
        var isDisplay = true;
        var arraySource = $(item).attr('tabajax-display-source').split(','); // Array de toutes les sources de l'item
        for (var sourceId in arraySource) {
            var isDisplaySource = false;

            var id = arraySource[sourceId];
            var source = $('#' + id);

            // Get les valeurs de la source
            var value = undefined;
            var text = undefined;
            if ($(source).is('select')) {
                value = $('#' + id + ' option:selected').val();
                text = $('#' + id + ' option:selected').text();
            }
            else if ($(source).is('[type="checkbox"]')) {
                value = $(source).is(":checked").toString();
                text = value;
            }
            else if ($(source).is('[type="text"]')
                || $(source).is('[type="radio"]:checked')) {
                value = $(source).val();
                text = value;
            }

            arraySource[sourceId][1] = value;
            arraySource[sourceId][2] = text;

            if ($(item).hasAttr('tabajax-display-' + id + '-text') || $(item).hasAttr('tabajax-display-' + id + '-value')) { // Check si l'attribut text ou value existe

                if ($(item).hasAttr('tabajax-display-' + id + '-text')) {

                    var arrayListText = $(item).attr('tabajax-display-' + id + '-text').split(',');
                    for (var arr in arrayListText) { // définis si l'item selectionné correspond à l'item recherché 
                        if (arrayListText[arr].toLowerCase() === text.toLowerCase()
                            || (arrayListText[arr].substring(1) === "%" && arrayListText[arr].substring(arrayListText[arr].length - 1) === "%" && arrayListText[arr].toLowerCase().indexOf(text.toLowerCase()) !== -1)
                            || (arrayListText[arr].substring(1) === "%" && arrayListText[arr].toLowerCase().endsWith(text))
                            || (arrayListText[arr].substring(arrayListText[arr].length - 1) === "%" && arrayListText[arr].toLowerCase().startsWith(text))) { isDisplaySource = true; }
                    }

                }
                if ($(item).hasAttr('tabajax-display-' + id + '-value')) {

                    var arrayListValue = $(item).attr('tabajax-display-' + id + '-value').split(',');
                    for (var arr in arrayListValue) { // définis si l'item selectionné correspond à l'item recherché 
                        if (arrayListValue[arr].toLowerCase() === value.toLowerCase()
                            || (arrayListValue[arr].substring(1) === "%" && arrayListValue[arr].substring(arrayListValue[arr].length - 1) === "%" && arrayListValue[arr].toLowerCase().indexOf(value.toLowerCase()) !== -1)
                            || (arrayListValue[arr].substring(1) === "%" && arrayListValue[arr].toLowerCase().endsWith(value.toLowerCase()))
                            || (arrayListValue[arr].substring(arrayListValue[arr].length - 1) === "%" && arrayListValue[arr].toLowerCase().startsWith(value.toLowerCase()))) { isDisplaySource = true; }
                    }

                }
            }
            else { isDisplaySource = false; }

            if (isDisplay) { isDisplay = isDisplaySource; } // Check si l'element a déjà eu une source en False, sinon remplace la source actuelle à l'element général
        } // fin de boucle Source

        if ($(item).hasAttr('tabajax-display-url') && !$(item).hasAttr('tabajax-display-onloading')) {
            if (!$(item).hasAttr('tabajax-display-view') || $(item).hasAttr('tabajax-display-view') === '') {
                $(item).attr('tabajax-display-view', $(item).attr('id'));
            }
            var url = $(item).attr('tabajax-display-url');
            if (url.indexOf("?") === -1) { url = url + '?' }
            else { url = url + '&' }

            for (var sourceId in arraySource) {
                if (sourceId !== 0) url = url + '&';
                url = url + arraySource[sourceId] + '=' + arraySource[sourceId][1];
            }

            return displayView(item);
        }
        else if (isDisplay) {
            $(item).show(); // Affiche l'item
            if ($(item).is('input,textarea,select')) { $(item).prop('disabled', false); }
            else { $(item).find('input,textarea,select').prop('disabled', false); }
        }
        else { // Cache l'item et réinitialise les valeurs à NULL
            $(item).hide();
            if ($(item).is('input,textarea,select')) {
                if (!$(item).is('select')) {
                    $(item).val('');
                }
                $(item).prop('disabled', true);
            }
            else {
                $(item).find('input,textarea,select').each(function () {
                    if (!$(this).is('select')) {
                        $(this).val('');
                    }
                    $(this).prop('disabled', true);
                });
            }

        }


    }
}

function displayView(item) {
    if ($(item).hasAttr('tabajax-display-url') && !$(item).hasAttr('tabajax-display-onloading')) {
        var view = $(item).attr('tabajax-display-view');
        if ((view === null || view === '' || view === undefined || !$('#' + view).length) && $(item).hasAttr('id')) {
            view = $(item).attr('id');
        }
        else { return false; }
        $(item).attr('tabajax-display-onloading', true);
        var replace = $(item).attr('tabajax-display-replace');
        if (replace !== undefined && (replace === 'true' || replace === 'True' || replace === true)) {
            TabAjaxLoaderBegin($('#' + view).parent().attr('id'));
        }
        else {
            TabAjaxLoaderBegin(view);
        }
        $.ajax({
            url: $(item).attr('tabajax-display-url'),
            success: function (result) {
                if (replace !== undefined && (replace === 'true' || replace === 'True' || replace === true)) {
                    $('#' + view).replaceWith(result);
                    $(item).removeAttr('tabajax-display-onloading');
                }
                else {
                    $('#' + view).html(result);
                    $(item).removeAttr('tabajax-display-onloading');
                }

                if ($('#' + view).is(":hidden")) {
                    $('#' + view).show(400);
                }

                if (!$('[tabajax-display-onloading]').length) {
                    Reset();
                }
            },
            error: function (result, statut, erreur) {
                $(item).removeAttr('tabajax-display-onloading');

                if (!$('[tabajax-display-onloading]').length) {
                    Reset();
                }
            }
        });
    }
}

$(document).ready(TabajaxDisplayLoad);
$(document).ajaxComplete(TabajaxDisplayLoad);