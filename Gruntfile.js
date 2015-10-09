/* global require, module */

module.exports = function(grunt) {

  var port = grunt.option('port') || 9001;

  // Carrega as tasks do Grunt declaradas como dependência no package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    jshint: {
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
    clean: ['dist'],
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
          '!app/applications.json.dist',
          '!customs.json',
          '!new-module.sh',
          '!Gruntfile.js'
        ],
        dest: 'dist/',
        expand: true
      }
    },
    ngAnnotate: {
      dist:{
        files: [{
          expand: true,
          cwd: 'dist/app',
          src: '**/*.js',
          dest: 'dist/app'
        }]
      }
    },
    uglify: {
      dist: {
        options:{
	  compress:false,
          //sourceMap: true
	  screwIE8:true,
	  mangle:false // FIXME tem que funcionar com true
        },
        files: [{
          expand: true,
          cwd: 'dist/app',
          src: '**/*.js',
          dest: 'dist/app'
        }]
      }
    },
    war: {
      target: {
        options: {
          war_dist_folder: '.',
          war_name: 'dist/connecta',
          webxml_welcome: 'index.html',
          webxml_display_name: 'Connecta'
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: [
            '**',
            '!connecta.war'
          ],
          dest: ''
        }]
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },
    connect: {
      production: {
        options: {
          keepalive: true,
          port: port,
          base: 'dist'
        }
      },
      development: {
        options: {
          port: port,
          base: '.',
          debug: true,
          open: grunt.option('open'),
          middleware: function(connect, options) {
            return [
              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('connect-livereload')(),

              // Serve the project folder
              connect.static(options.base[0])
            ];
          }
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: grunt.option('reload')
        }
      },
      css: {
        files: ['assets/**/*.scss'],
        tasks: ['sass']
      },
      livereload: {
        files: ['assets/css/*.css', 'app/**/*.html', 'app/**/*.json'],
        options: {
          livereload: grunt.option('reload')
        }
      }
    }
  });

  grunt.registerTask('create-config', function() {
    if (!grunt.file.exists('app/applications.json')) {
      grunt.file.write('app/applications.json', grunt.file.read('app/applications.json.dist'));
    }
  });

  grunt.registerTask('default', ['jshint', 'sass', 'create-config']);
  grunt.registerTask('dist', ['clean', 'default', 'copy', 'ngAnnotate', 'uglify']);
  grunt.registerTask('test', ['default', 'karma']);
  grunt.registerTask('run', ['default', 'connect:development', 'watch']);
  grunt.registerTask('run-prod', ['dist', 'connect:production']);
  grunt.registerTask('war-dist', ['dist', 'war']);

};
