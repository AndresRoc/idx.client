/*global define*/
define([
    'handlebars',
    'utils',
    'moment',
    'momentTimezone'
], function (Handlebars, Utils, moment, momentTimezone) {
    'use strict';

    Handlebars.registerHelper('format-date', function(date, format, options) {
        var _date = moment(date);
        _date.tz(Utils.getAppConfig().serviceTimezone);
        return options.fn({formattedDate:_date.format(format)});
    });

    Handlebars.registerHelper('current-year', function(options) {
        return options.fn({yearValue:moment().format('YYYY')});
    });

    Handlebars.registerHelper('format-open-house-datetime', function(openHouse, options) {
        if (!openHouse || !openHouse.openHouseDate) {
            return;
        }

        var openHouseDate = moment(openHouse.openHouseDate).format("ddd, MMM Do");

        var startTime = moment();
        startTime.hour(("" + openHouse.startTime).substr(0, 2));
        startTime.minute(("" + openHouse.startTime).substr(2, 2));

        startTime = startTime.format("h:mm a");

        var endTime = moment();
        endTime.hour(("" + openHouse.endTime).substr(0, 2));
        endTime.minute(("" + openHouse.endTime).substr(2, 2));

        endTime = endTime.format("h:mm a");

        return options.fn({formattedDate:openHouseDate + " @ " + startTime + " - " + endTime});
    });

});