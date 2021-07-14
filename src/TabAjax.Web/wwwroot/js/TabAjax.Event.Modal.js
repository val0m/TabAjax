function TabajaxModalClose(selector) {
    if (isNullOrEmpty(selector)) {
        selector = '.modal';
    }
    // Cache tous les modal
    $(selector + ':visible').each(function (index) {
        $(this).modal('hide');
    });
    $('.modal-backdrop').remove();
}

$(document).ready(function () {

    // --- Clique Modal en Ajax  ---
    // - href/url/data-url -
    // - [data-target/html] -
    // === Updated : 24/05/2019 à 16:10 - PASSE Valentin ===
    // - url -
    $('body').on('click', '[tabajaxModal=true],[tabajaxModal=True],[tabajax-Modal=true],[tabajax-Modal=True],.click-modal', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        TabAjaxLoaderBegin();

        // Récupère le lien Url
        var url = $(this).attrTabajaxUrl();

        // Définis la target si cela ne concerne pas un modal générique
        var html = $(this).attrTabajaxHtml(false);
        if ($(this).hasAttr('data-target')) { html = $(this).attr('data-target'); }

        TabajaxChangeUrl(this);
        TabajaxChangeParameter(this);

        if (!isNullOrEmpty(url) && !$(html).length) {
            $.ajax({
                url: url,
                success: function (result) {

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

                    if (!isNull(resultHtml)) {
                        var modal = undefined;

                        if (isNullOrEmpty(html)) {
                            if ($('#Modal .modal:visible').length) {
                                $('#Modal').append(resultHtml);
                                modal = $(resultHtml).first();
                            }
                            else {
                                $('#Modal').html(resultHtml);
                                modal = $('#Modal').children('.modal').first();
                            }
                        }
                        else {
                            if (isElement(html) || isElement(document.getElementById(html))) {
                                if (isElement(document.getElementById(html))) { html = '#' + html; }
                                $(html).replaceWith(resultHtml);
                                modal = $(html);
                            }
                        }

                        if (isElement(modal)) {
                            LibraryReload($(modal));
                            TabajaxReady($(modal));

                            // A modifier par la suite
                            if (TabAjaxFilterByKey('bloquer') !== undefined) {
                                TabAjaxBloquer(TabAjaxFilterByKey('bloquer'));
                            }

                            $(modal).modal('show');
                        }
                    }

                    if (message !== null) { TabAjaxMessage(message); }

                    Reset();
                },
                error: function (result) {
                    if (!isUndefined(result) && !isUndefined(result.responseJSON) && !isUndefined(result.responseJSON.message)) { TabAjaxMessage(result.responseJSON.message); }
                    else { TabAjaxErrorMessage(result.responseText); }
                    console.log('Erreur d\'action : ' + result.responseText);
                    Reset();
                }
            });
        }
        else {
            if ($(html).length) {
                $(html).modal('show');
            }
            TabAjaxLoaderEnd();
        }
    });

});