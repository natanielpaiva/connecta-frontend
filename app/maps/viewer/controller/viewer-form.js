define([
    'connecta.maps',
    '../service/viewer-service',
    '../../project/service/project-service',
    '../../datasource/service/datasource-service'
], function (maps) {

    return maps.lazy.controller('ViewerFormController', function ($scope, $location, $routeParams, MapsViewerService, ProjectService, DatasourceService, notify) {

        $scope.viewer = {
            popupConfig: {
                enabled: false,
                positioning: 'tooltip'
            },
            allowDrill: false,
            richLayersInfo: []
        };

        $scope.valueTypeMap = {
            'string': 'VIEWER.TYPE_STRING',
            'number': 'VIEWER.TYPE_NUMBER',
            'date': 'VIEWER.TYPE_DATE',
            'disabled': 'VIEWER.TYPE_DISABLED'
        };

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

        function checkEditing() {
            if ($routeParams.id) {
                $scope.isEditing = true;
                MapsViewerService.get($routeParams.id)
                    .catch(function (err) {
                        notify.error(err.statusText);
                    })
                    .then(function (response) {
                        try {
                            var viewer = response.data;
                            $scope.viewer = {
                                _id: viewer._id,
                                title: viewer.title,
                                initialRichLayerId: viewer.initialRichLayerId,
                                allowDrill: viewer.allowDrill,
                                popupConfig: viewer.popupConfig,
                                richLayersInfo: viewer.richLayersInfo,
                                projectId: viewer.projectId
                            };
                            var project = $scope.projects.filter(function (project) {
                                return project._id === viewer.projectId;
                            });

                            if (project.length) {
                                $scope.selectedProject = project[0];
                            }

                            var richLayer = $scope.selectedProject.richLayers.filter(function (richLayer) {
                                return richLayer._id === $scope.viewer.initialRichLayerId;
                            });

                            $scope.prepareProject($scope.selectedProject);

                            if (richLayer.length) {
                                richLayer = richLayer[0];
                                $scope.selectedRichLayer = richLayer;
                                $scope.richLayerModel = richLayer;
                                $scope.richLayerModel.outFields = [];
                                populateMetadataFields(richLayer);
                            }
                        } catch (err) {
                            notify.error(err.statusText);
                        }
                    });
            }
        }

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

        $scope.invalidOutFields = function () {
            var invalid = false;
            $scope.viewer.richLayersInfo.forEach(function (richLayerInfo) {
                if (!richLayerInfo.outFields.length) {
                    invalid = true;
                }
            });
            return invalid;
        };

        $scope.prepareProject = function (project) {
            $scope.viewer.projectId = project._id;
            $scope.viewer.richLayersInfo = $scope.viewer.richLayersInfo || [];
            project.richLayers.forEach(function (richLayer) {
                var filter = $scope.viewer.richLayersInfo.filter(function (richLayerInfo) {
                    return richLayerInfo.richLayerId === richLayer._id;
                });
                if (!filter.length) {
                    $scope.viewer.richLayersInfo.push({
                        richLayerId: richLayer._id,
                        outFields: []
                    });
                }
            });
        };

        $scope.selectRichLayer = function (richLayer) {
            if (!richLayer) {
                return;
            }
            $scope.richLayer = richLayer;
            $scope.richLayerModel = $scope.viewer.richLayersInfo.filter(function (richLayerInfo) {
                return richLayerInfo.richLayerId === $scope.richLayer._id;
            })[0];
            populateMetadataFields(richLayer);
        };

        function populateMetadataFields(richLayer) {
            if (!richLayer) {
                return;
            }
            var promise;
            if ($scope.selectedProject.serviceType === 'obiee') {
                // TODO Implementar consumo do OBIEE
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
            $scope.outField = Object.assign({}, $scope.richLayerModel.outFields[outfieldIndex]);
            $scope.outFieldEditIndex = outfieldIndex;
            $scope.dataSourceColumns.forEach(function (column) {
                if (column.name === $scope.outField.name) {
                    $scope.selectedColumn = column;
                }
            });
        };

        $scope.deleteOutField = function () {
            $scope.richLayerModel.outFields.splice($scope.outFieldEditIndex, 1);
            delete $scope.outFieldEditIndex;
            delete $scope.outField;
        };

        $scope.saveOutField = function () {
            $scope.outField.alias = $scope.outField.alias || $scope.selectedColumn.alias;
            $scope.outField.name = $scope.outField.name || $scope.selectedColumn.name;
            if ($scope.outFieldEditIndex !== undefined) {
                $scope.richLayerModel.outFields.splice($scope.outFieldEditIndex, 1, $scope.outField);
            } else {
                $scope.richLayerModel.outFields.push($scope.outField);
            }
            delete $scope.outFieldEditIndex;
            delete $scope.outField;
        };

        $scope.cancelOutField = function () {
            delete $scope.outField;
        };

        $scope.backRichLayer = function () {
            delete $scope.richLayer;
        };

        $scope.saveViewer = function () {
            var promise;

            $scope.viewer.viewContext = $scope.selectedProject.serviceType;

            if (!$scope.isEditing) {
                promise = MapsViewerService.save($scope.viewer);
            } else {
                promise = MapsViewerService.update($scope.viewer._id, $scope.viewer);
            }
            promise.catch(function (err) {
                notify.error('VIEWER.SAVE_ERROR');
            });
            promise.then(function () {
                $location.path('/maps/viewer');
                notify.success('VIEWER.SAVE_SUCCESS');
            });
        };

    });

});
