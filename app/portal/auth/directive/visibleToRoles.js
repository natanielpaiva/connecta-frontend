define([
    'connecta.portal'
], function (portal) {
    return portal.directive('visibleToRoles',['LoginService',function (LoginService) {
      return {
               link: function (scope, element, attrs) {
                   var makeVisible = function () {
                           element.removeClass('hidden');
                       },
                       makeHidden = function () {
                           element.addClass('hidden');
                       },
                       determineVisibility = function (resetFirst) {
                           if (resetFirst) {
                               makeVisible();
                           }

                           if (LoginService.hasSecurityRoles(roles)) {
                               makeVisible();
                           } else {
                               makeHidden();
                           }
                       },
                       roles = attrs.visibleToRoles.split(',');

                   if (roles.length > 0) {
                       determineVisibility(true);
                   }
               }
           };
       }
   ]);
});
