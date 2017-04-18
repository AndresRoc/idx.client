/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'views/listing-preview-slide',
    'text!templates/listing-preview.hbs'
], function ($, _, Backbone, Handlebars, Utils, ListingPreviewSlideView, listingPreviewTemplate) {
    'use strict';

    var ListingPreviewView = Backbone.View.extend({

        template: Handlebars.compile(listingPreviewTemplate),

        initialize: function (options) {
            this.listingPreviewSlideView = new ListingPreviewSlideView(options);
        },

        render: function () {

            this.$el.html(this.template());

            var subviews = {
                '.subview-listing-preview-slide':this.listingPreviewSlideView
            };

            Utils.assignSubviews.apply(this, [subviews]);

            return this;
        },

        onClose: function () {
            var views = [
                this.listingPreviewSlideView
            ];

            _.each(views, function(view) {
                if (view) {
                    view.remove();
                    if (view.onClose) {
                        view.onClose();
                    }
                }
            });
        }
    });

    return ListingPreviewView;
});