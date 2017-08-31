/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Copyright Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['rmm'] = this.createHubProxy('rmm');
        proxies['rmm'].client = {};
        proxies['rmm'].server = {
            addOrder: function (ord, ticket) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["AddOrder"], $.makeArray(arguments)));
            },

            cancelOrder: function (ordId, ticket) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["CancelOrder"], $.makeArray(arguments)));
            },

            getHisOrder: function (accountID, start, end) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["GetHisOrder"], $.makeArray(arguments)));
            },

            iceUserLogin: function (userName) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["IceUserLogin"], $.makeArray(arguments)));
            },

            isConnected: function () {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["IsConnected"], $.makeArray(arguments)));
            },

            quote: function (conId, quoteStr) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["Quote"], $.makeArray(arguments)));
            },

            regDuplicatedLogon: function (ticket) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["RegDuplicatedLogon"], $.makeArray(arguments)));
            },

            send: function (name, message) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["Send"], $.makeArray(arguments)));
            },

            sendHistoryMinuteData: function (data) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SendHistoryMinuteData"], $.makeArray(arguments)));
            },

            sendHistoryMinutesData: function (data) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SendHistoryMinutesData"], $.makeArray(arguments)));
            },

            sendInformation: function (qInfo) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SendInformation"], $.makeArray(arguments)));
            },

            sendQutoe: function (qInfo) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SendQutoe"], $.makeArray(arguments)));
            },

            setProfitLoss: function (plInfo, ticket) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SetProfitLoss"], $.makeArray(arguments)));
            },

            startHistoryQuotes: function () {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["StartHistoryQuotes"], $.makeArray(arguments)));
            },

            subContracts: function (conIds) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubContracts"], $.makeArray(arguments)));
            },

            subHistoryMinutes: function (contractID) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubHistoryMinutes"], $.makeArray(arguments)));
            },

            submitSetProfitLoss: function (ord, ticket) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubmitSetProfitLoss"], $.makeArray(arguments)));
            },

            submitSimpleBracket: function (ord, ticket) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubmitSimpleBracket"], $.makeArray(arguments)));
            },

            subScribeHistoryQuote: function (contractID) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubScribeHistoryQuote"], $.makeArray(arguments)));
            },

            subScribeQuote: function (contractId) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubScribeQuote"], $.makeArray(arguments)));
            },

            subScribeQuotes: function (contractIds) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubScribeQuotes"], $.makeArray(arguments)));
            },

            subScribeSpecifiedQuotes: function (contractIDs, ticket) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["SubScribeSpecifiedQuotes"], $.makeArray(arguments)));
            },

            unSubScribeQuote: function (contractId) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["UnSubScribeQuote"], $.makeArray(arguments)));
            },

            unSubScribeQuotes: function (contractIds) {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["UnSubScribeQuotes"], $.makeArray(arguments)));
            },

            updateAccount: function () {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["UpdateAccount"], $.makeArray(arguments)));
            },

            updateAsset: function () {
                return proxies['rmm'].invoke.apply(proxies['rmm'], $.merge(["UpdateAsset"], $.makeArray(arguments)));
            }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));