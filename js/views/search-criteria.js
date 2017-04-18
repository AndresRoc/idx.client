/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'accounting',
    'moment',
    'utils',
    'views/search-criteria-helper/input-handler',
    'text!templates/search-criteria.hbs'
], function ($, _, Backbone, Handlebars, Accounting, Moment, Utils, InputHandler, searchCriteriaTemplate) {
    'use strict';

    var SearchCriteriaView = Backbone.View.extend({

        template: Handlebars.compile(searchCriteriaTemplate),

        initialize: function () {
        },

        events: {
            'click #btn-back-to-results': "showResultsTab",
            'keydown': "keyAction"
        },

        render: function () {

            this.$el.append(this.template());

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "currency",
                inputIds: ['price-min', 'price-max']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "home-size",
                inputIds: ['sqft-min', 'sqft-max']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "year-built",
                inputIds: ['year-built-min', 'year-built-max']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "beds",
                inputIds: ['beds-amt']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "baths",
                inputIds: ['baths-amt']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "parking",
                inputIds: ['parking-amt']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "photos",
                inputIds: ['photosCheckbox']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "features",
                inputIds: ['featuresCheckbox']
            });

            InputHandler.applyInputHandlers({
                $el:this.$el,
                criteriaType: "openHouse",
                inputIds: ['openHouseRadio']
            });

            return this;
        },

        keyAction: function(e) {
            var char = String.fromCharCode(e.keyCode || e.charCode);


            //see http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            if (char.charCodeAt(0) >= 65) {
                e.preventDefault();
            }
        },

        showResultsTab: function(e) {
            Utils.eventDispatcher.trigger('listings-search-criteria:show-results-tab');
        },
        onClose: function () {

        }
    });

    return SearchCriteriaView;
});