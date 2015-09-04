define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço de gerenciamento do heading
     *
     * @param {type} $rootScope
     * @returns {undefined}
     */
    return portal.service('$heading', function ($rootScope) {
      this.setLogo = function (logoSrc){
        $rootScope.$broadcast('heading.change-logo', logoSrc);
      };

      this.clearLogo = function(){
        $rootScope.$broadcast('heading.remove-logo');
      };

    });
});
