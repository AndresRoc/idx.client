/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'collections/listing',
    'text!templates/listing-preview-slide.hbs',
    'view-helpers/photos-url',
    'view-helpers/format-currency'
], function ($, _, Backbone, Handlebars, Utils, Listings, listingPreviewSlideTemplate) {
    'use strict';

    var PAGE_SIZE = 10;
    var MAX_PAGE = 25;
    var MAX_SLIDES = MAX_PAGE * PAGE_SIZE;

    var ListingPreviewSlideView = Backbone.View.extend({

        template: Handlebars.compile(listingPreviewSlideTemplate),

        initialize: function (options) {
            this.queryPage = 0;
            this.numSlides = 0;
            this.slideIdx = 0;

            this.fetchListings();
        },

        events: {
            'mouseover .item': "listingHover",
            'click .item': "listingClick"
        },

        render: function () {

            this.listenTo(Listings, 'sync', this.listingsSyncHandler);

            return this;
        },
        listingsSyncHandler: function() {

            this.$el.append(this.template({listings:Listings.toJSON()}));

            this.numSlides += PAGE_SIZE;

            if (this.queryPage == 0) {

                this.$el.find('.item:first-child').addClass('active');

                var carousel = $('#listings-preview-carousel');

                carousel.carousel({
                    interval: 5000,
                    keyboard: true,
                    wrap:false
                });

                var carouselSlide = function (e) {
                    if (e.direction === 'left') {

                        if (this.slideIdx >= MAX_SLIDES) {
                            return;
                        }

                        this.slideIdx++;

                        if (this.queryPage < MAX_PAGE &&
                            this.slideIdx > (this.numSlides - 2)) {
                            this.queryPage++;

                            this.fetchListings();
                        }
                    }
                    else if (e.direction === 'right') {
                        if (this.slideIdx > 0) {
                            this.slideIdx--;
                        }
                    }
                };

                carousel.on('slide.bs.carousel', _.bind(carouselSlide, this));
            }
        },
        buildQuery: function(options) {
            var query = {
                page: this.queryPage,
                perPage: PAGE_SIZE,
                sortBy: "listingContractDate",
                sortOrder: "desc"
            };

            _.extend(query, options);

            return query;
        },

        listingHover: function(e) {
            this.$el.find(e.currentTarget).css('cursor', 'pointer');
        },

        listingClick: function(e) {
            var mlsNumber = e.currentTarget.id.substr('listing-slide-'.length);
            window.parent.location = Utils.getAppConfig().listingDirectUrlBase + "#index?mlsNumber=" + mlsNumber;
        },

        fetchListings: function() {
            Listings.fetch({

                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },

                data: JSON.stringify(this.buildQuery()),

                type: 'POST'
            });
        },

        onClose: function () {

        }
    });

    return ListingPreviewSlideView;
});