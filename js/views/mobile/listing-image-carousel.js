/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'views/listing-image-carousel',
    'slickCarousel',
    'imagesloaded',
    'text!templates/mobile/listing-carousel.hbs'
], function ($, _, Backbone, Handlebars, Utils, ParentListingImageCarousel, SlickCarousel, ImagesLoaded, ListingCarouselTemplate) {
    'use strict';

    var ListingMobileView = ParentListingImageCarousel.extend({

        template: Handlebars.compile(ListingCarouselTemplate),

        setupSlick: function () {
            var carouseEl = this.$el.find('.listing-carousel');

            if (!carouseEl) {
                return;
            }

            $('#listing-carousel .carousel-inner .item').first().addClass('active');

            $('#listing-carousel').carousel({
                interval:3000,
                wrap:true
            });

            carouseEl.removeClass('hidden');
        },
        onClose: function () {

        }
    });

    return ListingMobileView;
});