module.exports = function(grunt) {

  var backend = grunt.option('backend');

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
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      },
    },
    copy: {
      dist: {
        src: [
          '**',
          '!node_modules/**',
          '!**/scss/**',
          '!test/**',
          '!nbproject/**',
          '!dist/**',
          '!bower.json',
          '!package.json',
          '!new-module.sh',
          '!Gruntfile.js'
        ],
        dest: 'dist/',
        expand: true
      }
    },
    /*template: {
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
    },*/
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },
    connect: {
      production: {
        options: {
          keepalive: true,
          port: 9001,
          base: 'dist'
        }
      },
      dev: {
        options: {
          keepalive: true,
          port: 9001,
          base: '.'
        }
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  //grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['jshint', 'sass', 'copy', 'template']);
  grunt.registerTask('test', ['default', 'karma']);
  grunt.registerTask('run-prod', ['default', 'connect:production']);
  grunt.registerTask('run', ['jshint', 'sass', 'connect:dev', 'watch']);
};
