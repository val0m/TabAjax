// Returns if a element has attribute html
$.fn.hasAttrTabajaxHtml = function (withId) {
    if (withId === undefined) {
        withId = true;
    }
    return this.hasAttr('tabajaxHtml')
        || this.hasAttr('tabajax-html')
        || (withId === true && this.hasAttr('id'));
};
// Returns element attribute html
$.fn.attrTabajaxHtml = function (withId) {
    if (withId === undefined) {
        withId = true;
    }
    if (this.hasAttr('tabajaxHtml')) { return this.attr('tabajaxHtml'); }
    else if (this.hasAttr('tabajax-html')) { return this.attr('tabajax-html'); }
    else if (withId === true && this.hasAttr('id')) { return '[id=' + this.attr('id') + ']'; }
    return undefined;
};

// Returns if a element has attribute URL
// === Updated : 14/02/2020 à 11:30 - PASSE Valentin ===
$.fn.hasAttrTabajaxUrl = function () {
    return this.hasAttr('href')
        || this.hasAttr('tabajaxUrl')
        || this.hasAttr('tabajax-url')
        || this.hasAttr('data-url')
        || this.hasAttr('action');
};
// Returns element attribute URL
// === Updated : 14/02/2020 à 11:30 - PASSE Valentin ===
$.fn.attrTabajaxUrl = function () {
    if (this.hasAttr('href')) { return this.attr('href'); }
    else if (this.hasAttr('tabajaxUrl')) { return this.attr('tabajaxUrl'); }
    else if (this.hasAttr('tabajax-url')) { return this.attr('tabajax-url'); }
    else if (this.hasAttr('data-url')) { return this.attr('data-url'); }
    else if (this.hasAttr('action')) { return this.attr('action'); }
    return undefined;
};

// Returns if a element has attribute type result
$.fn.hasAttrTabajaxResult = function () {
    return this.hasAttr('tabajaxResult')
        || this.hasAttr('tabajax-result')
        || this.hasAttr('tabajaxType')
        || this.hasAttr('tabajax-type');
};
// Returns element attribute type result
$.fn.attrTabajaxResult = function () {
    var typeResult = undefined;
    if (this.hasAttr('tabajaxResult')) { typeResult = this.attr('tabajaxResult').toUpperCase(); }
    else if (this.hasAttr('tabajax-result')) { typeResult = this.attr('tabajax-result').toUpperCase(); }
    else if (this.hasAttr('tabajaxType')) { typeResult = this.attr('tabajaxType').toUpperCase(); }
    else if (this.hasAttr('tabajax-type')) { typeResult = this.attr('tabajax-type').toUpperCase(); }

    if (!isUndefined(typeResult)) {
        return Object.keys(EnumResult).filter(function (x) { return x === typeResult; })[0];
    }
    return undefined;
};

// Returns if a element has attribute Reload
$.fn.hasAttrTabajaxReload = function () {
    return this.hasAttr('tabajaxReload')
        || this.hasAttr('tabajax-reload');
};
// Returns element attribute Reload
$.fn.attrTabajaxReload = function () {
    if (this.hasAttr('tabajaxReload')) { return this.attr('tabajaxReload'); }
    else if (this.hasAttr('tabajax-reload')) { return this.attr('tabajax-reload'); }
    return undefined;
};

// Returns if a element has attribute Filter
$.fn.hasAttrTabajaxFilter = function () {
    return this.hasAttr('tabajaxFilter')
        || this.hasAttr('tabajax-filter');
};
// Returns element attribute Filter
$.fn.attrTabajaxFilter = function () {
    if (this.hasAttr('tabajaxFilter')) { return this.attr('tabajaxFilter'); }
    else if (this.hasAttr('tabajax-filter')) { return this.attr('tabajax-filter'); }
    return undefined;
};

// Returns if a element has attribute Filter Times
// === Created : 10/02/2020 à 08:50 - PASSE Valentin ===
$.fn.hasAttrTabajaxFilterTimes = function () {
    return this.hasAttr('tabajaxFilterTimes')
        || this.hasAttr('tabajax-filterTimes');
};
// Returns element attribute Filter Times
// === Created : 10/02/2020 à 08:50 - PASSE Valentin ===
$.fn.attrTabajaxFilterTimes = function () {
    if (this.hasAttr('tabajaxFilterTimes')) { return this.attr('tabajaxFilterTimes'); }
    else if (this.hasAttr('tabajax-filterTimes')) { return this.attr('tabajax-filterTimes'); }
    return undefined;
};

// Returns if a element has attribute Filter Load
$.fn.hasAttrTabajaxFilterLoad = function () {
    return this.hasAttr('tabajaxFilterLoad')
        || this.hasAttr('tabajax-filterLoad');
};
// Returns element attribute Filter Load
$.fn.attrTabajaxFilterLoad = function () {
    if (this.hasAttr('tabajaxFilterLoad')) { return this.attr('tabajaxFilterLoad'); }
    else if (this.hasAttr('tabajax-filterLoad')) { return this.attr('tabajax-filterLoad'); }
    return undefined;
};

// Returns if a element has attribute Bloc
$.fn.hasAttrTabajaxBloc = function () {
    return this.hasAttr('tabajaxBloc')
        || this.hasAttr('tabajax-bloc');
};
// Returns element attribute Bloc
$.fn.attrTabajaxBloc = function () {
    if (this.hasAttr('tabajaxBloc')) { return this.attr('tabajaxBloc'); }
    else if (this.hasAttr('tabajax-bloc')) { return this.attr('tabajax-bloc'); }
    return undefined;
};

// Returns if a element has attribute Action
$.fn.hasAttrTabajaxAction = function () {
    return this.hasAttr('tabajaxAction')
        || this.hasAttr('tabajax-action');
};
// Returns element attribute Action
$.fn.attrTabajaxAction = function () {
    if (this.hasAttr('tabajaxAction')) { return this.attr('tabajaxAction'); }
    else if (this.hasAttr('tabajax-action')) { return this.attr('tabajax-action'); }
    return undefined;
};

// Returns if a element has attribute Ready
$.fn.hasAttrTabajaxReady = function () {
    return this.hasAttr('tabajaxReady')
        || this.hasAttr('tabajax-ready');
};
// Returns element attribute Ready
$.fn.attrTabajaxReady = function () {
    if (this.hasAttr('tabajaxReady')) { return this.attr('tabajaxReady'); }
    else if (this.hasAttr('tabajax-ready')) { return this.attr('tabajax-ready'); }
    return undefined;
};

// Returns if a element has attribute Submit
$.fn.hasAttrTabajaxSubmit = function () {
    return this.hasAttr('tabajaxSubmit')
        || this.hasAttr('tabajax-submit');
};
// Returns element attribute Submit
$.fn.attrTabajaxSubmit = function () {
    if (this.hasAttr('tabajaxSubmit')) { return this.attr('tabajaxSubmit'); }
    else if (this.hasAttr('tabajax-submit')) { return this.attr('tabajax-submit'); }
    return undefined;
};

// Returns if a element has attribute Change Url
$.fn.hasAttrTabajaxChangeUrl = function () {
    return this.hasAttr('tabajaxChangeUrl')
        || this.hasAttr('tabajax-changeUrl')
        || this.hasAttr('tabajaxUrlChange')
        || this.hasAttr('tabajax-urlChange');
};
// Returns element attribute Change Url
$.fn.attrTabajaxChangeUrl = function () {
    if (this.hasAttr('tabajaxChangeUrl')) { return this.attr('tabajaxChangeUrl'); }
    else if (this.hasAttr('tabajax-changeUrl')) { return this.attr('tabajax-changeUrl'); }
    else if (this.hasAttr('tabajaxUrlChange')) { return this.attr('tabajaxUrlChange'); }
    else if (this.hasAttr('tabajax-urlChange')) { return this.attr('tabajax-urlChange'); }
    return undefined;
};

// Returns if a element has attribute Change Parameter
$.fn.hasAttrTabajaxChangeParameter = function () {
    return this.hasAttr('tabajaxChangeParameter')
        || this.hasAttr('tabajax-changeParameter')
        || this.hasAttr('tabajaxParameterChange')
        || this.hasAttr('tabajax-parameterChange');
};
// Returns element attribute Change Parameter
$.fn.attrTabajaxChangeParameter = function () {
    if (this.hasAttr('tabajaxChangeParameter')) { return this.attr('tabajaxChangeParameter'); }
    else if (this.hasAttr('tabajax-changeParameter')) { return this.attr('tabajax-changeParameter'); }
    else if (this.hasAttr('tabajaxParameterChange')) { return this.attr('tabajaxParameterChange'); }
    else if (this.hasAttr('tabajax-parameterChange')) { return this.attr('tabajax-parameterChange'); }
    return undefined;
};