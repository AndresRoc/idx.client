/*global define*/
define([
    'jquery',
    'backbone',
    'views/index',
    'views/mobile/index',
    'views/listings',
    'views/listing',
    'views/mobile/listing',
    'views/listing-preview',
    'utils'
], function ($, Backbone, IndexView, IndexMobileView,
             ListingsView, ListingView, ListingMobileView, ListingPreviewView, Utils) {
    'use strict';

    var IdxRouter = Backbone.Router.extend({

        initialize: function(options){
            this.viewManager = options.viewManager;
        },

        routes: {
            "listings": "listings",
            "listing/:mlsNumber": "listing",
            "listing/mobile/:mlsNumber": "listingMobile",
            "listingPreview": "listingPreview",
            "index": "defaultRoute",
            "mobile": "mobile",
            "criteria": "criteria",
            "disclaimer": "disclaimer",
            "*actions": "defaultRoute"
        },
        listings: function(queryString) {
            this.listingsView = new ListingsView(parseQueryString(queryString));
            this.viewManager.showView(this.listingsView);
        },
        listing: function(mlsNumber) {

            if (Utils.isMobile()) {

                if (this.indexView) {
                    this.indexView.showListing(mlsNumber);
                    return;
                }

                this.listingView = new ListingMobileView(mlsNumber);
            }
            else {
                this.listingView = new ListingView(mlsNumber);
            }

            this.viewManager.showView(this.listingView);
        },
        listingMobile: function(mlsNumber) {
            this.indexView.showListing(mlsNumber);
        },
        listingPreview: function(options) {
            this.listingPreviewView = new ListingPreviewView();
            this.viewManager.showView(this.listingPreviewView);
        },
        mobile: function(queryString) {
            this.indexMobileView = new IndexMobileView(parseQueryString(queryString));
            this.viewManager.showView(this.indexMobileView);
        },
        criteria: function(queryString) {
            //mobile support only
            if (!Utils.isMobile()) {
                return this.defaultRoute(queryString);
            }

            if (!this.indexView) {
                this.indexView = new IndexMobileView(parseQueryString(queryString));
                this.viewManager.showView(this.indexView);
            }

            this.indexView.showSearchCriteria();
        },
        disclaimer: function(queryString) {
            //mobile support only
            if (!Utils.isMobile()) {
                return this.defaultRoute(queryString);
            }

            if (!this.indexView) {
                this.indexView = new IndexMobileView(parseQueryString(queryString));
                this.viewManager.showView(this.indexView);
            }

            this.indexView.showDisclaimer();
        },
        defaultRoute: function(queryString) {

            if (Utils.isMobile()) {

                if (this.indexView) {

                    if (!queryString) {
                        this.indexView.showResults();
                        return;
                    }
                    else {
                        var options = parseQueryString(queryString);
                        if (options && options.mlsNumber) {
                            this.indexView.showListing(options.mlsNumber);
                            return;
                        }
                    }
                }

                this.indexView = new IndexMobileView(parseQueryString(queryString));
            }
            else {

                this.indexView = new IndexView(parseQueryString(queryString));
            }

            this.viewManager.showView(this.indexView);
        }
    });

    function parseQueryString(queryString){
        var params = null;

        if(queryString){
            params = {};
            _.each(
                _.map(decodeURI(queryString).split(/&/g),function(el,i){
                    var aux = el.split('='), o = {};
                    if(aux.length >= 1){
                        var val = undefined;
                        if(aux.length == 2)
                            val = aux[1];
                        o[aux[0]] = val;
                    }
                    return o;
                }),
                function(o){
                    _.extend(params,o);
                }
            );
        }
        return params;
    }

    return IdxRouter;
});