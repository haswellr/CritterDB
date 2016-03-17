module.exports = function (grunt) {
  //js > imported > annotated > dist
  grunt.initConfig({
    // define source files and their destinations
    uglify: {
        files: {
            src: ['staging/annotated/**/*.js'],
            dest: 'dist/js/app.min.js',
            flatten: true   // remove all unnecessary nesting
        }
    },
    ngAnnotate: {
      dist: {
        files: [{
            expand: true,
            src: ['staging/imported/**/*.js'],
            dest: 'staging/annotated',
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
        src: ['staging/**/*.js'],
        dest: 'dist/js/app.min.js'
      }
    },
    clean: {
      staging: ['staging/'],
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
        tasks: ['import','concat','clean:staging']
      },
      data: {
        files: 'public/data/**',
        tasks: ['import','concat','clean:staging']
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
    },
    import: {
      dist: {
        files: [{
          expand: true,
          src: ['public/js/**/*.js','!public/js/vendor/**/*.js'],
          dest: 'staging/imported',
          extDot: 'last'
        }]
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
  grunt.loadNpmTasks('grunt-import');

  // register at least this one task
  grunt.registerTask('default', [ 'clean', 'import', 'ngAnnotate', 'concat:vendor', 'uglify', 'clean:staging', 'copy', 'cssmin']);

};
