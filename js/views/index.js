/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'text!templates/index.hbs',
    'views/listings',
    'views/listing',
    'views/location-search',
    'views/search-criteria',
    'views/sort-listings',
    'views/sync-stat'
], function ($, _, Backbone, Handlebars, Utils, indexTemplate,
             ListingsView, ListingView,
             LocationSearchView, SearchCriteriaView,
             SortListingsView, SyncStatView) {
    'use strict';

    var DEFAULT_SORT_BY_FIELD = 'listingContractDate';

    var IndexView = Backbone.View.extend({

        template: Handlebars.compile(indexTemplate),

        initialize: function (options) {

            this.listingsQuery = {
                sortBy: DEFAULT_SORT_BY_FIELD,
                sortOrder:'desc'
            };

            _.extend(this.listingsQuery, options);
            if (options && options.mlsNumber) {
                this.mlsNumber = options.mlsNumber;
            }

            this.initViews();

            Utils.eventDispatcher.on({
                'listings-search-term:remove-search-term': this.clearListing,
                'listings-search-criteria:show-results-tab': this.showSearchResultsTab,
                'listings-search-criteria:show-criteria-tab': this.showSearchCriteriaTab,
                'listings:sync': this.searchResultCountUpdate,
                'mlsNumberEvent': this.handleMlsNumberEvent
            }, this);
        },

        initViews: function() {
            this.listingsView = new ListingsView(this.listingsQuery);
            this.locationSearchView = new LocationSearchView();
            this.searchCriteriaView = new SearchCriteriaView();
            this.sortListingsView = new SortListingsView();
            this.syncStatView = new SyncStatView();
        },

        events: {
            'click .listing-link': "showListingEvent"
        },

        render: function () {

            this.$el.html(this.template());

            var subviews = {
                '.subview-listings':this.listingsView,
                '.subview-location-search':this.locationSearchView,
                '.subview-criteria-search':this.searchCriteriaView,
                '.subview-sort-listings':this.sortListingsView,
                '.subview-sync-stat':this.syncStatView
            };

            Utils.assignSubviews.apply(this, [subviews]);

            //handle mls number param
            if (this.mlsNumber) {
                Utils.eventDispatcher.trigger('mlsNumberEvent');
            }

            return this;
        },

        handleMlsNumberEvent: function(e) {
            //display listing
            this.showListing(this.mlsNumber);
            _.delay(_.bind(function(){this.showSearchCriteriaTab()},this), 200);
        },

        showListingEvent: function(e) {
            e.preventDefault();
            var mlsNumber = e.currentTarget.hash.substr(e.currentTarget.hash.lastIndexOf("=")+1);

            this.showListing(mlsNumber);
        },

        showListing: function(mlsNumber) {

            if (this.listingView) {
                this.listingView.undelegateEvents();
            }

            this.listingView = new ListingView(mlsNumber);

            var subviews = {
                '.subview-listing .render-listing':this.listingView
            };

            Utils.assignSubviews.call(this, subviews);
        },

        clearListing: function() {
            if (this.listingView) {
                this.listingView.remove();
                this.$el.find('.subview-listing').html('<div class="render-listing"/></div>');
            }
        },

        showSearchResultsTab: function() {
            this.$el.find('#search-tabs a[href="#tab-search-results"]').tab('show');
        },

        showSearchCriteriaTab: function() {
            var searchCriteria = this.$el.find('a[href="#tab-additional-criteria"]');
            if (searchCriteria) {
                searchCriteria.tab('show');
            }
        },

        searchResultCountUpdate: function(searchMeta) {
            this.$el.find('.search-result-count').html("(" + searchMeta.totalCount + ")");
        },

        onClose: function() {

            var views = [
                this.listingsView,
                this.listingView,
                this.locationSearchView,
                this.searchCriteriaView,
                this.sortListingsView,
                this.syncStatView
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

    return IndexView;
});