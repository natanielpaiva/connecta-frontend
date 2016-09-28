define([
    'connecta.maps'
], function (maps) {

    var container, content, itemWidth, containerWidth, element;

    function MenuCarrousel($scope) {
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
        container = $('.carrousel-container', element);
        content = $('.carrousel-content', element);
        itemWidth = $(':first', content).outerWidth();

        if(this.moving) return;
        this.moving = true;
        containerWidth = container.width();

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
                itemTemplateUrl: '=',
                enabled: '=',
                enableCheck: '='
            },
            link: function link(scope, el){
                element = el;
            },
            controller: MenuCarrousel
        };
    });
});
