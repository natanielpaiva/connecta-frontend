
define(function () {
    return {

      /**
       *
       * @param { {count:Function, page:Function} } params
       * @param {String} filter
       * @param {Object} fields
       * @returns {string|*}
       */
        getQueryString : function (params, filter, fields) {

            var array = [],
                fieldObj,
                queryString;

            for (var field in fields) {
                fieldObj = {};
                fieldObj[field] = filter;
                array.push(fieldObj);
            }

            queryString = "?size=" + params.count() +
                          "&page=" + params.page();

            if (filter) {
                queryString += "&filter=" + JSON.stringify({ $or : array });
            }

          return queryString;
        }
    };
});
