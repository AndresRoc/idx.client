/*global define*/
define([
    'handlebars',
    'utils'
], function (Handlebars, Utils) {
    'use strict';

    var rootUrl = Utils.getAppConfig().idxServiceUrl + '/residential/listing/photo/';
    Handlebars.registerHelper('photos-url', function(mlsNumber, photoIndex, photoSize, options) {

        var url = rootUrl + mlsNumber + '/' + photoIndex + '/?size=' + photoSize;

        return options.fn({url:url});
    });

});
