module.exports = function(grunt) {

  var backend = grunt.option('backend');

  grunt.log.debug(grunt.template.process('[CONNECTA] Backend set to: <%= backend %>', {
    data: {
      backend: backend
    }
  }));

  grunt.initConfig({
    jshint: {
      jshintrc: '.jshintrc',
      files: ['app/**/*.js']
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'assets/scss',
          src: ['**/**.scss'],
          dest: 'assets/css',
          ext: '.css'
        }]
      }
    },
    template: {
      'process-html-template': {
        options: {
          data: {
            backend: backend
          }
        },
        files: {
          'dist/app/connecta.js': ['app/connecta.js']
        }
      }
    },
    connect: {
      server: {
        keepalive: true,
        options: {
          keepalive: true,
          port: 9001,
          base: 'dist'
        }
      }
    },
    copy: {
        dist: {
            src: 'app/**',
            dest: 'dist/app/**'
        }
    }
  });


  // htmlmin: {
  //   dist: {
  //     options: {
  //       collapseWhitespace: true,
  //       conservativeCollapse: true,
  //       collapseBooleanAttributes: true,
  //       removeCommentsFromCDATA: true,
  //       removeOptionalTags: true
  //     },
  //     files: [{
  //       expand: true,
  //       cwd: '<%= yeoman.dist %>',
  //       src: ['*.html', 'views/{,*/}*.html'],
  //       dest: '<%= yeoman.dist %>'
  //     }]
  //   }
  // },


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['jshint', 'sass', 'template']);
  grunt.registerTask('serve', ['default', 'connect:server']);
};
