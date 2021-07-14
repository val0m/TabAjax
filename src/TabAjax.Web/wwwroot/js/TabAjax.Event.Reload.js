// --- Fonction qui permet de regénérer le contenu via l'attribut TabajaxReload grâce à un TabajaxAction ou un TabajaxSubmit ---
// - html/id -
// - href -
// - replace -
// (selector est un tableau de String, exemple : IDElement1,IDElement2)
// === Updated : 11/07/2019 à 13:30 - PASSE Valentin ===
function TabajaxReload(selector) {
    if (!isNullOrEmpty(selector)) {
        var arrayReload = selector.split(',');

        for (iReload = 0; iReload < arrayReload.length; iReload++) {

            // Récupère l'élèment du DOM
            var elemReload = undefined;
            if (isElement(arrayReload[iReload])) {
                elemReload = $(arrayReload[iReload]);
            }
            else if (isElement(document.getElementById(arrayReload[iReload]))) {
                elemReload = $('#' + arrayReload[iReload]);
            }

            if (!isUndefined(elemReload)) {

                TabajaxFilter(arrayReload[iReload], false);

                $(elemReload).each(function () {
                    var reload = $(this);

                    // Récupère l'element de sortie (selector)
                    var html = undefined;
                    if ($(reload).hasAttrTabajaxHtml(false)) { html = $(reload).attrTabajaxHtml(false); }
                    else if ($(reload).hasAttrTabajaxBloc()) { html = $(reload).attrTabajaxBloc(); }
                    else html = $(reload).attrTabajaxHtml();

                    // Récupère le lien Url
                    var url = $(reload).attrTabajaxUrl();

                    // Récupère le type de résultat
                    var typeResult = $(reload).attrTabajaxResult();

                    // Charge l'ajax avec les paramètres récupérer
                    AjaxLoad(html, url, typeResult);
                });
            }

        }
    }
}