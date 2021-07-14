$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};
var scriptLoad = false;

$(document).ready(function () {
    LibraryReload('#body');
});
$(document).ajaxStop(function () {
    if (scriptLoad === false) { LibraryReload(); }
});

function LibraryReload(selector) {
    var elemLibraryReload = undefined;
    if (isString(selector)) {
        if (isElement(selector)) {
            elemLibraryReload = $(selector);
        }
        else if (isElement(document.getElementById(selector))) {
            elemLibraryReload = $('#' + selector)
        }
    }
    else if (isElement(selector)) { elemLibraryReload = selector; }
    else { elemLibraryReload = $('#body-page'); }

    if (isElement(elemLibraryReload)) {
        baseLoad(elemLibraryReload);

        //if (typeof datetimepickerLoad === "function") { datetimepickerLoad(elemLibraryReload); }
        //if (typeof bootstrapLoad === "function") { bootstrapLoad(elemLibraryReload); }
        //if (typeof bootstrapSwitchLoad === "function") { bootstrapSwitchLoad(elemLibraryReload); }
        //if (typeof bootstrapSelectLoad === "function") { bootstrapSelectLoad(elemLibraryReload); }
        //if (typeof bootstrapTagsLoad === "function") { bootstrapTagsLoad(elemLibraryReload); }
        //if (typeof treeGridLoad === "function") { treeGridLoad(elemLibraryReload); }
        //if (typeof ckeditorLoad === "function") { ckeditorLoad(elemLibraryReload); }
        //if (typeof fixedHeaderTableLoad === "function") { fixedHeaderTableLoad(elemLibraryReload); }

        scriptLoad = true;
    }
}
function baseLoad(selector) {

    var elemBaseLoad = undefined;
    if (isString(selector)) {
        if (isElement(selector)) {
            elemBaseLoad = $(selector);
        }
        else if (isElement(document.getElementById(selector))) {
            elemBaseLoad = $('#' + selector)
        }
    }
    else if (isElement(selector)) { elemBaseLoad = selector; }
    else { elemBaseLoad = $(''); }

    if (isElement(elemBaseLoad)) {
        // Génère les champs falcutatif d'un formulaire
        $(elemBaseLoad).find('label[falcutatif]').each(function () {
            var id = "falcutatif_" + $(this).attr('for');

            var value = false;
            if ($(this).hasAttr('falcutatif') && $(this).attr('falcutatif') === 'true') { value = true; }

            if (!$(this).find('input[type="checkbox"]').length) {
                var label = $('<label for="' + id + '" style="float:right;font-weight:normal;">activé </label>');
                var checkbox = $('<input type="checkbox" name="falcutatif" id="' + id + '" style="margin-top:0px;" />');
                label.append(checkbox);
                $(this).append(label);
                $(this).attr('for', id);

                $(this).find('input[name=falcutatif]').prop('checked', value);
                $(this).find('input[name=falcutatif]').change();
            }
        });
        // Génère les champs obligatoires d'un formulaire
        $(elemBaseLoad).find('div.form-group').each(function () {
            if ($(this).find(':input[data-val-required]:not([type=hidden])').length && $(this).find('label').length && !$(this).find('i[name="required"]').length && !$(this).find(':input[data-val="false"]').length) {
                var iconRequired = $('<i name="required" style="margin-left:5px;" class="color-rouge fa fa-dot-circle-o" data-toggle="tooltip" data-placement="top" title="Obligatoire"></i>');
                $(this).find('label').first().append(iconRequired);
            }
        });
    }

}