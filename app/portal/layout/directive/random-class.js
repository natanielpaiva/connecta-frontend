define([
  'connecta.portal'
], function(portal) {
  return portal.directive('randomClass', function() {
    /**
     * Array temporário com as classes previamente selecionadas,
     * zera a cada vez que completa o length do scope.classes
     */
    var _tempSelectedClasses = [];

    return {
      scope: {
        classes: '=randomClass',
        list: '=randomClassList',
        item: '=randomClassItem',
        sequential: '=randomClassSequential'
      },
      link: function(scope, element, attributes) {
        /**
         * Retorna uma classe aleatória entre as informadas e que não tenha
         * sido usada recentemente (para evitar classes duplicadas)
         */
        function _randomClass() {
          if (_tempSelectedClasses.length == scope.classes.length) {
            _tempSelectedClasses = [];
          }

          var selected;

          // Itera até ter sorteado alguma classe que não exista no array
          do {
            selected = scope.classes[
              Math.floor(Math.random() * scope.classes.length)
            ];
          } while (_tempSelectedClasses.indexOf(selected) >= 0);

          _tempSelectedClasses.push(selected);

          return selected;
        }

        if (scope.sequential) {
          element.addClass(scope.classes[
            scope.list.indexOf(scope.item) % scope.classes.length
          ]);

          element.addClass(scope.classes[
            scope.list.indexOf(scope.item) % scope.classes.length
          ]);
        } else {
          element.addClass(_randomClass());
        }
      }
    };
  });
});
