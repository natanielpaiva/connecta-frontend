define([
    'connecta.portal'
], function (portal) {

  return portal.service('HeadingPopoverService', function($rootScope){
    this.active =  function(obj){
      $rootScope.$broadcast('popover.activate', obj);
      return this;
    };

    this.hide =  function(obj){
      $rootScope.$broadcast('popover.hide', obj);
      return this;
    };
  });
});
