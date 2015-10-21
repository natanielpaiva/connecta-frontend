define([
    'connecta.portal'
], function (portal) {
    return portal.directive('backgroundConfig', function () {
        return {
            link: function (scope, element, attributes) {
                var config = scope.$eval(attributes.backgroundConfig);
                
                if (config.backgroundColor) {
                    element.css('background-color', config.backgroundColor);
                    
                }
                if (config.backgroundImage) {
                    element.css('background-image', 'url('+config.backgroundImage+')');
                }
            }
        };
    });
});
