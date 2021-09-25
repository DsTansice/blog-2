/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    hexo: {
      generate: {
        options: {
          root: '/hexo/',
          cliCmd: 'generate'
        }
      }
    },
    'font-spider': {
        options: { ignore: ['^((?!\.min.css$).)*$'] },
        main: {
            src: './hexo/public/**/*.html'
        }
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-hexo');
  grunt.loadNpmTasks('grunt-font-spider');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['hexo:generate', 'font-spider']);

};
