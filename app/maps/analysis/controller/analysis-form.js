define([
    'connecta.maps',
    '../service/analysis-service',
    '../../project/service/project-service'
], function (maps) {

    return maps.lazy.controller('AnalysisFormController', function ($scope, $location, $routeParams, AnalysisService, ProjectService, notify) {

        init();

        function init() {
            loadProjects();
            checkEditing();
        }

        $scope.analysis = {
            popupConfig: {
                enabled: false,
                positioning: 'tooltip'
            },
            allowDrill: false,
            outFields: []
        };

        function checkEditing() {
            if ($routeParams.id) {
                $scope.isEditing = true;
                AnalysisService.get($routeParams.id)
                    .catch(function (err) {
                        notify.error(err);
                    })
                    .then(function (response) {
                        try {
                            var analysis = response.data;
                            $scope.analysis = {
                                _id: analysis._id,
                                title: analysis.title,
                                richLayerId: analysis.richLayerId,
                                allowDrill: analysis.allowDrill,
                                popupConfig: analysis.popupConfig,
                                outFields: analysis.outFields,
                                project: analysis.project
                            };
                            var richLayer = $scope.analysis.project.richLayers.filter(function (richLayer) {
                                return richLayer._id === $scope.analysis.richLayerId;
                            });
                            if (richLayer.length) {
                                richLayer = richLayer[0];
                                $scope.selectedRichLayer =richLayer;
                                populateMetadataFields(richLayer);
                            }
                        } catch (err) {
                            notify.error(err.message);
                        }
                    });
            }
        }

        $scope.valueTypeMap = {
            'string': 'ANALYSIS.TYPE_STRING',
            'number': 'ANALYSIS.TYPE_NUMBER',
            'date': 'ANALYSIS.TYPE_DATE',
            'disabled': 'ANALYSIS.TYPE_DISABLED'
        };

        function loadProjects() {
            ProjectService.list({size: '*'})
                .catch(function (err) {
                    notify.error(err.message);
                })
                .then(function (response) {
                    if (!response) {
                        return notify.error('Não foi possível obter resposta do servidor.');
                    }
                    $scope.projects = response.data.content;
                });
        }

        $scope.projectChanged = function (project) {
            $scope.analysis.project = project;
        };

        $scope.richLayerChanged = function (richLayer) {
            populateMetadataFields(richLayer);
        };

        function populateMetadataFields(richLayer) {
            var promise;
            if ($scope.analysis.project.serviceType === 'obiee') {
                promise = AnalysisService.getMetaData(richLayer.info.analysisPath);
                promise.then(function (response) {
                    if (!response) {
                        return notify.error('Não foi possível obter resposta do servidor.');
                    }
                    $scope.dataSourceColumns = response;
                });
            } else if ($scope.analysis.project.serviceType === 'connecta') {
                promise = AnalysisService.getMetaData(richLayer.info.analysisId);
                promise.then(function (response) {
                    if (!response) {
                        return notify.error('Não foi possível obter resposta do servidor.');
                    }
                    $scope.dataSourceColumns =  [];
                    if (response.analysisColumns && response.analysisColumns.length) {
                        response.analysisColumns.forEach(function (column) {
                            $scope.dataSourceColumns.push({name: column.name, alias: column.label});
                        });
                    } else {
                        return notify.error('analysis-form.js#richLayerChanged => Não foi possível encontrar colunas.');
                    }
                });
            } else {
                return notify.error('analysis-form.js#richLayerChanged => Service type faltando ou não suportado.');
            }
            promise.catch(function (err) {
                notify.error(err.message);
            });
        }

        $scope.columnChanged = function (columnName) {
            $scope.outField.name = columnName;
        };

        $scope.addOutField = function () {
            $scope.outField = {};
        };

        $scope.editOutField = function (outfieldIndex) {
            $scope.outField = Object.assign({}, $scope.analysis.outFields[outfieldIndex]);
            $scope.outFieldEditIndex = outfieldIndex;
        };

        $scope.deleteOutField = function () {
            $scope.analysis.outFields.splice($scope.outFieldEditIndex, 1);
            delete $scope.outFieldEditIndex;
            delete $scope.outField;
        };

        $scope.saveOutField = function () {
            $scope.outField.alias = $scope.outField.alias || $scope.outField.name;
            if ($scope.outFieldEditIndex !== undefined) {
                $scope.analysis.outFields.splice($scope.outFieldEditIndex, 1, $scope.outField);
            } else {
                $scope.analysis.outFields.push($scope.outField);
            }
            delete $scope.outFieldEditIndex;
            delete $scope.outField;
        };

        $scope.cancelOutField = function () {
            delete $scope.outField;
        };

        $scope.saveProject = function () {
            var promise;
            if (!$scope.isEditing) {
                promise = AnalysisService.save($scope.analysis);
            } else {
                promise = AnalysisService.update($scope.analysis._id, $scope.analysis);
            }
            promise.catch(function (err) {
                notify.error(err.message);
            });
            promise.then(function () {
                $location.path('/maps/analysis');
            });
        };

    });

});
