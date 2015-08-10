function SearchExpression() {
    this.join = 'AND';
    this.fields = {};
    this.where = {
        join: null,
        values: [],
        parent: null
    };

    var connActual = this.where;

    this.addGroup = function(join) {
        var newConn = {
            join: join || null,
            values: [],
            parent: connActual,
            attribute: null,
            value: null
        };

        connActual.values.push(newConn);
        connActual = newConn;
        return this;
    };

    this.addValue = function(attribute, value) {
        return this.addGroup()
                .setValue(attribute, value)
                .up();
    };

    this.setValue = function(attribute, value) {
        connActual.attribute = attribute;
        connActual.value = value;

        //remove propriedades nao usadas
        delete connActual.join;
        delete connActual.values;
        return this;
    };

    this.setJoin = function(join) {
        connActual.join = join.replace(/:/g, '');
        return this;
    };

    this.up = function() {
        var parent = connActual.parent;
        //remove propriedades nao usadas
        delete connActual.parent;
        if (!connActual.value) {
            delete connActual.value;
            delete connActual.attribute;
        }
        connActual = parent;
        return this;
    };

    this.parseExpression = function(exp) {
        var parts = exp.split('');

        var value = '';
        var prop = '';
        var parsingValue = false;
        var attribute = '';

        for (var a in parts) {
            var char = parts[a];
            if (char === '(') {
                //sub conjuntu
                if (prop !== '') {
                    this.setJoin(prop);
                    prop = '';
                }
                this.addGroup();

            } else if (char === ')') {
                // fech subconjunto
                if (parsingValue) {
                    this.setValue(attribute, value);

                    attribute = prop = value = '';
                    parsingValue = false;
                }

                this.up();

            } else if (char === '=') {
                attribute = prop;
                prop = '';
                parsingValue = true;

            } else {
                if (parsingValue) {
                    value += char;
                } else {
                    prop += char;
                }
            }
        }
        return this.where;
    };

    this.getExpression = function(where) {
        if (!where) {
            where = this.where;
        }
        var values = [];
        var join = where.join || 'and';
        if (where.values) {
            for (var a in where.values) {
                var val = where.values[a];
                if (val.join) {
                    values.push(this.getExpression(where.values[a]));
                } else {
                    values.push(val.attribute + '=' + val.value);
                }
            }
        }
        var out = values.join('):' + join + ':(');
        if (out.length > 0) {
            out = '(' + out + ')';
        }
        return out;
    };
}

