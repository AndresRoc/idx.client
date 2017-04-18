/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        bootstrap: {
            deps: [
                'jquery'
            ]
        },
        accounting: {

        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        infinity: {
            deps: [
                'jquery'
            ]
        },
        slickCarousel: {
            deps: [
                'jquery'
            ]
        },
        jqueryPrint: {
            deps: [
                'jquery'
            ]
        },
        typeahead: {
            deps: [
                'jquery'
            ]
        },
        mobileDetect: {

        }
    },
    moment: {
        noGlobal: true
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min',
        underscore: '../bower_components/underscore/underscore-min',
        backbone: '../bower_components/backbone/backbone-min',
        text: '../bower_components/text/text',
        handlebars: '../bower_components/handlebars/handlebars.amd.min',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
        accounting: '../bower_components/accounting/accounting.min',
        infinity: '../bower_components/infinity/build/infinity.min',
        imagesloaded: '../bower_components/imagesloaded/imagesloaded.pkgd.min',
        slickCarousel: '../bower_components/slick-carousel/slick/slick.min',
        moment: '../bower_components/moment/min/moment.min',
        momentTimezone: '../bower_components/moment-timezone/builds/moment-timezone-with-data.min',
        typeahead: '../lib/typeahead/typeahead.jquery.min',
        bloodhound: '../lib/typeahead/bloodhound.min',
        json : '../bower_components/requirejs-plugins/src/json',
        jqueryPrint: '../bower_components/jQuery.print/jQuery.print',
        clipboard: '../bower_components/clipboard/dist/clipboard.min',
        mobileDetect: '../bower_components/mobile-detect/mobile-detect.min'

    }
});

require([
    'jquery',
    'backbone',
    'views/app',
    'routers/router'
], function ($, Backbone, AppView, Router) {
    /*jshint nonew:false*/

    //manages cleaning up previous view and rendering a new view
    function ViewManager(){

        this.showView = function(view) {
            if (this.currentView){
                this.currentView.close();
            }

            this.currentView = view;
            this.currentView.render();

            $("#main-content").html(this.currentView.el);
        };
    }

    //base close function that cleans removes view and unbinds any events
    Backbone.View.prototype.close = function(){
        this.remove();

        //any extra cleanup routines defined by view
        if (this.onClose){
            this.onClose();
        }
    };

    // Initialize routing and start Backbone.history()
    new Router({viewManager:new ViewManager()});
    Backbone.history.start();

    // Initialize the application view
    new AppView();

});

