module.exports = function(grunt) {

  var port = grunt.option('port') || 9001;

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-war');

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
    war: {
      target: {
        options: {
          war_dist_folder: '.',
          war_name: 'connecta-frontend',
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
          keepalive: true,
          port: port,
          base: '.',
          debug:true,
          open:grunt.option('open'),
          livereload:true
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'sass', 'copy']);
  grunt.registerTask('test', ['default', 'karma']);
  grunt.registerTask('run-prod', ['default', 'connect:production']);
  grunt.registerTask('run', ['jshint', 'sass', 'connect:development', 'watch']);
};
