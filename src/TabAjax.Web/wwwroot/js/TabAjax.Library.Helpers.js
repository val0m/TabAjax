// Returns last index of string
String.prototype.indexOfEnd = function (string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}
// Returns if a value is a string
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
// Returns if a value is really a number
function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}
// Returns if a value is really a numeric
function isNumeric(num) {
    return !isNaN(num);
}
// Returns if a value is an array
function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}
// Returns if a value is an object
function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}
// Returns if a value is null
function isNull(value) {
    return value === null;
}
// Returns if a value is null
function isEmpty(value) {
    return value === '';
}
// Returns if a value is undefined
function isUndefined(value) {
    return typeof value === 'undefined';
}
// Returns if a value is null, empty or undefined
function isNullOrEmpty(value) {
    return isNull(value) || isUndefined(value) || isEmpty(value) || (isArray(value) && value.length == 0);
}
// Returns if a value is a boolean
function isBoolean(value) {
    return typeof value === 'boolean';
}
// Returns if a value is a boolean string or boolean int
// === Updated : 07/02/2020 à 10:00 - PASSE Valentin ===
function isBooleanVirtual(value) {
    return ((isString(value) && (value === 'true' || value === 'True' || value === 'false' || value === 'False'))
        || (isNumber(value) && (value === 1 || value === 0)));
}
// Returns if a value is a regexp
function isRegExp(value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
}
// Returns if value is an error object
function isError(value) {
    return value instanceof Error && typeof value.message !== 'undefined';
}
// Returns if value is a date object
function isDate(value) {
    return value instanceof Date && !isNaN(value);
}
// Returns if a Symbol
function isSymbol(value) {
    return typeof value === 'symbol';
}
// Returns if a DOM element
function isElement(value) {
    return !isNullOrEmpty(value)
        && $(value).length;
}

function formatMillier(nombre) {
    nombre += '';
    var sep = ' ';
    var reg = /(\d+)(\d{3})/;
    while (reg.test(nombre)) {
        nombre = nombre.replace(reg, '$1' + sep + '$2');
    }
    return nombre;
}
function CurrencyFormatted(amount) {
    var i = parseFloat(amount);
    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;

    s = new String(formatMillier(i));
    if (s.indexOf('.') < 0) { s += ',00'; }
    if (s.indexOf('.') === (s.length - 2)) { s += '0'; }
    s = minus + s;
    s = s.replace(".", ",");
    return s;
}

// Dates format
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
function ParseDate(input, separator) {
    if (separator === undefined) {
        separator = '-';
    }
    var parts = input.split(separator);
    var string = parts[1] + '-' + parts[0] + '-' + parts[2];
    return new Date(string);
}