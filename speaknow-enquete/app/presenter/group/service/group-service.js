define([
     'connecta.presenter',
     'portal/layout/service/autocomplete'
], function(presenter) {

     return presenter.lazy.service('GroupService', function(presenterResources, $http, $autocomplete) {
          var types = [{
               id: 'FOLDER',
               name: 'FOLDER',
          }, {
               id: 'GALLERY',
               name: 'GALLERY',
          }];

          var typeFilter = [{
               id: 'GROUP.SELECT_FILE',
               name: 'GROUP.SELECT_FILE',
               template: '_group-select-file.html'
          }, {
               id: 'GROUP.FILTER',
               name: 'GROUP.FILTER',
               template: '_group-select.html'
          }];

          var predicateMap = {
               EQUAL: {
                    name: '='
               },
               NOT_EQUAL: {
                    name: "!="
               },
               LIKE: {
                    name: 'Like'
               },
               NOT_LIKE: {
                    name: "Not Like"
               },
               IN: {
                    name: 'IN'
               },
               NOT_IN: {
                    name: "Not IN"
               },
               BETWEEN: {
                    name: 'Between'
               },
               NOT_BETWEEN: {
                    name: "Not Between"
               }
          };

          var operatorMap = {
               AND: {
                    name: 'AND'
               },
               OR: {
                    name: "OR"
               }
          };

          var _fixQueryBuilder = function(statement, edit) {

               if (statement.type == 'CONDITION') {

                    if (statement.predicate === 'EQUAL' ||
                         statement.predicate === 'NOT_EQUAL' ||
                         statement.predicate === 'LIKE' ||
                         statement.predicate === 'NOT_LIKE') {

                         statement.value = agreementValueString(statement.value, edit);
                    }

                    if (statement.predicate === 'BETWEEN' ||
                         statement.predicate === 'NOT_BETWEEN') {
                         statement.value = agreementValueObject(statement.value, edit);
                    }

                    if (statement.predicate === 'IN' ||
                         statement.predicate === 'NOT_IN') {
                         statement.value = agreementValueArray(statement.value, edit);
                    }

               } else {
                    var key;
                    if (statement.statement !== undefined) {
                         for (key in statement.statement.statements) {
                              _fixQueryBuilder(statement.statement.statements[key]);
                         }
                    } else {
                         for (key in statement.statements) {
                              _fixQueryBuilder(statement.statements[key], edit);
                         }
                    }
               }

          };

          var agreementValueString = function(value, edit) {
               var retorno = {
                    "value": value,
                    "between": {},
                    "in": []
               };
               if (edit) {
                    retorno = value.value;
               }
               return retorno;
          };

          var agreementValueObject = function(value, edit) {

               var retorno = {
                    "value": "",
                    "between": value,
                    "in": []
               };
               if (edit) {
                    retorno = {"start": value.between.start, "end": value.between.end};
               }
               return retorno;

          };

          var agreementValueArray = function(value, edit) {
               var valueArray = [];
               for (var i in value) {
                    valueArray.push(value[i].text);
               }
               return {
                    "value": "",
                    "between": {},
                    "in": valueArray
               };
          };


          var _fixGroup = function(group) {
               group.singleSourceGroup = [];
               group.type = group.type.id;
               for (var numOrder in group.singleSource.lists.singleSourceSet) {
                    if (group.singleSource.lists.singleSourceSet[numOrder]
                         .idSingleSourceGroup !== undefined) {
                         group.singleSourceGroup.push({
                              "numOrder": numOrder,
                              "id": group.singleSource.lists.singleSourceSet[numOrder].idSingleSourceGroup,
                              "singleSource": {
                                   "id": group.singleSource.lists.singleSourceSet[numOrder].id
                              }
                         });

                    } else {
                         group.singleSourceGroup.push({
                              "numOrder": numOrder,
                              "singleSource": {
                                   "id": group.singleSource.lists.singleSourceSet[numOrder].id
                              }
                         });
                    }
               }


               delete group.singleSource;
               delete group.typeFilter;
               delete group.path;
          };

          this.formatQueryBuiderEdit = function(query) {
               _fixQueryBuilder(query.statement, true);
               return query;
          };

          this.getSingleSource = function(value) {
               return $autocomplete(presenterResources.singlesource + "/auto-complete", {
                    name: value
               }).then(function(response) {
                    return response.data.map(function(item) {
                         return item;
                    });
               });
          };

          this.getAttribute = function(value) {
               return $autocomplete(presenterResources.attribute, {
                    name: value
               }).then(function(response) {
                    return response.data.map(function(item) {
                         return item;
                    });
               });
          };


          this.getTypes = function() {
               return types;
          };

          this.getPredicate = function() {
               return predicateMap;
          };

          this.getOperator = function() {
               return operatorMap;
          };

          this.getTypeFilter = function() {
               return typeFilter;
          };


          this.list = function() {
               var url = presenterResources.group;
               return $http.get(url);
          };

          this.delete = function(id) {
               var url = presenterResources.group + '/' + id;
               return $http.delete(url);
          };

          this.getById = function(id) {
               var url = presenterResources.group + '/' + id;
               return $http.get(url);
          };

          this.getFileById = function(id) {
               return presenterResources.singlesource + '/' + id + '/binary';
          };

          this.getSingleSourceById = function(id) {
               var url = presenterResources.singlesource + "/" + id;
               return $http.get(url);
          };

          this.getGroupBySingleSourceId = function(id) {
               var url = presenterResources.group + "/single-source/" + id;
               return $http.get(url);
          };

          this.getQueryById = function(id) {
               var url = presenterResources.group + "/query/" + id;
               return $http.get(url);
          };

          this.saveQueryBuilder = function(query) {
               var queryBuilder = angular.copy(query);
               var urlSaveQuery = presenterResources.group + "/query";

               _fixQueryBuilder(queryBuilder);
               return $http.post(urlSaveQuery, queryBuilder);
          };


          this.save = function(group) {

               var groupCopy = angular.copy(group);

               _fixGroup(groupCopy);
               var url = presenterResources.group;

               if (group.id === undefined) {
                    return $http.post(url, groupCopy);
               } else {
                    return $http.put(url + "/" + group.id, groupCopy);
               }

          };

          this.getResultQueryBuilder = function(query, edit) {
               var queryPersist = angular.copy(query);
               _fixQueryBuilder(queryPersist, edit);
               var url = presenterResources.group + "/query/result";
               return $http.post(url, queryPersist);
          };

     });



});
