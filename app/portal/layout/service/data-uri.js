define([
    'connecta.portal',
    'angular'
], function (portal, angular) {
    return portal.factory('dataURI', function($timeout, $q){
        return function (file) {
            var deferred = $q.defer();
            if (!file) {
                deferred.reject();
                return deferred.promise;
            }
            
            if (angular.isString(file)) {
                deferred.resolve(file);
            } else if (!file.base64 && !file.loading) {
                var reader = new FileReader();
                reader.onload = function (e) {
                        file.base64 = e.target.result;
                        file.loading = false;

                        deferred.resolve(e.target.result);
                };
                reader.readAsDataURL(file);
                file.loading = true;
            }
            
            return deferred.promise;
        };
    });
});



