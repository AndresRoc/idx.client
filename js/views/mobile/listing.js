/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'views/listing',
    'views/mobile/listing-image-carousel',
    'text!templates/mobile/listing.hbs'
], function ($, _, Backbone, Handlebars, Utils, ParentListingView, ListingImageCarousel, listingMobileTemplate) {
    'use strict';

    var ListingMobileView = ParentListingView.extend({

        template: Handlebars.compile(listingMobileTemplate),

        render: function() {
            //call super method
            ParentListingView.prototype.render.call(this);

        },
        renderSubviewCarousel: function() {

            if (!this.listingCarousel) {
                this.listingCarousel = new ListingImageCarousel({
                    mlsNumber: this.listing.get('mlsNumber'),
                    photoIndexList: this.listing.photoIndexList()
                });
            }

            Utils.assignSubviews.apply(this, [{
                '.listing-carousel': this.listingCarousel
            }]);

            this.listingCarousel.initCarousel();
        }
    });

    return ListingMobileView;
});