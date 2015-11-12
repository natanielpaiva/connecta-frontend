define([
    'connecta.presenter',
    'presenter/hierarchy/service/hierarchy-service'
], function (presenter) {
    return presenter.lazy.controller('HierarchyFormController', function ($scope, HierarchyService, $routeParams) {

        var currentState;
        $scope.button = true;
        
        var idParent;
        var states = {
            NEW: {
                init: function () {
                    $scope.hierarchy = {
                        hierarchyItem: [
                            {
                                "name": null,
                                "formula": null,
                                "path": 1,
                                "hierarchyItem": []
                            }
                        ]
                    };
                    $scope.open = "false";
                },
                remove: function (scope) {
                    scope.remove();
                },
                newSubitem: function (scope) {
                    var nodeData = scope.$modelValue;
                    nodeData.hierarchyItem.push({
                        name: null,
                        formula: null,
                        idParent: null,
                        path: nodeData.path + '.' + (nodeData.hierarchyItem.length + 1),
                        hierarchyItem: []
                    });
                },
                getSubitems: function (scope, item) {
                    scope.toggle();
                }

            },
            EDIT: {
                init: function () {
                    HierarchyService.getById($routeParams.id).then(function (response) {
                        $scope.hierarchy = response.data;
                    });
                    $scope.open = "true";
                },
                remove: function (scope) {
                    var nodeData = scope.$modelValue;
                    HierarchyService.excluirItem(nodeData.id).then(function (res) {
                        scope.remove();
                    });
                },
                newSubitem: function (scope) {
                    var nodeData = scope.$modelValue;
                    idParent = nodeData.id;
                    currentState.getSubitems(scope, nodeData).then(function () {
                        nodeData.hierarchyItem.unshift({
                            name: null,
                            formula: null,
                            idParent: nodeData.idParent,
                            path: nodeData.path + '.' + (nodeData.hierarchyItem.length + 1)
                        });
                    });
                },
                getSubitems: function (scope, item) {
                    return HierarchyService.getItems(item.id).then(function (response) {
                        var ItemOrfao = response.data;
                        if (ItemOrfao !== null) {
                            for (var i in ItemOrfao) {
                                ItemOrfao[i].idParent = item.id;
                            }
                        }
                        item.hierarchyItem = ItemOrfao;
                        scope.toggle();
                    });
                },
                editFields: function (scope) {
                    if (scope.name !== null && scope.formula !== null && scope.name.length > 3 && scope.formula.length > 3) {
                        if (!scope.hasOwnProperty('id')) {
                            return HierarchyService.saveHierarchyItem(scope, idParent).then(function (res) {
                                scope.idParent = idParent;
                                scope.id = res.data.id;
                                console.log("save");
                            });
                        } else {
                            HierarchyService.updateHierarchyItem(scope).then(function () {
                                console.log("update");
                            });
                        }
                    }
                }
            }
        };

        if ($routeParams.id) {
            currentState = states.EDIT;
            $scope.button  = false;
        } else {
            currentState = states.NEW;
        }

        $scope.selectedItem = {};
        $scope.options = {};

        currentState.init();

        $scope.excluir = function (scope) {
            currentState.remove(scope);
        };

        $scope.getSubitems = function (scope, item) {
            currentState.getSubitems(scope, item);
        };

        $scope.newSubItem = function (scope) {
            currentState.newSubitem(scope);
        };

        $scope.editFields = function (scope) {
            if (currentState.editFields) {
                currentState.editFields(scope);
            }
        };

        $scope.submit = function () {
            HierarchyService.save($scope.hierarchy).then(function () {
            });
        };
    });
});