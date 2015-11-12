define([
    'connecta.maps',
    'maps/layer-viewer-group/service/toolbar-service',
    'maps/layer-viewer-group/service/group-layer-viewer-service'
], function (maps) {
    return maps.lazy.service('MenuService', function (mapsResources, ToolBarService, GroupLayerViewerService, $http) {

        this.addEvents = function () {
            var comboLayers = setInterval(function(){
                if(typeof angular.element(".combo_layers") != 'undefined'){
                    angular.element(".combo_layers").click();
                    clearInterval(comboLayers);
                }
            }, 5000);
            
            // aparecer/desaparecer menu de legenda
            angular.element("#button-legend").on("click", function () {
                angular.element(".legend").toggle();
            });
            
            // controle de zoom em área
            angular.element("#ico_find").on("click", function () {
                ToolBarService.toggleZoomArea();
            });
            
            // controle de zooom maximo nas layers
            angular.element("#ico_redimensionar_camada").on("click", function () {
                ToolBarService.zoomMapToMaxExtent();
            });
            
            // controle de informação
            angular.element("#ico_info").on("click", function () {
                ToolBarService.toggleInfo();
            });
            
            // controle de opacidade
            angular.element(".opacityRange").on("change", function (elem) {
                console.log("eleeeem range", elem);
                ToolBarService.setLayerOpacity(elem.currentTarget.title, parseFloat(elem.currentTarget.value/100));
            });
            
            // controle de quantos checkbox estão marcados para habilitar a funcionalidade de swipe
            angular.element(".combo_layers").on("click", function (elem) {
                
                // funcao de visibilidade de uma layer com sua respectiva legenda
                ToolBarService.layerVisibility(elem.currentTarget.value, elem.currentTarget.checked);
                
                var flag = 0;
                var layersActivas = [];
                objLayersFlag = [];

                // verificar quantas combos estao selecionadas
                for (var i = 0; i < angular.element(".combo_layers").length; i++) {

                    // se estiver selecionada
                    if (angular.element(angular.element(".combo_layers")[i]).is(':checked')) {
                        flag = 1 + flag;
                        objLayersFlag.push(elem.currentTarget.value);
                        layersActivas.push(angular.element(angular.element(".combo_layers")[i]).val());
                    }
                }
                
                // caso nenhum esteja selecionado, o fundo de legendas fica invisivel
                if (flag === 0) {
                    angular.element("#legendMap").css("display", "none");
                } else {
                    angular.element("#legendMap").css("display", "");
                }
                
                // caso exista 2 combos selecionadas, botão de swipe aparece != desaparece
                if (flag === 2) {
                    angular.element("#icon_swipe").css("display", "");
                } else {

                    ToolBarService.deactivateSwipe();
                    //css de icone ativo ou nao
                    angular.element("#icon_swipe").removeClass("icon_swipe_active");
                    angular.element(".divisionSwipe").css("display", "none");
                    angular.element("#icon_swipe").css("display", "none");
                }

            });

            // verificar e executar o Swipe
            angular.element("#icon_swipe").on("click", function () {
                if (angular.element("#icon_swipe").hasClass("icon_swipe_active")) {
                    ToolBarService.deactivateSwipe();
                } else {

                    // chama a funcao de toggle para o controle de swipe
                    ToolBarService.activateSwipe(objLayersFlag[0], objLayersFlag[1]);
                }

                //css de icone ativo ou nao
                angular.element("#icon_swipe").toggleClass("icon_swipe_active");

            });
        };

        this.createMenu = function (divName, layerConfig) {
            var that = this;
            var elem = "";
            var temp = setInterval(function () {
                for (var config in layerConfig) {
                    console.log("ahusuasuhahusas", layerConfig[config]);
                    elem = '<p><input type="checkbox" id="' + layerConfig[config].layerEntity.nm_layer + '" class="combo_layers" style="margin: -5px 0px 5px 15px;" value="' + layerConfig[config].nm_viewer + '"/>   ' + layerConfig[config].nm_viewer;
                    elem += '<input type="range" title="' + layerConfig[config].nm_viewer + '"class="opacityRange" min="0" max="100" step="5" value="100" style="margin-left: 15px; width: 200px;"/></p>';
                    angular.element(".legend").append(elem);
                }

                //setar os eventos do menu
                that.addEvents();
                clearInterval(temp);
            }, 100);
        };

        this.renderMenu = function (layerViewerConfig, mapComponent) {
            console.log("layer menu config", layerViewerConfig);
            ToolBarService.setMap(mapComponent);

//            this.__layerViewerType = layerViewerConfig.layerViewer.layerViewerTypeEntity.id;           
            this.__layerViewerType = 3;
            this.__element = document.createElement('div');
            this.__element.id = layerViewerConfig[0].ds_param_values.replace(/ /gi, "") + 'MENU';
            document.getElementById("map-view").appendChild(this.__element);
            angular.element("#" + this.__element.id).load('app/maps/layer-viewer-group/template/menu_template.html');

            this.createMenu(this.__element.id, layerViewerConfig);
        };

    });

});