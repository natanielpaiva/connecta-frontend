define([
    'connecta.maps',
    'maps/layer-viewer/service/toolbar-service'
], function (maps) {
    return maps.lazy.service('MenuService', function (mapsResources, ToolBarService, $http) {
        
        



        this.addEvents = function (elementId) {

            //MENU INTEIRO LATERAL DIREITA;
            angular.element('#' + elementId).find('#link-active-bar').on('click', function () {

                //ESCONDER TODOS OS SUB-MENU's
                angular.element('#' + elementId).find('.menu-right-nivel-2').css("display", "none");
                var menuRigth = angular.element('#' + elementId).find('#menu-right');
                if (menuRigth.hasClass('menu-right-off')) {
                    menuRigth.removeClass('menu-right-off').addClass('menu-right-on');
                    
                } else {
                    //desativa tudo que que esta selecionado CSS
                    menuRigth.removeClass('menu-right-on').addClass('menu-right-off');
                    angular.element('#' + elementId).find('.tool-active').removeClass('tool-active');
                    angular.element('#' + elementId).find('.submenu-active').removeClass("submenu-active");                    
                }

            });
            //DESATIVAR CSS DE ICONE DE MENU ATIVO
            angular.element('#' + elementId).find('.item-menu-right').on('click', function (elementMenu) {

                //ESCONDER TODOS OS SUB-MENU's
                angular.element('#' + elementId).find('.menu-right-nivel-2').css("display", "none");
                if (angular.element('#' + elementId).find('#' + elementMenu.currentTarget.id).hasClass('tool-active')) {
                    angular.element('#' + elementId).find('#' + elementMenu.currentTarget.id).removeClass('tool-active');
                } else {
                    //desativa o botao CSS
                    angular.element('#' + elementId).find('.tool-active').removeClass('tool-active');
                    angular.element('#' + elementId).find('.submenu-active').removeClass("submenu-active");
                    angular.element('#' + elementId).find('.link-sub-nivel-2-active').removeClass('link-sub-nivel-2-active');
                    //ativa o botao CSS do clique
                    elementMenu.currentTarget.className = 'tool-active item-menu-right';
                }
            });
            //DESATIVAR CSS DE INCONE DO SUB MENU ATIVO
            angular.element('#' + elementId).find('.link-sub-nivel-2').on('click', function (elementSubMenu) {
                if (angular.element('#' + elementId).find('#' + elementSubMenu.currentTarget.id).hasClass('link-sub-nivel-2-active')) {
                    angular.element('#' + elementId).find('#' + elementSubMenu.currentTarget.id).removeClass('link-sub-nivel-2-active');
                } else {
                    //desativa o botao CSS
                    angular.element('#' + elementId).find('.link-sub-nivel-2-active').removeClass('link-sub-nivel-2-active');
                    //ativa o botao CSS do clique
                    elementSubMenu.currentTarget.className = 'link-sub-nivel-2 link-sub-nivel-2-active';
                }
            });
            angular.element('#' + elementId).find('.sub-item').on('click', function (obj) {

                var idSubMenu = angular.element(angular.element('#' + elementId).find('#' + obj.currentTarget.id).parent()).find('div').attr('id');
                if (angular.element('#' + elementId).find('#' + idSubMenu).hasClass("submenu-active")) {
                    angular.element('#' + elementId).find('#' + idSubMenu).removeClass("submenu-active");
                    angular.element('#' + elementId).find('#' + idSubMenu).css("display", "none");
                } else {
                    angular.element('#' + elementId).find('#' + idSubMenu).addClass("submenu-active");
                    angular.element('#' + elementId).find('#' + idSubMenu).css("display", "block");
                }

            });
        };


        this.addSubMenuItemAction = function (itemType, itemID, action, param) {            
            if (itemType == "img") {
                angular.element('#' + itemID).click(function () {
                    ToolBarService[action](param);
                });

            } else {
                angular.element('#' + itemID).val(param);
                angular.element('#' + itemID).on('input change', function () {
                    ToolBarService[action](document.getElementById(itemID).value);
                });

            }

        };


        this.addMenuItemAction = function (itemID, action) {
            var that = this;
            angular.element('#' + itemID).click(function () {
                ToolBarService.__mapName = that.__mapName;
                ToolBarService[action]();
            });
        };

        this.addSubMenuItem = function (itemID, elem, item) {
            elem.innerHTML += "<div class='menu-right-nivel-2 sub-menu' id='" + item.id + "'><ul></ul></div>";
            var subMenuItems = item.items;
            var action = item.action;
            var subMenuId = item.id;
            var subItemId = "";
            var itemType = item.type;
            var subItemParam = "";
            for (var itemObj in subMenuItems) {

                subItemId = itemID + '_' + subMenuItems[itemObj].id;
                var li = document.createElement("li");

                angular.element("#" + subMenuId + ">ul").append(li);

                if (itemType == "img") {
                    subItemParam = subMenuItems[itemObj].param;
                    li.innerHTML = "<a  id = '" + subItemId + "'  class='link-sub-nivel-2' style='cursor:pointer;'>\n\<img src = '" + subMenuItems[itemObj].img + "' alt = 'ico_" + subMenuItems[itemObj].id + "' style='cursor:pointer;'> " + subMenuItems[itemObj].span + "</a>";
                } else {
                    subItemParam = subMenuItems[itemObj].max;
                    li.innerHTML = "<span>" + subMenuItems[itemObj].span + "</span>\n\<input id = '" + subItemId + "' type=range min='" + subMenuItems[itemObj].min + "' max='" + subMenuItems[itemObj].max + "' step='" + subMenuItems[itemObj].step + "' class='range-maps'/>";
                }

                this.addSubMenuItemAction(itemType, subItemId, action, subItemParam);


            }

        };





        this.addMenuItem = function (divName, elem, item) {
            var itemID = "";
            if (typeof item.items != 'undefined') {                
                itemID = divName + '_' + item.span;
                elem.innerHTML = "<a id='" + itemID + "' class='item-menu-right sub-item ' style='cursor:pointer;'>\n\<img src='" + item.img + "' 'ico_" + item.id + "'></a>";
                this.addSubMenuItem(itemID, elem, item);
            } else {
                itemID = divName + '_' + item.id;
                elem.innerHTML = "<a  id = '" + itemID + "' class = 'item-menu-right' style='cursor:pointer;'>\n\<img src = '" + item.img + "' alt = 'ico_" + item.id + "'></a>";
                //define evento para o item do menu
                this.addMenuItemAction(itemID, item.action);
            }

        };


        this.createMenu = function (divName) {
            var that = this;
            var li = "";
            $http.get('app/maps/layer-viewer/template/menu.json').success(function (data) {
                
                //$.getJSON("app/maps/layer-viewer/template/menu.json", function (data) {
                    

                for (var elem in data.menuItems) {

                    if (typeof data.menuItems[elem].id != 'undefined') {                                                
                        li = document.createElement('li');
                        angular.element('#' + divName).find('#menu-right-data>ul').append(li);
                        that.addMenuItem(divName, li, data.menuItems[elem]);

                    }

                }

                if (that.__layerViewerType == 1) {
                    var defaultViewerItems = data.menuItems[data.menuItems.length - 1].defaultViewerItems;
                    li = "";
                    for (var obj in defaultViewerItems) {
                        li = document.createElement('li');
                        angular.element('#' + divName).find('#menu-right-data>ul').append(li);
                        that.addMenuItem(divName, li, defaultViewerItems[obj]);
                    }
                }
                
                
                 that.addEvents(that.__element.id);
            });
        };

        this.renderMenu = function (layerViewerConfig, mapComponent) {
            
            ToolBarService.setMap(mapComponent);

            this.__layerViewerType = layerViewerConfig.layerViewer.layerViewerTypeEntity.id;           
            this.__element = document.createElement('div');
            this.__element.id = layerViewerConfig.name.replace(/ /gi, "") + 'MENU';
            document.getElementById("map-view").appendChild(this.__element);
            angular.element("#" + this.__element.id).load('app/maps/layer-viewer/template/menu_template.html');
            
            this.createMenu(this.__element.id);
        };




    });

});