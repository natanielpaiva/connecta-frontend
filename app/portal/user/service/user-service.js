define([
  'connecta.portal'
], function(portal){
  portal.lazy.service('UserService', function($http, portalResources){

    this.updateUser = function(user, userImg){
      var url = portalResources.user + '/upload';

      var fd = new FormData();
      fd.append('image', userImg);
      fd.append('user', JSON.stringify(user));

      return $http.post(url, fd, {
        headers: {'Content-Type': undefined}
      });
    };
    
    this.save = function(user, image){
        var url = portalResources.user + '/upload';

      var fd = new FormData();
      fd.append('image', image);
      fd.append('user', JSON.stringify(user));

      return $http.post(url, fd, {
        headers: {'Content-Type': undefined}
      });
    };

  });
});