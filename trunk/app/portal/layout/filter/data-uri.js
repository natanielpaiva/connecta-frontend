define([
    'connecta.portal'
], function (portal) {

    return portal.filter('dataUri', function ($log) {
        return function (file) {
            $log.debug(file);

            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.company.imageQuad = e.target.result;
                $scope.$apply();
            };
            reader.readAsDataURL(files[0]);
            
            return 'data:' + file.type + ';base64,';
        };
    });

});
