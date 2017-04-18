/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'utils'
], function ($, _, Backbone, Moment, Utils) {
    'use strict';

    var setHasPhotos = function(model) {
        var photoCount = model.get('photoCount');
        return photoCount && photoCount > 0;
    };

    var getGoogleMapsEmbedQuery = function(model) {
        var city = model.get('city');
        var state = "HI";

        var query = getFullStreetAddress(model, true) + " " + city + " " + state;
        query += "&zoom=17";

        return encodeURI(query);
    };

    var getDaysOnMarket = function(model) {
        return Moment().startOf('day').diff(Moment(model.get('listingContractDate')), 'days');
    };

    var getFullStreetAddress = function(model, excludeUnitNumber) {
        var address = '';

        var addressItems = model.pick('streetNumber', 'streetDirPrefix',
            'streetName', 'streetDirSuffix', 'streetSuffix', 'unitNumber');

        if (addressItems.streetNumber) {
            address += addressItems.streetNumber;
        }

        if (addressItems.streetDirPrefix) {
            address += ' ' + addressItems.streetDirPrefix;
        }

        if (addressItems.streetName) {
            address += ' ' + addressItems.streetName;
        }

        if (addressItems.streetDirSuffix) {
            address += ' ' + addressItems.streetDirSuffix;
        }

        if (addressItems.streetSuffix) {
            address += ' ' + addressItems.streetSuffix;
        }

        if (!excludeUnitNumber && addressItems.unitNumber) {
            address += ', ' + addressItems.unitNumber;
        }

        return address;
    };

    var ListingModel = Backbone.Model.extend({

        urlRoot: Utils.getAppConfig().idxServiceUrl + '/residential/listing',
        photoIndexList: function () {
            var photoIndexList = [];

            _.times(this.get('photoCount'), function(i) {
                photoIndexList[i] = i + 1;
            });

            return photoIndexList;
        },
        parse: function(response) {

            //computed properties
            this.set('hasPhotos', _.partial(setHasPhotos, this));
            this.set('daysOnMarket', _.partial(getDaysOnMarket, this));
            this.set('fullStreetAddress', _.partial(getFullStreetAddress, this, false));
            this.set('googleMapsEmbedQuery', _.partial(getGoogleMapsEmbedQuery, this));

            //sort open house list by date asc
            if (response.openHouseList) {
                response.openHouseList = response.openHouseList.sort(function(a, b){
                    return a.openHouseDate > b.openHouseDate;
                });
            }

            if (response.listing) {
                return response.listing;
            }

            return response;
        }
    });

    return ListingModel;
});