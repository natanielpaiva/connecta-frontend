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
          '!**/connecta-frontend.war',
          '!Gruntfile.js'
        ],
        dest: 'dist/',
        expand: true
      }
    },
    war: {
      target: {
        options: {
          war_dist_folder: '.',
          war_name: 'dist/connecta-frontend',
          webxml_welcome:'index.html',
          webxml_display_name: 'Connecta Frontend'
        },
        files:[
          {
            expand: true,
            cwd: 'dist',
            src: ['**'],
            dest: ''
          }
        ]
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
          debug:true,
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
          livereload: grunt.option('reload'),
        }
      },
      css: {
        files: ['assets/**/*.scss'],
        tasks: ['sass']
      },
      livereload: {
        files: ['assets/css/*.css', 'app/**/*.html'],
        options: {
          livereload: grunt.option('reload'),
        }
      }
    }
  });

  grunt.registerTask('create-local-applications', 'Criar cópia local do applications.json', function(){
    if (!grunt.file.exists('app/applications.json')) {
      grunt.file.write('app/applications.json', grunt.file.read('app/applications.json.dist'));
    }
  });

  grunt.registerTask('default', ['jshint', 'sass', 'create-local-applications']);
  grunt.registerTask('dist', ['default', 'copy']);
  grunt.registerTask('test', ['default', 'karma']);
  grunt.registerTask('run', ['default', 'connect:development', 'watch']);
  grunt.registerTask('run-prod', ['dist', 'connect:production']);
  grunt.registerTask('war-dist', ['dist', 'war']);

};
