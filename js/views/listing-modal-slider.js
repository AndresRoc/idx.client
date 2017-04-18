/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'slickCarousel',
    'imagesloaded',
    'text!templates/listing-modal-slider.hbs'
], function ($, _, Backbone, Handlebars, SlickCarousel, ImagesLoaded, ListingModalSliderTemplate) {
    'use strict';

    var ListingModalSliderView = Backbone.View.extend({

        template: Handlebars.compile(ListingModalSliderTemplate),

        initialize: function (params) {
            this.params = params;
        },

        render: function () {

            var photoList = [];
            var params = this.params;
            _.each(params.photoIndexList, function (photoIdx) {
                photoList.push({
                    mlsNumber: params.mlsNumber,
                    photoIndex: photoIdx
                });
            });

            this.$el.html(this.template({
                photoList: photoList
            }));

            $('#listing-carousel .carousel-inner .item').first().addClass('active');

            return this;
        },

        initSlider: function (slideIndex) {

            var items = $('#listing-carousel .carousel-inner .item');

            _.each(items, function(itemEl) {
                $(itemEl).removeClass('active');
            });

            $(items[slideIndex]).addClass('active');
        },

        onClose: function () {

        }
    });

    return ListingModalSliderView;
});