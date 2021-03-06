define([], function () {
  return {
    queryStringify: function(obj, prefix) {
      var str = [];
      for(var p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
          str.push(typeof v == "object" ?
            this.queryStringify(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }
      if (prefix) {
        return str.join("&");
      } else {
        return '?' + str.join("&");
      }
    }
  };

});
