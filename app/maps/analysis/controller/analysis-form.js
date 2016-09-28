define([
    'connecta.maps',
    '../service/analysis-service',
    '../../project/service/project-service',
    '../../datasource/service/datasource-service'
], function (maps) {

    return maps.lazy.controller('AnalysisFormController', function ($scope, $location, $routeParams, AnalysisService, ProjectService, DatasourceService, notify) {

        init();

        function init() {
            var promise = loadProjects();
            promise.catch(function (err) {
                console.error(err);
            });
            promise.then(function () {
                checkEditing();
            });
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
                        notify.error(err.statusText);
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
                                projectId: analysis.projectId
                            };
                            var project = $scope.projects.filter(function (project) {
                                return project._id === analysis.projectId;
                            });

                            if (project.length) {
                                $scope.selectedProject = project[0];
                            }

                            var richLayer = $scope.selectedProject.richLayers.filter(function (richLayer) {
                                return richLayer._id === $scope.analysis.richLayerId;
                            });
                            if (richLayer.length) {
                                richLayer = richLayer[0];
                                $scope.selectedRichLayer = richLayer;
                                populateMetadataFields(richLayer);
                            }
                        } catch (err) {
                            notify.error(err.statusText);
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
            return new Promise(function (resolve, reject) {
                try {
                    ProjectService.list('?size=*')
                        .catch(function (err) {
                            reject(err);
                        })
                        .then(function (response) {
                            $scope.projects = response.data.content;
                            resolve();
                        });
                } catch (err) {
                    reject(err);
                }
            });
        }

        $scope.projectChanged = function (projectId) {
            $scope.analysis.projectId = projectId;
        };

        $scope.richLayerChanged = function (richLayer) {
            if (!richLayer) {
                delete $scope.analysis.richLayerId;
                return;
            }
            $scope.analysis.richLayerId = richLayer._id;
            populateMetadataFields(richLayer);
        };

        function populateMetadataFields(richLayer) {
            if (!richLayer) {
                return;
            }
            var promise;
            if ($scope.selectedProject.serviceType === 'obiee') {
                // promise = DatasourceService.getCa(richLayer.info.analysisId);
                // promise.then(function (response) {
                //     if (!response) {
                //         return notify.error('Não foi possível obter resposta do servidor.');
                //     }
                //     $scope.dataSourceColumns = response;
                // });
            } else if ($scope.selectedProject.serviceType === 'connecta') {
                promise = DatasourceService.getAnalysisConnecta(richLayer.dataSourceIdentifier);
                promise.then(function (response) {
                    try {
                        $scope.dataSourceColumns =  [];
                        var metadata = response.data;
                        if (metadata.analysisColumns && metadata.analysisColumns.length) {
                            metadata.analysisColumns.forEach(function (column) {
                                $scope.dataSourceColumns.push({name: column.name, alias: column.label});
                            });
                        }
                    } catch (err) {
                        console.error(err);
                    }
                });
            }
            promise.catch(function (err) {
                notify.error(err.statusText);
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
            $scope.dataSourceColumns.forEach(function (column) {
                if (column.name === $scope.outField.name) {
                    $scope.selectedColumn = column;
                }
            });
        };

        $scope.deleteOutField = function () {
            $scope.analysis.outFields.splice($scope.outFieldEditIndex, 1);
            delete $scope.outFieldEditIndex;
            delete $scope.outField;
        };

        $scope.saveOutField = function () {
            $scope.outField.alias = $scope.outField.alias || $scope.selectedColumn.alias;
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

        $scope.saveAnalysis = function () {
            var promise;
            if (!$scope.isEditing) {
                promise = AnalysisService.save($scope.analysis);
            } else {
                promise = AnalysisService.update($scope.analysis._id, $scope.analysis);
            }
            promise.catch(function (err) {
                notify.error('ANALYSIS.SAVE_ERROR');
            });
            promise.then(function () {
                $location.path('/maps/analysis');
                notify.info('ANALYSIS.SAVE_SUCCESS');
            });
        };

    });

});
