
(function (name, root, factory) {
    if (typeof exports == 'object') {
        module.exports = factory();
    } else if (typeof define == 'function' && define.amd) {
        define(factory);
    } else {
        root[name] = factory();
    }
}('json', this, function () {
    var api = {};

/**
 * Parses a given json object by recursively reading it.
 * Return object ready for rendering with hogan.
 *
 * @param {Object} json
 * @param {Function} callback
 * @return {Array}
 * @api public
 */

api.parse = function (json, cb) {
    (function read (json, value, cb) {
        var keys = Object.keys(json);
        (function loop (index) {
            if (index == keys.length) return cb(value);
            var key = keys[index],
                obj = json[key];
            var type = null;

            if (obj === null) {
                type = 'nul';
                value.push(v(type, key, 'null'));
                loop(++index);
            } else if (obj instanceof Object) {
                type = (obj instanceof Array) ? 'arr' : 'obj';
                value.push(o(type, key));
                read(obj, value[value.length-1].value, function () {
                    loop(++index);
                });
            } else {
                switch (true) {
                    case obj.constructor === Number:
                        value.push(v('num', key, obj));
                        break;
                    case obj.constructor === String:
                        value.push(v('str', key, obj));
                        break;
                    case obj.constructor === Boolean:
                        value.push(v('bool', key, obj));
                        break;
                }
                loop(++index);
            }
        }(0));
    }(json, [], cb));
}

/**
 * Create object type.
 *
 * @api private
 */

function o (type, key) {
    return {
        obj: true,
        type: type,
        key: key,
        value: []
    }
}

/**
 * Create value type.
 *
 * @api private
 */

function v (type, key, value) {
    return {
        obj: false,
        type: type,
        key: key,
        value: value
    }
}

/**
 * Serializes a dom structure.
 *
 * @param {Object} elems
 * @param {Function} callback
 * @api public
 */

api.serialize = function (elems, cb) {
    var json = {};
    (function object (json, elems) {
        for (var i=0; i < elems.length; i++) {
            var obj   = elems[i],
                type  = _type(obj.className),
                key   = _find('key', obj.children).innerHTML,
                value = _find('value', obj.children);

            if (/(obj|arr)/.test(type)) {
                var val = (type == 'obj') ? {} : [];
                json instanceof Array ? json.push(val) : json[key] = val;
                object(json[key], value.children);
            } else {
                var val = _value(type, value.innerHTML);
                json instanceof Array ? json.push(val) : json[key] = val;
            }
        }
    }(json, elems));
    cb(json);
}

/**
 * Return the object's type.
 *
 * @param {String} str
 * @api private
 */

function _type (str) {
    var regex = /(?:\s|^)(obj|arr|str|num|nul|bool)(?:\s|$)/;
    return str.match(regex)[1].trim();
}

/**
 * Parse a value based on his type.
 *
 * @param {String} type
 * @param {String} value
 * @api private
 */

function _value (type, value) {
    switch (type) {
        case 'str':
            return value;
        case 'num':
            return parseInt(value);// or parseFloat
        case 'bool':
            return value === 'true' ? true : false;
        case 'nul':
            return null;	
    }
}

/**
 * Find key or value dom object.
 *
 * @param {String} type
 * @param {Object} elems
 * @api private
 */

function _find (type, elems) {
    var regex = new RegExp('(?:\\s|^)('+type+')(?:\\s|$)');
    for (var i=0; i < elems.length; i++) {
        if (regex.test(elems[i].className)) {
            return elems[i];
        }
        if (elems[i].children.length) {
            var elem = _find(type, elems[i].children);
            if (elem !== null) return elem;
        }
    }
    return null;
}

    return api;
}));
