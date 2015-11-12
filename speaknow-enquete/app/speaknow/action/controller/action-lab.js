define([
    'connecta.speaknow',
    'speaknow/action/service/action-service'
], function (speaknow) {

    var json = {"id": 28, "name": "Serviço de consulta", "description": null, "type": "SERVICE", "image": null, "icon": "open-book", "steps": [{"id": 27, "name": "Teste", "title": null, "value": "return email;", "index": 0, "type": "POLL", "sections": [{"id": 27, "title": "Dados", "footer": null, "params": [{"id": 136, "tag": "teste", "title": "Nome", "name": "name", "type": "TEXT", "value": null, "file": null, "options": []}, {"id": 140, "tag": "file", "title": "File", "name": "file", "type": "IMAGE", "value": null, "file": null, "options": []}]}, {"id": 28, "title": "Parametros", "footer": null, "params": [{"id": 137, "tag": "teste", "title": "Email", "name": "email", "type": "EMAIL", "value": null, "file": null, "options": []}]}], "returns": null}], "interactionHistory": null, "interaction": {"id": 33, "name": "Primeira Interaction Edited", "type": "SERVICE", "description": "ServiÃ§os Diversos", "link": null, "questionSeparator": null, "answerSeparator": null, "webFormUrl": null, "created": 1427394256786, "lastExecution": null, "active": null, "allContacts": null, "monitorHashtag": null, "icon": "webservice", "image": "logo_mimimi.png", "isSelected": null, "contacts": null, "company": {"@id": 1, "id": 1, "name": "Demo Company", "address": "Belo Horizonte", "imageQuad": "", "imageRect": "", "type": "Governo", "percentPositive": 80.0, "percentNegative": 20.0, "group": null, "companyProducts": null, "openHours": null, "children": null, "parents": null, "user": null, "companyContact": null, "interactions": null}, "networks": null, "questions": null, "clientMessages": null, "actions": [{"id": 28, "name": "ServiÃ§o de consulta", "description": null, "type": "SERVICE", "image": null, "icon": "open-book", "steps": [{"id": 27, "name": "Teste", "title": null, "value": "return email;", "index": 0, "type": "POLL", "sections": [{"id": 27, "title": "Dados", "footer": null, "params": [{"id": 136, "tag": "teste", "title": "Nome", "name": "name", "type": "TEXT", "value": null, "file": null, "options": []}, {"id": 140, "tag": "file", "title": "File", "name": "file", "type": "IMAGE", "value": null, "file": null, "options": []}]}, {"id": 28, "title": "Parametros", "footer": null, "params": [{"id": 137, "tag": "teste", "title": "Email", "name": "email", "type": "EMAIL", "value": null, "file": null, "options": []}]}], "returns": null}], "interactionHistory": null, "products": null}]}, "products": null};
    
    return speaknow.lazy.controller('ActionTestController', function (
            $scope, $upload, speaknowResources, ActionService) {
        
        ActionService.get(28).success(function(response){
            $scope.action = response;
            
            //Text
            $scope.action.steps[0].sections[0].params[0].value = 'Texto';
            //IMAGE
//            $scope.action.steps[0].sections[0].params[1];
            //email
            $scope.action.steps[0].sections[1].params[0].value = 'cajazinho@avela.com';
        });

        $scope.viewThumb = function (files) {
            if (files.length) {
                $scope.image = files[0];
                $scope.action.steps[0].sections[0].params[1].value = files[0].name;
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.imgDataUrl = e.target.result;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };


        $scope.send = function () {
            $upload.upload({
                url: 'http://localhost:7002/speaknow-batch/action/execution-multipart',
                file: $scope.image,
                data: $scope.action,
                fileName: $scope.image.name
            });
        };
    });
});