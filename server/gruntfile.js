module.exports = function (grunt) {
  //js > imported > annotated > dist
  grunt.initConfig({
    // define source files and their destinations
    uglify: {
        files: {
            src: ['dist/js/app.min.js'],
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
      annotated: {
        src: ['staging/annotated/**/*.js'],
        dest: 'dist/js/app.min.js'
      },
      imported: {
        src: ['staging/imported/**/*.js'],
        dest: 'dist/js/app.min.js'
      }
    },
    clean: {
      staging: ['staging/'],
      partials: ['dist/partials/'],
      img: ['dist/img/'],
      fonts: ['dist/fonts'],
      views: ['dist/views'],
      css: ['dist/css/'],
      data: ['dist/data/'],
      js: ['dist/js/']
    },
    copy: {
      data: {
        expand: true,
        cwd: 'public/data',
        src: '**',
        dest: 'dist/data/'
      },
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
      },
      views: {
        expand: true,
        cwd: 'views',
        src: '**',
        dest: 'dist/views/'
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
        tasks: ['import','concat:imported', 'babel:dev','clean:staging']
      },
      data: {
        files: 'public/data/**',
        tasks: ['import','concat:imported', 'babel:dev','clean:staging','copy:data']
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
      },
      views: {
        files: 'public/views/**',
        tasks: ['clean:views','copy:views']
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
    },
    replace: {
      hash: {
        src: ['dist/**/*.js','dist/**/*.html','dist/**/*.css'],
        overwrite: true,
        replacements: [{
          from: '@@hash',
          to: function (matchedWord) {
            var hash = (new Date()).valueOf().toString() + Math.floor((Math.random()*1000000)+1).toString();
            return "hash=" + hash;
          }
        }]
      }
    },
    babel: {
      options: {
        sourceMap: false,
      },
      prod: {
        files: {
          'dist/js/app.min.js': 'dist/js/app.min.js'
        },
        options: {
          presets: [
            '@babel/preset-env',
            ['minify', {
              'mangle': true
            }]
          ],
          comments: false,
          compact: true
        }
      },
      dev: {
        files: {
          'dist/js/app.min.js': 'dist/js/app.min.js'
        },
        options: {
          presets: ['@babel/preset-env'],
          comments: true,
          compact: false
        }
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
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-babel');

  // register at least this one task
  // Note on replace: the replace assetsToDist is necessary so that cacheBust can find the URLs that
  //    it is busting in index.html properly. After busting the cache, we then reset /dist to /assets.
  grunt.registerTask('default', [ 'clean', 'import', 'ngAnnotate', 'concat:vendor', 'concat:annotated', 'clean:staging', 'copy', 'cssmin', 'replace:hash', 'babel:prod']);

};
