define([
    'connecta.maps'
], function (maps) {

    var container, content, itemWidth, containerWidth;

    function MenuCarrousel($scope) {
        console.log($scope);

        var self = this;
        self.moving = false;

        self.next = function(){
            self.move(true);
        };

        self.previous = function(){
            self.move();
        };
    }

    MenuCarrousel.prototype.move = function(back){
        if(this.moving) return;
        this.moving = true;

        var currentLeft = content.position().left;
        var max = Math.abs(currentLeft) + containerWidth;

        if(currentLeft > 0 && !back){
            this.animate(0);
        }else if(max > content.width() && back){
            this.onMoveCompleted();
        }else{
            var operator = back ? '-=' : '+=';
            this.animate(operator + itemWidth);
        }
    };

    MenuCarrousel.prototype.animate = function(left){
        content.animate({left: left},{
            complete: this.onMoveCompleted.bind(this)
        });
    };

    MenuCarrousel.prototype.onMoveCompleted = function () {
        this.moving = false;
    };

    return maps.lazy.directive('menuCarrousel', function(){
        return {
            restrict: 'AE',
            templateUrl: 'app/maps/project/directive/template/menu-carrousel.html',
            controllerAs: '$ctrl',
            scope:{
                items: '=',
                itemTemplateUrl: '='
            },
            link: function link(scope, element){
                container = $('.carrousel-container', element);
                content = $('.carrousel-content', element);
                itemWidth = $(':first', content).outerWidth();
                containerWidth = container.width();

                scope.$watch(scope.items, function(){
                    if(scope.items){
                        itemWidth = $(':first', content).outerWidth();
                        containerWidth = container.width();
                    }
                });
            },
            controller: MenuCarrousel
        };
    });
});