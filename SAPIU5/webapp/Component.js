sap.ui.define([
    'sap/ui/core/UIComponent',
    "logaligroup/SAPUI5/model/Models",
    "sap/ui/model/resource/ResourceModel",
    "./controller/HelloDialog",
    "sap/ui/Device"
],
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap/ui/model/resource/ResourceModel} ResourceModel
     * @param {typeof sap/ui/Device} Device
     */
    function (UIComponent, Models, ResourceModel, HelloDialog, Device) {
        'use strict';

        return UIComponent.extend("logaligroup.SAPUI5.Component", {

            metadata: {
                manifest: 'json'
            },

            init: function () {
                // Call the init function of the parent
                UIComponent.prototype.init.apply(this, arguments);

                // Set data model on the view
                this.setModel(Models.createRecipient());

                // Set Device Model
                this.setModel(Models.createDeviceModel(), "device"); // "device": nombre que le damos al modelo

                // Obtenemos la instancia del controlador desde donde se invoca el diálogo
                this._helloDialog = new HelloDialog(this.getRootControl());

                // Inicializamos el enrutamiento definido en el archivo manifest.json
                this.getRouter().initialize();
            },

            // Función de apertura del diálogo para ser invocada desde cualquier parte de la aplicación
            openHelloDialog: function () {
                this._helloDialog.open();
            },

            // Función que retorna la clase CSS a utilizar para el manejo de la densidad de la información, 
            // de acuerdo con el dispositivo
            getContentDensityClass: function () {
                if (!Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
                return this._sContentDensityClass;
            },

            // Liberamos los recursos que hemos creado
            exit: function () {
                this._helloDialog.destroy();
                delete this._helloDialog;
            }
        });
    });