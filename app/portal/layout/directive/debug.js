define([
  'connecta.portal'
], function(portal) {
  /**
   * Componente usado imprimir o objeto ou array passado
   * @param {type} applicationsService
   */
  return portal.directive('debug', function() {
    return {
      template: '<pre>{{model | json}}</pre>',
      require: 'ngModel',
      scope: {
        model: '=ngModel'
      }
    };
  });
});
