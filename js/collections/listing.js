/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'models/listing'
], function ($, _, Backbone, Utils, ListingModel) {
    'use strict';

    var ListingCollection = Backbone.Collection.extend({
        url: Utils.getAppConfig().idxServiceUrl + '/residential/listings',
        model: ListingModel,
        parse: function(data) {
            this.totalPages = data.meta.totalPages;
            this.totalCount = data.meta.totalCount;

            if (data.listings) {

                _.each(data.listings, function(listing) {
                    if (data.meta.openhouse && data.meta.openhouse[listing.matrixUniqueId]) {
                        listing.openHouseList = data.meta.openhouse[listing.matrixUniqueId];
                    }
                });
            }

            return data.listings;
        }
    });

    return new ListingCollection();
});