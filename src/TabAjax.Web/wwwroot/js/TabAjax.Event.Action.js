/**
 * Exécute une action en ajax lors d'un clique ou d'un changement sur un élément du DOM qui a un attribut qui se nomme [tabajaxAction] ou [tabajax-action].
 * @function
 * @name TabajaxEventAction
 * @param {(boolean|string)} tabajaxAction - [tabajax-action] - Définit l'élément qui possède cette action. 
 * Si la valeur est "true", c'est cette élément qui prendra en charge l'action.
 * Si la valeur est de type "string", c'est le selecteur qui prendra en charge l'action.
 * @param {string} [tabajaxUrl] - [tabajax-url|href|data-url|action] - Définit l'url de l'action qui devra être éxécuter en ajax.
 * Attribut à utiliser uniquement sur l'élément qui prendra en charge l'objet.
 * @param {string} [tabajaxHtml] - [tabajax-html] - Définit le selecteur qui recevra le retour de l'action.
 * Attribut à utiliser uniquement sur l'élément qui prendra en charge l'objet. 
 * @param {string} [tabajaxResult] - [tabajax-result|tabajaxType|tabajax-type] - Définit le type de retour à partir de [tabajaxHtml].
 * Par défaut : "HTML".
 * Attribut à utiliser uniquement sur l'élément qui prendra en charge l'objet. 
 * @param {string} [tabajaxReload] - [tabajax-reload] - Définit les éléments à recharger à la suite de cette action.
 * Attribut à utiliser uniquement sur l'élément qui prendra en charge l'objet. 
 * @param {string} [tabajaxFilter] - [tabajax-filter] - Définit les éléments à filtrer à la suite de cette action.
 * Les autres attributs de [tabajaxFilter] fonctionnent aussi ([tabajaxFilterLoad]).
 * Attribut à utiliser uniquement sur l'élément qui prendra en charge l'objet. 
 * @param {string} [tabajaxChangeUrl] - [tabajax-changeUrl|tabajaxUrlChange|tabajax-urlChange] - Définit le changement de l'url avec la valeur de l'attribut.
 * Attribut à utiliser uniquement sur l'élément qui prendra en charge l'objet. 
 * @param {string} [tabajaxChangeParameter] - [tabajax-changeParameter|tabajaxParameterChange|tabajax-parameterChange] - Définit le changement de paramètre avec la valeur de cet élément au selecteur de l'attribut.
 * Attribut à utiliser uniquement sur l'élément qui prendra en charge l'objet. 
 * @see {@link /tabajax/tabajax.Event/TabajaxResult|TabajaxResult} - Documentations sur TabajaxResult.
 * @see {@link /tabajax/tabajax.Event.Reload|TabajaxReload} - Documentations sur TabajaxReload.
 * @see {@link /tabajax/tabajax.Event.Filter|TabajaxFilter} - Documentations sur TabajaxFilter.
 * @see {@link /tabajax/tabajax.Event.Change|TabajaxChangeUrl|TabajaxChangeParameter} - Documentations sur TabajaxChangeUrl & TabajaxChangeParameter.
 * @example <caption>Utilisation d'une action d'un lien.</caption>
 * <!-- Effectue l'action sans retour attendu -->
 * <a id="index-action" href="/Lien/Url" tabajaxAction="true">Clique</a> * 
 * <!-- Effectue une action avec un contenu html en retour -->
 * <a id="index-action" href="/Lien/Url" tabajaxAction="true" tabajaxHtml="div[id='index-retour']">Clique</a>
 * <div id="index-retour">Mon contenu de retour</div>
 * @example <caption>Utilisation d'une action d'un dropdown.</caption>
 * <!-- Effectue l'action lors d'un changement de valeur du dropdown -->
 * <!-- L'url de l'action sera alors : "Lien/Url?city=[value selected]" -->
 * <select id="index-select" name="city" tabajaxAction="true" data-url="/Lien/Url">
 * <option value="1" selected>Nice</option>
 * <option value="2">Marseille</option>
 * <option value="3">Lyon</option>
 * </select>
 * @author Valentin PASSE <valentin.passe@eaudazur.com>
 * @version 1.0.0
*/

$(document).ready(function () {   
    // --- Clique Action en Ajax  ---
    // - href/url -
    // - [html] -
    // - [reload] -
    // === Updated : 11/09/2019 à 14:50 - PASSE Valentin ===
    $('body').on('click', '[tabajaxAction],[tabajax-action]', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        var action = $(this).attrTabajaxAction();
        var elementAction = null;

        if (action === 'true' || action === 'True') {
            // Attribut l'élément de l'action
            elementAction = $(this);
        }
        else if (action !== 'false' && action !== 'False' && isElement(action)) {
            // Attribut l'élément de l'action
            elementAction = $(action);
        }

        if (elementAction !== null) {
            // Récupère le lien Url
            var url = $(elementAction).attrTabajaxUrl();

            if (!isNullOrEmpty(url)) {

                // Récupère l'element de sortie (selector)
                var html = $(elementAction).attrTabajaxHtml(false);
                if (isUndefined(html)) { html = ''; }

                // TabAjaxLoaderBegin : Demarre le Loader
                TabAjaxLoaderBegin(html);

                // Récupère le type de résultat
                var typeResult = $(elementAction).attrTabajaxResult();

                // Cache tous les modal
                var modal = $(elementAction).closest('.modal:visible');
                if ($(modal).length) { TabajaxModalClose('#' + $(modal).attr('id')) }
                else { TabajaxModalClose(); }

                // Définis les Reload s'il y en a
                var reload = $(elementAction).attrTabajaxReload();

                //Si TabajaxFilter existe, cela signifie qu'il s'agit de faire un TabajaxFilter après l'appel ajax
                var filter = $(elementAction).attrTabajaxFilter();
                var filterLoad = $(elementAction).attrTabajaxFilterLoad();

                TabajaxChangeUrl(elementAction);
                TabajaxChangeParameter(elementAction);

                $.ajax({
                    url: url,
                    success: function (result) {
                        AjaxLoadSuccess(result, html, typeResult, reload, filter, filterLoad);
                    },
                    error: function (result) {
                        AjaxLoadError(result, html, typeResult, reload, filter, filterLoad);
                    }
                });
            }
            else {
                console.log('Erreur d\'action : L\'Url de l\'action n\'est pas présent.')
                Reset(html);
            }
        }

    });
    // --- Change Select Action en Ajax  ---
    // - href/url -
    // - name -
    // - value -
    // - [TabajaxAction]:Click() -
    // === Updated : 26/06/2019 à 10:00 - PASSE Valentin ===
    $('body').on('change', 'select[tabajaxAction=true],select[tabajaxAction=True],select[tabajax-action=true],select[tabajax-action=True]', function (event) {

        // Récupère le nom de l'url de l'action
        var urlName = undefined;
        if (!isNullOrEmpty($(this).attr('href'))) { urlName = 'href'; }
        else if (!isNullOrEmpty($(this).attr('tabajaxUrl'))) { urlName = 'tabajaxUrl'; }
        else if (!isNullOrEmpty($(this).attr('tabajax-url'))) { urlName = 'tabajax-url'; }

        // Récupère le nom du select
        var name = $(this).attr('name');

        if (!isNullOrEmpty(urlName) && !isNullOrEmpty(name)) {
            var url = $(this).attr(urlName);

            if (url.indexOf("?") !== -1) { url += '&'; }
            else { url += '?'; }
            url += name + '=' + $(this).val();

            $(this).attr(urlName, url);

            // Déclenche tabajaxAction
            $(this).click();
        }
    });
});