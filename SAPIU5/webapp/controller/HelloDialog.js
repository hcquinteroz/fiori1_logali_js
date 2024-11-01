sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.base.ManagedObject} ManagedObject
     * @param {typeof sap.ui.core.Fragment} Fragment
     */
    function (ManagedObject, Fragment) {

        'use strict';

        return ManagedObject.extend("logaligroup.SAPUI5.controller.HelloDialog", {

            // Implementación del constructor
            constructor: function (oView) {
                this._oView = oView; // Asignamos la vista que nos llega por parámetro, que es la instancia de la vista desde donde se invoque el Diálogo

            },

            exit: function () {
                delete this._oView; // Eliminamos el atributo creado _oView cuando se destruye el objeto Diálogo
            },

            // Función encargada de abrir el Diálogo
            // Acá nos traemos la lógica que teníamos en en la función onOpenDialog del HelloPanel.controller.js
            open: function () {
                // Obtenemos la instancia de la vista
                const oView = this._oView;

                //Cargamos el fragmento (diálogo)
                // Create dialog lazily
                if (!oView.byId("helloDialog")) { // Valida si el diálog ya está cargado

                    // Construimos el objeto oFragmentController y obtenemos el controlador
                    let oFragmentController = {
                        onCloseDialog: function () {
                            oView.byId("helloDialog").close(); // Obtenemos la instancia del diálogo
                        }
                    };

                    // Load async XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "logaligroup.SAPUI5.view.HelloDialog",
                        controller: oFragmentController // Indicamos al diálogo cuál es su controlador
                    }).then(function (oDialog) {
                            oView.addDependent(oDialog); // Agregamos el diálogo a la vista
                            oDialog.open();
                        });
                } else {
                    oView.byId("helloDialog").open();
                }
            }
        });

    });