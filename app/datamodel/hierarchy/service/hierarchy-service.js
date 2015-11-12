define([
    'connecta.datamodel'
], function(datamodel){
    return datamodel.lazy.service("HierarchyService", function(datamodelResources, $http){
        
        
       this.save = function(hierarchy){
            var url = datamodelResources.hierarchy;
            return $http.post(url, hierarchy );
        };
        
        this.getById = function(id){
            var url = datamodelResources.hierarchy +'/'+id;
            return $http.get(url);
        };
        
        //lista os itens de uma hierarquia.
        this.getItems = function(id){
            var url = datamodelResources.hierarchyItem+'/'+id;
            return $http.get(url);
        };
        
        this.list = function(){
            var url = datamodelResources.hierarchy;
            return $http.get(url);
        };
        
       
        
        
        this.saveHierarchyItem = function(scope, idItemParent){
            var url = datamodelResources.hierarchy + '/save-hierarchy-item/' + idItemParent;
           return $http.post(url, scope); 
        };
        
        this.updateHierarchyItem = function(scope){
            var url = datamodelResources.hierarchy + '/updade-hierarchy-item/';
           return $http.post(url, scope); 
        };
        
        
         //excluir hierarquia e todos seus filhos
        this.excluir = function(id){
            var url = datamodelResources.hierarchy + '/'+id;
            return $http.delete(url);
        };
        
         //excluir item de uma hieraquia
        this.excluirItem = function(id){
            var url = datamodelResources.hierarchy + '/excluir-hierarchy-item/'+id;
            return $http.delete(url);
        };
    });
});