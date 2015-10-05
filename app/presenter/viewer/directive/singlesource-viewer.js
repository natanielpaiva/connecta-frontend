define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.directive('singlesourceViewer', function() {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/singlesource-viewer.html',
            scope:{
                model:'=?ngModel'
            },
            controller: function ($scope, $http) {
                
            }
        };
    });
});
