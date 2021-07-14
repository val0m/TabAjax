/**
 * Exécute une action en ajax qui permet de restituer un bloc html lors d'un clique sur un élément du DOM qui a un attribut qui se nomme [tabajaxBloc] ou [tabajax-bloc].
 * @function
 * @name TabajaxEventBloc
 * @param {(boolean|string)} tabajaxBloc - [tabajax-bloc] - Définit l'élément qui possède cette action de restitution. 
 * Si la valeur est "false", l'évènement ne sera pas actif.
 * Si la valeur est de type "string", c'est le selecteur qui prendra en charge la restitution du bloc HTML.
 * @param {string} [tabajaxUrl] - [tabajax-url|href|data-url|action] - Définit l'url de l'action qui devra être éxécuter en ajax.
 * @param {string} [tabajaxHtml] - [tabajax-html] - Définit le selecteur qui prendra en charge la restitution du bloc HTML.
 * Attribut à utiliser uniquement si l'élément n'est pas celui qui restituera le contenu HTML et si "tabajaxBloc" n'est pas un selecteur. 
 * @param {string} [tabajaxResult] - [tabajax-result|tabajaxType|tabajax-type] - Définit le type de retour à partir de l'objet, [tabajaxBloc] ou [tabajaxHtml].
 * Par défaut : "HTML".
 * @param {string} [tabajaxFilter] - [tabajax-filter] - Définit les éléments à filtrer à la suite de cette action.
 * Les autres attributs de [tabajaxFilter] fonctionnent aussi ([tabajaxFilterLoad]).
 * @param {string} [tabajaxChangeUrl] - [tabajax-changeUrl|tabajaxUrlChange|tabajax-urlChange] - Définit le changement de l'url avec la valeur de l'attribut.
 * @param {string} [tabajaxChangeParameter] - [tabajax-changeParameter|tabajaxParameterChange|tabajax-parameterChange] - Définit le changement de paramètre avec la valeur de cet élément au selecteur de l'attribut.
 * @see {@link /tabajax/tabajax.Event/TabajaxResult|TabajaxResult} - Documentations sur TabajaxResult.
 * @see {@link /tabajax/tabajax.Event.Filter|TabajaxFilter} - Documentations sur TabajaxFilter.
 * @see {@link /tabajax/tabajax.Event.Change|TabajaxChangeUrl|TabajaxChangeParameter} - Documentations sur TabajaxChangeUrl & TabajaxChangeParameter.
 * @example <caption>Utilisation d'un affichage d'un bloc à partir d'un bloc parent.</caption>
 * <!-- Effectue l'action du bloc -->
 * <div id="index-bloc" tabajaxBloc="true" tabajax-url="/Lien/Url">
 *  <!-- Mon contenu de retour à la suite du clique du bloc parent -->
 * </div>
 * @example <caption>Utilisation d'un affichage d'un bloc à partir d'un autre bloc.</caption>
 * <!-- Effectue l'action du bloc -->
 * <div id="index-bloc" tabajaxBloc="index-bloc-retour" tabajax-url="/Lien/Url">
 *  Clique sur ce bloc
 * </div>
 * <div id="index-bloc-retour">
 *  <!-- Mon contenu de retour à la suite du clique du bloc #index-bloc --> 
 * </div>
 * @author Valentin PASSE <valentin.passe@eaudazur.com>
 * @version 1.0.0
*/

$(document).ready(function () {

    // --- Clique Bloc en Ajax  ---
    // - bloc/html/id -
    // - href/url -
    // === Updated : 12/07/2019 à 11:00 - PASSE Valentin ===
    $('body').on('click', '[tabajaxBloc][tabajaxBloc!=false][tabajaxBloc!=False],[tabajax-bloc][tabajax-bloc!=false][tabajax-bloc!=False]', function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        // Récupère l'element de sortie (selector)
        var html = $(this).attrTabajaxHtml();
        if ($(this).hasAttr('tabajaxBloc') && $(this).attr('tabajaxBloc') !== 'true' && $(this).attr('tabajaxBloc') !== 'True') { html = $(this).attr('tabajaxBloc'); }
        else if ($(this).hasAttr('tabajax-bloc') && $(this).attr('tabajax-bloc') !== 'true' && $(this).attr('tabajax-bloc') !== 'True') { html = $(this).attr('tabajax-bloc'); }

        if ($(this).hasAttrTabajaxUrl()) {
            // Récupère le lien Url
            var url = $(this).attrTabajaxUrl();

            // Récupère le type de résultat
            var typeResult = $(this).attrTabajaxResult();

            //// Définis les Reload s'il y en a
            //var reload = $(this).attrTabajaxReload();

            // Si TabajaxFilter existe, cela signifie qu'il s'agit de faire un TabajaxFilter après l'appel ajax
            var filter = $(this).attrTabajaxFilter();
            var filterLoad = $(this).attrTabajaxFilterLoad();

            TabajaxChangeUrl(this);
            TabajaxChangeParameter(this);

            AjaxLoad(html, url, typeResult, null, filter, filterLoad);
        }
        else {
            TabajaxReload(html);
        }
    });// end [tabajax-bloc]

});