/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'collections/listing',
    'views/listings'
], function ($, _, Backbone, Handlebars, Utils, Listings, ParentListingsView) {
    'use strict';

    var ListingsMobileView = ParentListingsView.extend({

        handleScrollLogic: function() {

            var scrollLogic = function() {

                var margin = 0;
                var $parent = $(window);
                var $doc = $(document);

                if(!this.loadingData && ($parent.scrollTop() + $parent.height()) >= ($doc.height()-margin)) {
                    if (this.queryPage < (Listings.totalPages-1)) {
                        this.queryPage++;

                        this.fetchListings();
                    }
                }
            };

            $(window).on('scroll', _.bind(scrollLogic, this));
        },

        fetchListings: function() {
            Listings.fetch({

                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },

                data: JSON.stringify(this.buildQuery(this.queryOptions)),

                type: 'POST'
            });
        }
    });

    return ListingsMobileView;
});