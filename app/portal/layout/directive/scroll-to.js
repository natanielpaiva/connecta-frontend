define([
  'connecta.portal'
], function(portal) {
  return portal.directive('scrollTo', function() {
    return {
      scope: {
        scrollTo: '@'
      },
      link: function(scope, element, attributes) {
        element.on('click', function() {
          angular.element('body').animate({
            scrollTop: angular.element(scope.scrollTo).offset().top
          }, 500);
        });
      }
    };
  });
});
