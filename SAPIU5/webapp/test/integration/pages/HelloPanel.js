sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
],
    /**
     * @param{typeof sap.ui.test.Opa5} Opa5
     * @param{typeof sap.ui.test.actions.Press} Press
     */
    function (Opa5, Press) {
        "use strict";

        Opa5.createPageObjects({
            onTheAppPage: {
                actions: {
                    iSayHelloDialogButton: function () {
                        return this.waitFor({
                            id: "helloDialogButton", // id que tiene el botón en la vista HelloPanel.view.xml
                            viewName: "logaligroup.SAPUI5.view.HelloPanel",
                            actions: new Press(),
                            errorMessage: "Did not find the 'Say hello dialog button' on the HelloPanel view"
                        });
                    }
                },

                assertions: {
                    iSeeTheHelloDialog: function () {
                        return this.waitFor({
                            controlType: "sap.m.Dialog",
                            success: function () {
                                Opa5.assert.ok(true, "The dialog was opened")
                            },
                            errorMessage: "Did not find the dialog control"
                        });
                    }
                }
            }
        });
    });