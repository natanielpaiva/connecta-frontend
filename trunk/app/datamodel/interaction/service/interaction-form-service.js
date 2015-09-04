define([
    'connecta.datamodel'
], function (datamodel) {

    return datamodel.lazy.service('InteractionFormService', function (datamodelResources, $http) {

        this.getTypeFields = function () {
            return [
                {
                    name: 'Text',
                    value: 'text'
                },
                {
                    name: 'Radio Buttons',
                    value: 'radio'
                },
                {
                    name: 'Checkbox',
                    value: 'checkbox'
                },
                {
                    name: 'Select',
                    value: 'select'
                }
            ];
        };

        this.getDomains = function () {
            return [
                {
                    name: 'Domain 1',
                    
                    columns: [
                        {name:'Column 1 1', isColumn: true},
                        {name:'Column 1 2', isColumn: true},
                        {name:'Column 1 3', isColumn: true}
                    ]
                },
                {
                    name: 'Domain 2',
                    isColumn: true,
                    columns: [
                        {name:'Column 2 1', isColumn: true},
                        {name:'Column 2 2', isColumn: true},
                        {name:'Column 2 3', isColumn: true}
                    ]
                },
                {
                    name: 'Domain 3',
                    isColumn: true,
                    columns: [
                        {name:'Column 3 1', isColumn: true},
                        {name:'Column 3 2', isColumn: true},
                        {name:'Column 3 3', isColumn: true}
                    ]
                }
            ];
        };
        
        this.save = function (interaction, fileImage) {
            var url = datamodelResources.interaction + "/save";
            var fd = new FormData();
            fd.append('image', fileImage);
            fd.append('interaction', JSON.stringify(interaction));
            return $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };
    });

});