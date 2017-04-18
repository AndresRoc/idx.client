/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'slickCarousel',
    'imagesloaded',
    'text!templates/listing-carousel.hbs'
], function ($, _, Backbone, Handlebars, SlickCarousel, ImagesLoaded, ListingCarouselTemplate) {
    'use strict';

    var SCREEN_VIEW_TABLET = 560;
    var SCREEN_VIEW_MOBILE = 325;

    var ListingCarouselView = Backbone.View.extend({

        template: Handlebars.compile(ListingCarouselTemplate),

        initialize: function (params) {
            this.params = params;
        },

        events: {
            'click .large-photo-link': 'photosModalHandler'
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

            return this;
        },

        initCarousel: function () {

            this.imageCarouselNavHandler();
        },

        imageCarouselNavHandler: function () {

            this.$el.find('.loading').addClass('hidden');

            this.$el.find('[class^=image-carousel]').removeClass('hidden');

            this.setupSlick();
        },

        photosModalHandler: function (e) {
            this.$el.find(this).attr('data-target', '#photosModal');
        },

        setupSlick: function () {
            this.$el.find('.image-carousel-for').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: '.image-carousel-nav'
            });

            this.$el.find('.image-carousel-nav').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                accessibility: true,
                focusOnSelect: true,
                centerMode: true,
                centerPadding: '20px',
                asNavFor: '.image-carousel-for',
                responsive: [
                    {
                        breakpoint: SCREEN_VIEW_TABLET,
                        settings: {
                            arrows: false,
                            centerMode: false,
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: SCREEN_VIEW_MOBILE,
                        settings: {
                            arrows: false,
                            dots: false,
                            centerMode: false,
                            slidesToShow: 2
                        }
                    }
                ]
            });
        },

        currentSlide: function () {
            return this.$el.find('.image-carousel-for').slick('slickCurrentSlide');
        },

        onClose: function () {
            this.$el.find('.image-carousel-for').slick('unslick');
            this.$el.find('.image-carousel-nav').slick('unslick');
        }
    });

    return ListingCarouselView;
});