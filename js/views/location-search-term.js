/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'text!templates/location-search-term.hbs'
], function ($, _, Backbone, Handlebars, Utils, locationSearchTermTemplate) {
    'use strict';

    var LocationSearchTermView = Backbone.View.extend({

        template: Handlebars.compile(locationSearchTermTemplate),

        initialize: function (searchTerm) {
            this.searchTerm = searchTerm;
        },

        events: {
            'click .glyphicon-remove-circle': "removeSearchTerm"
        },

        render: function () {

            this.$el.html(this.template(this.searchTerm.toJSON()));

            return this;
        },

        removeSearchTerm: function() {
            this.remove();
            //triggers remove search term from collection event in location-search view
            Utils.eventDispatcher.trigger('listings-search-term:remove-search-term', this.searchTerm);

            _.delay(function() {
                Utils.eventDispatcher.trigger('listings:query');
            }, 100);
        },

        onClose: function () {

        }
    });

    return LocationSearchTermView;
});