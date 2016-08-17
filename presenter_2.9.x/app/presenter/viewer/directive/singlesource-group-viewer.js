define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.directive('singlesourceGroupViewer', function() {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/singlesource-group-viewer.html',
            scope:{
                model:'=?ngModel'
            },
            controller: function ($scope, $http) {
            }
        };
    });
});
