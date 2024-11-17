sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    '../model/InvoicesFormatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, InvoicesFormatter, Filter, FilterOperator) {
        'use strict';

        return Controller.extend("logaligroup.SAPUI5.controller.InvoicesList", {

            formatter: InvoicesFormatter,

            onInit: function () {
                var oViewModel = new JSONModel({
                    usd: "USD",
                    eur: "EUR"
                });
                this.getView().setModel(oViewModel, "currency");
            },

            onFilterInvoices: function(oEvent) {
                const aFilter = [];
                const sQuery = oEvent.getParameter('query');

                if (sQuery) {
                    // aFilter.push(new Filter("ProductName", "EQ", sQuery));
                    aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
                }

                // Aplicamos el filtro al listado de productos
                // Obtenemos desde la vista, el objeto con la lista
                const oList = this.getView().byId("invoiceList");

                // Obtenemos los ítems de la lista
                const oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);
            }
        });

    });