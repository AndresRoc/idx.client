/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'text!templates/mobile/index.hbs',
    'views/index',
    'views/mobile/listings',
    'views/mobile/listing',
    'views/location-search',
    'views/search-criteria',
    'views/sort-listings',
    'views/sync-stat',
], function ($, _, Backbone, Handlebars, Utils, indexMobileTemplate,
             ParentIndexView, ListingsMobileView, ListingMobileView,
             LocationSearchView, SearchCriteriaView, SortListingsView, SyncStatView) {
    'use strict';

    var IndexMobileView = ParentIndexView.extend({

        template: Handlebars.compile(indexMobileTemplate),

        events: {
            'click .listing-link': "showListingEvent"
        },

        initViews: function() {
            this.listingsView = new ListingsMobileView(this.listingsQuery);
            this.locationSearchView = new LocationSearchView();
            this.searchCriteriaView = new SearchCriteriaView();
            this.sortListingsView = new SortListingsView();
            this.syncStatView = new SyncStatView();
        },

        render: function() {
            //call super method
            ParentIndexView.prototype.render.call(this);

            this.$el.find('input.location-search').css('width', '250px');
            var sortBtn = this.$el.find('#sort-drop-down-menu button');
            sortBtn.css('margin-bottom', '10px');
            this.$el.find('.sync-stat').css('margin', '0');
        },

        //override showListingEvent, let router handle listing display for mobile
        showListingEvent: function(e) {

        },

        showListing: function(mlsNumber) {

            this.hideAll();

            if (this.listingView) {
                this.listingView.undelegateEvents();
            }

            this.listingView = new ListingMobileView(mlsNumber);

            var subviews = {
                '.subview-listing .render-listing':this.listingView
            };

            Utils.assignSubviews.call(this, subviews);

            $(window).scrollTop(0);

            _.delay(_.bind(function() {
                this.$el.find('.listing-view').removeClass('hidden');
            }, this), 200);
        },

        hideAll: function() {
            this.$el.find('.index-view').addClass('hidden');
            this.$el.find('.search-criteria-view').addClass('hidden');
            this.$el.find('.listing-view').addClass('hidden');
            this.$el.find('.disclaimer-view').addClass('hidden');
        },

        navRemoveActive: function() {
            this.$el.find('#results-link').parent().removeClass('active');
            this.$el.find('#search-criteria-link').parent().removeClass('active');
            this.$el.find('#disclaimer-info-link').parent().removeClass('active');
        },

        showResults: function(e) {

            if (e) {
                e.preventDefault();
            }

            this.hideAll();
            this.navRemoveActive();

            this.$el.find('.index-view').removeClass('hidden');
            this.$el.find('#results-link').parent().addClass('active');
        },

        showSearchCriteria: function(e) {
            if (e) {
                e.preventDefault();
            }

            this.hideAll();
            this.navRemoveActive();

            this.$el.find('#search-criteria-link').parent().addClass('active');
            this.$el.find('.search-criteria-view').removeClass('hidden');
            this.$el.find('#btn-back-to-results').css('display', 'none');
        },

        showDisclaimer: function(e) {
            if (e) {
                e.preventDefault();
            }

            this.hideAll();
            this.navRemoveActive();

            this.$el.find('#disclaimer-info-link').parent().addClass('active');
            this.$el.find('.disclaimer-view').removeClass('hidden');
        }
    });

    return IndexMobileView;
});