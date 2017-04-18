module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var banner = '/*\n<%= pkg.name %> <%= pkg.version %>';
    banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n',
                banner: banner
            },
            dist: {
                src: ['js/**/*.js'],
                dest: 'dist/js/main.js'
            }
        },
        uglify: {
            options: {
                banner: banner,
                sourceMap: true
            },
            idx_client_js_target: {
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '**/*.js',
                    dest: 'dist/js'
                }]
            }
        },
        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {                         // Dictionary of files
                    'css/main.css': 'css/main.scss'      // 'destination': 'source'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/css/main.css': [
                        'css/main.css'
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [

                    {expand: true, src: ['lib/**'], dest: 'dist'},
                    {expand: true, src: ['img/**'], dest: 'dist'},
                    {expand: true, src: ['js/**/*.hbs'], dest: 'dist'},
                    {expand: true, src: ['bower_components/**'], dest: 'dist'},

                    {expand: true, src: ['index.html'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, src: ['js/appconfig.json'], dest: 'dist', filter: 'isFile'}

                ]
            }
        }
    });

    grunt.registerTask('default', ['uglify', 'sass', 'cssmin', 'copy']);
};