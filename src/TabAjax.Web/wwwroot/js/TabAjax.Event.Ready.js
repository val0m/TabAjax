// --- Fonction qui permet de générer le contenu via les attributs TabajaxReady ---
// - ready/html/id -
// - href -
// - replace -
// === Updated : 11/07/2019 à 14:30 - PASSE Valentin ===
function TabajaxReady(selector) {
    var elemReady = undefined;
    if (isString(selector)) {
        if (isElement(selector)) {
            elemReady = $(selector);
        }
        else if (isElement(document.getElementById(selector))) {
            elemReady = $('#' + selector)
        }
    }
    else { elemReady = selector; }


    // Check si c'est un element du DOM
    if (isElement(elemReady)) {
        $(elemReady).find('[tabajaxReady][tabajaxReady!=false][tabajaxReady!=False],[tabajax-ready][tabajax-ready!=false][tabajax-ready!=False]').each(function () {

            // Récupère l'element de sortie (selector)
            var html = $(this).attrTabajaxHtml();
            if ($(this).hasAttr('tabajaxReady') && $(this).attr('tabajaxReady') !== 'true' && $(this).attr('tabajaxReady') !== 'True') { html = $(this).attr('tabajaxReady'); }
            else if ($(this).hasAttr('tabajax-ready') && $(this).attr('tabajax-ready') !== 'true' && $(this).attr('tabajax-ready') !== 'True') { html = $(this).attr('tabajax-ready'); }
            else if ($(this).hasAttr('tabajaxBloc') && $(this).attr('tabajaxBloc') !== 'true' && $(this).attr('tabajaxBloc') !== 'True') { html = $(this).attr('tabajaxBloc'); }
            else if ($(this).hasAttr('tabajax-bloc') && $(this).attr('tabajax-bloc') !== 'true' && $(this).attr('tabajax-bloc') !== 'True') { html = $(this).attr('tabajax-bloc'); }

            // Récupère le lien Url
            var url = $(this).attrTabajaxUrl();

            // Récupère le type de résultat
            var typeResult = $(this).attrTabajaxResult();

            if ($(this).hasAttr('tabajaxReady')) {
                $(this).removeAttr('tabajaxReady');
            }
            else {
                $(this).removeAttr('tabajax-ready');
            }

            AjaxLoad(html, url, typeResult);

        });
    }
}