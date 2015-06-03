/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! kevin-wilde.co.uk - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Kevin Wilde; Licensed MIT */'
    },
    uglify: {
      app: {
        files: { 'js/main.min.js': ['js/main.js'] },
        banner: '<%= meta.banner %>\n',
        compress: true,
        mangle: true
      }
    },
    concat: {
      app: {
        files: {
          'build/js/main.js': [ 'js/vendor/jquery.js', 'js/main.min.js' ],
        },
      },
    },
    jshint: {
      files: ['js/*.js' ],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/main.css': 'css/main.sass'
        }
      },
      build: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/css/main.css': 'css/main.sass'
        }
      },
    },
    watch: {
      files: ['<%= jshint.files %>', 'css/*.sass'],
      tasks: ['jshint', 'sass']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');

  //tasks
  grunt.registerTask('build', ['uglify', 'concat', 'sass:build']);

};
