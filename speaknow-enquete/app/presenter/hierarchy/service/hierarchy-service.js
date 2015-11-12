define([
    'connecta.presenter'
], function(presenter){
    return presenter.lazy.service("HierarchyService", function(presenterResources, $http){
        
        
       this.save = function(hierarchy){
            var url = presenterResources.hierarchy;
            return $http.post(url, hierarchy );
        };
        
        this.getById = function(id){
            var url = presenterResources.hierarchy +'/'+id;
            return $http.get(url);
        };
        
        //lista os itens de uma hierarquia.
        this.getItems = function(id){
            var url = presenterResources.hierarchyItem+'/'+id;
            return $http.get(url);
        };
        
        this.list = function(){
            var url = presenterResources.hierarchy;
            return $http.get(url);
        };
        
       
        
        
        this.saveHierarchyItem = function(scope, idItemParent){
            var url = presenterResources.hierarchy + '/save-hierarchy-item/' + idItemParent;
           return $http.post(url, scope); 
        };
        
        this.updateHierarchyItem = function(scope){
            var url = presenterResources.hierarchy + '/updade-hierarchy-item/';
           return $http.post(url, scope); 
        };
        
        
         //excluir hierarquia e todos seus filhos
        this.excluir = function(id){
            var url = presenterResources.hierarchy + '/'+id;
            return $http.delete(url);
        };
        
         //excluir item de uma hieraquia
        this.excluirItem = function(id){
            var url = presenterResources.hierarchy + '/excluir-hierarchy-item/'+id;
            return $http.delete(url);
        };
    });
});