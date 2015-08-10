/**
 * Componente de wizard step
 */
define([
    'connecta.portal'
], function (portal) {
    return portal.directive('wizardSteps', function () {
        return {
            restrict: 'E',
            replace: true,
            template: 'template/wizard-steps.html',
            scope: {
                config: '='
            },
            link: function ($scope, element, attrs) {
                // adiciona a lista de aplicações no escopo
                $scope.tabs = $scope.config.tabs || [];
            }
        };
    });
});

