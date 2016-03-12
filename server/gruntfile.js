module.exports = function (grunt) {
  grunt.initConfig({

    // define source files and their destinations
    uglify: {
        files: {
            src: ['public/js/annotated/**/*.js'],
            dest: 'dist/js/app.min.js',
            flatten: true   // remove all unnecessary nesting
        }
    },
    ngAnnotate: {
      dist: {
        files: [{
            expand: true,
            src: ['public/js/**/*.js','!public/js/**/*.annotated.js','!public/js/vendor/**/*.js'],
            dest: 'public/js/annotated',
            extDot: 'last'
        }]
      }
    },
    concat: {
      vendor: {
        src: ['public/js/vendor/angular/angular.min.js','public/js/vendor/**/*.min.js'],
        dest: 'dist/js/vendor.min.js'
      },
      source: {
        src: ['public/js/**/*.js','!public/js/annotated/**','!public/js/vendor/**'],
        dest: 'dist/js/app.min.js'
      }
    },
    clean: {
      annotations: ['public/js/annotated/'],
      partials: ['dist/partials/'],
      img: ['dist/img/'],
      fonts: ['dist/fonts']
    },
    copy: {
      partials: {
        expand: true,
        cwd: 'public/partials',
        src: '**',
        dest: 'dist/partials/'
      },
      img: {
        expand: true,
        cwd: 'public/img',
        src: '**',
        dest: 'dist/img/'
      },
      fonts: {
        expand: true,
        cwd: 'public/fonts',
        src: '**',
        dest: 'dist/fonts/'
      }
    },
    cssmin: {
      target: {
        files: {
          'dist/css/style.min.css': ['public/css/**/*.css']
        }
      }
    },
    watch: {
      css: {
        files: 'public/css/**/*.css',
        tasks: ['cssmin']
      },
      js:  {
        files: 'public/js/**/*.js',
        tasks: ['concat']
      },
      fonts: {
        files: 'public/fonts/**',
        tasks: ['clean:fonts','copy:fonts']
      },
      img: {
        files: 'public/img/**',
        tasks: ['clean:img','copy:img']
      },
      partials: {
        files: 'public/partials/**',
        tasks: ['clean:partials','copy:partials']
      }
    }
  });

  // load plugins
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // register at least this one task
  grunt.registerTask('default', [ 'clean', 'ngAnnotate', 'concat:vendor', 'uglify', 'clean:annotations', 'copy', 'cssmin']);

};
