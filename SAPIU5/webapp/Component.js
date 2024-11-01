sap.ui.define([
    'sap/ui/core/UIComponent',
    "logaligroup/SAPUI5/model/Models",
    "sap/ui/model/resource/ResourceModel",
    "./controller/HelloDialog"
],
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap/ui/model/resource/ResourceModel} ResourceModel
     */
    function (UIComponent, Models, ResourceModel, HelloDialog) {
        'use strict';

        return UIComponent.extend("logaligroup.SAPUI5.Component", {

            metadata: {
                manifest: 'json'
            },

            init: function () {
                // Call the init function of the parent
                UIComponent.prototype.init.apply(this, arguments);

                // Set i18n model on the view
                var i18nModel = new ResourceModel({ bundleName: "logaligroup.SAPUI5.i18n.i18n" });
                this.setModel(i18nModel, "i18n");

                // Set data model on the view
                this.setModel(Models.createRecipient());

                // Obtenemos la instancia del controlador desde donde se invoca el diálogo
                this._helloDialog = new HelloDialog(this.getRootControl());
            },

            // Función de apertura del diálogo para ser invocada desde cualquier parte de la aplicación
            openHelloDialog: function () {
                this._helloDialog.open();
            },

            // Liberamos los recursos que hemos creado
            exit: function () {
                this._helloDialog.destroy();
                delete this._helloDialog;
            }
        });
    });