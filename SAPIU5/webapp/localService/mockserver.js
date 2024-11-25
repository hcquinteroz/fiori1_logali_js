sap.ui.define([
    'sap/ui/core/util/MockServer',
    'sap/ui/model/json/JSONModel',
    'sap/base/util/UriParameters',
    'sap/base/Log'
],
    /**
     * @param {typeof sap.ui.core.util.MockServer} MockServer
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.base.util.UriParameters} UriParameters
     * @param {typeof sap.base.Log} Log
     */
    function (MockServer, JSONModel, UriParameters, Log) {
        "use strict";

        let oMockServer,
            _sAppPath = "logaligroup/SAPUI5/",
            _sJsonFilesPath = _sAppPath + "localService/mockdata";

        let oMockServerInterface = {
            /**
             * Initializes the mock server asynchronously
             * @protected
             * @param {object} oOptionParameter
             * @returns {Promise} a promise that is resolved when the mock server has been started
             */
            init: function (oOptionParameter) {
                let oOptions = oOptionParameter || {};
                return new Promise(function (fnResolve, fnReject) {
                    let sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function () {
                        let oUriParameters = new UriParameters(window.location.href);

                        // Parse manifest for local metadata URI
                        let sJsonFileUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        let oMainDatasource = oManifestModel.getProperty("/sap.app/dataSources/northwind-ds");
                        let sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDatasource.settings.localUri);

                        // Ensure there is a trailing slash
                        let sMockServerUrl = oMainDatasource.uri && new URI(oMainDatasource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                        // Create a mock server instance or stop the existing one to reinitialize
                        if (!oMockServer) {
                            oMockServer = new MockServer({
                                rootUri: sMockServerUrl
                            })
                        } else {
                            oMockServer.stop();
                        }

                        // Configure Mock Server with the given options or a default delay of 0.5s
                        MockServer.config({
                            autoRespond: true,
                            autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                        });

                        // Simulate all requests using mock data
                        oMockServer.simulate(sMetadataUrl, {
                            sMockdataBaseUrl: sJsonFileUrl,
                            bGenerateMissingMockData: true
                        });

                        let aRequests = oMockServer.getRequests();

                        // Compose an error response for each request
                        let fnResponse = function (iErrorCode, sMessage, aRequest) {
                            aRequest.response = function (oXhr) {
                                oXhr.respond(iErrorCode, { "Content-Type": "text/plain;charset=utf-8" }, sMessage);
                            };
                        };

                        // Simulate metadata errors
                        if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                            aRequests.forEach(function (aEntry) {
                                if (aEntry.path.toString().indexof("$metadata") > -1) {
                                    fnResolve(500, "metadata error", aEntry);
                                }
                            });
                        }

                        // Simulate request errors
                        let sErrorParam = oOptions.errorType || oUriParameters.get("errorType");
                        let iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

                        if (sErrorParam) {
                            aRequests.forEach(function (aEntry) {
                                fnResponse(iErrorCode, sErrorParam, aEntry);
                            });
                        }

                        // Set requests and start the server
                        oMockServer.setRequests(aRequests);
                        oMockServer.start();

                        Log.info("Running the app with mock data");
                        fnResolve();
                    });

                    oManifestModel.attachRequestFailed(function() {
                        let sError = "Failed to load the application manifest";
                        Log.error(sError);
                        fnReject(new Error(sError));
                    });
                });
            }
        };

        return oMockServerInterface;
    });