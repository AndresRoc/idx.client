/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'handlebars',
    'utils',
    'collections/listing',
    'models/listing',
    'text!templates/listing.hbs',
    'views/listing-image-carousel',
    'views/listing-modal-slider',
    'clipboard',
    'view-helpers/format-currency',
    'view-helpers/property-type',
    'view-helpers/photos-url',
    'view-helpers/format-date',
    'view-helpers/schools'
], function ($, _, Backbone, Bootstrap, Handlebars, Utils, Listings, Listing,
             listingTemplate, ListingImageCarousel, ListingModalSlider, Clipboard) {
    'use strict';

    var ListingView = Backbone.View.extend({

        template: Handlebars.compile(listingTemplate),

        initialize: function (mlsNumber) {

            this.listing = Listings.findWhere({mlsNumber:mlsNumber});

            if (!this.listing) {
                this.isListingFetch = true;
                this.listing = new Listing({id: mlsNumber});
                this.listing.fetch();
            }
        },

        events: {
            'click .request-listings-link a': "retryListingRequest",
            'click a.listing-print': "printListing",
            'click a.copy-listing-link': "copyLink"
        },

        retryListingRequest: function(e) {
            e.preventDefault();
            if (this.listing) {
                this.listing.fetch();
            }
        },

        render: function () {

            if (this.isListingFetch) {

                this.listenTo(this.listing, 'sync', function () {
                    //ensure that error banner is hidden and that listing detail is visible
                    this.$el.find(".listings-error").addClass('hidden');
                    this.$el.find('.listing-detail').removeClass('hidden');

                    this.renderListing();
                });

                this.listenTo(this.listing, 'error', function() {
                    this.$el.html(this.template({}));
                    this.$el.find('.listing-detail').addClass('hidden');
                    this.$el.find(".listings-error").removeClass('hidden');
                });
            }
            else {
                this.renderListing();
            }

            return this;
        },

        renderListing: function() {

            this.listing.set('googleMapsApiKey', Utils.getAppConfig().googleMapsApiKey);
            this.listing.set('directLinkUrl', Utils.getAppConfig().listingDirectUrlBase + "#index?mlsNumber=" + this.listing.get('mlsNumber'));
            this.$el.html(this.template(this.listing.toJSON()));

            var listingStatus = this.listing.get('status');
            var $statusDisplay = this.$el.find('#status-display');

            $statusDisplay.removeClass('status-active');
            $statusDisplay.removeClass('status-active-continue-to-show');

            if (listingStatus === 'Active') {
                $statusDisplay.addClass('status-active');
            }
            else {
                $statusDisplay.addClass('status-active-continue-to-show');
            }

            if (this.listing.get('photoCount') > 0) {
                this.renderSubviewCarousel();
            }

            var copyListingEl = this.$el.find('.copy-listing-link');

            if (!copyListingEl) {
                return;
            }

            copyListingEl.tooltip({
                title: 'Copied!',
                placement: 'bottom',
                trigger: 'click'
            });

            copyListingEl.on('shown.bs.tooltip', function () {
                _.delay(function() {
                    $('.copy-listing-link').tooltip('hide');
                }, 1000);
            });

            new Clipboard('.copy-listing-link');
        },

        renderSubviewCarousel: function() {

            if (!this.listingCarousel) {
                this.listingCarousel = new ListingImageCarousel({
                    mlsNumber: this.listing.get('mlsNumber'),
                    photoIndexList: this.listing.photoIndexList()
                });
            }

            Utils.assignSubviews.call(this, {
                '.listing-carousel': this.listingCarousel
            });

            this.listingCarousel.initCarousel();

            this.photosModalEventHandler();
        },

        photosModalEventHandler: function() {

            var photosModal = this.$el.find('#photosModal');

            this.modalPhotoSlider = new ListingModalSlider({
                mlsNumber: this.listing.get('mlsNumber'),
                photoIndexList: this.listing.photoIndexList()
            });

            Utils.assignSubviews.call(this, {
                '.listing-modal-slider': this.modalPhotoSlider
            });

            var showModal = function() {

                this.modalPhotoSlider.initSlider(this.listingCarousel.currentSlide());
            };

            photosModal.on('show.bs.modal',  _.bind(showModal, this));
        },

        printListing: function(e) {
            e.preventDefault();
            Utils.printDiv("listing-detail-" + this.listing.get('mlsNumber'));
        },

        copyLink: function(e) {
            e.preventDefault();
        },

        onClose: function () {
            if (this.listingCarousel) {
                this.listingCarousel.remove();
                if (this.listingCarousel.onClose) {
                    this.listingCarousel.onClose();
                }
            }

            if (this.modalPhotoSlider) {
                this.modalPhotoSlider.remove();
                if (this.modalPhotoSlider.onClose) {
                    this.modalPhotoSlider.onClose();
                }
            }
        }
    });

    return ListingView;
});