define([
    'connecta.portal'
], function (portal) {

  return portal.service('sidebarService', function($rootScope){
    this.config =  function(obj){
      $rootScope.$broadcast('sidebar.config', obj);
      return this;
    };

    this.show =  function(obj){
      $rootScope.$broadcast('sidebar.show', obj);
      return this;
    };

    this.hide =  function(obj){
      $rootScope.$broadcast('sidebar.hide', obj);
      return this;
    };


  });

});
