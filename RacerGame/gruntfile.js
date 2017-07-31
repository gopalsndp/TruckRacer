module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      truckRacer: {
        port: 8080,
        base: ''
      }
    }
  });

  grunt.loadNpmTasks('grunt-connect');
  grunt.registerTask('default', 'connect:truckRacer');

};