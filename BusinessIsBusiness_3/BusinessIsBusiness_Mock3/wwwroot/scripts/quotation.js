﻿var quotationItems = [];
var counter = 0;

function Record(id, name, up, qty, tp, discount, fp) {
    Product.call(this, name, up);
    this.id = id;
    this.quantity = qty;
    this.totalPrice = tp;
    this.discountPercentage = discount;
    this.finalPrice = fp;

    this.productType = productType; // ora un record conserva un riferimento sul tipo di prodotto

    //next step: salvo qualsiasi cosa input nel record
    // ogni volta che si genera un record, prende i valori specifici dalle textbox
    // le textbox che non sono visualizzate, non sono compilate
    // ne consegue che il record avrà determinati campi "".
    this.volumeLength = $("#volumeLength").val();
    this.volumeHeight = $("#volumeHeight").val();
    this.volumeWidth = $("#volumeWidth").val();

    this.areaLength = $("#areaLength").val();
    this.areaHeight = $("#areaHeight").val();

    this.units = $("#quantity").val();

}

Record.prototype = Object.create(Product.prototype);

function AddToQuotation(customizedProduct) {
    // aggiorno il contatore
    var recordId = 'rec' + counter++;

    // dal prodotto personalizzato, ricavo nome e prezzo BASE (PRODUCT)
    var name = customizedProduct.getProductName();
    var price = customizedProduct.getUnitPrice();

    // leggo i valori calcolati dalle textbox
    var inputQuantity = $("#totalQuantity").val();
    var inputTotalPrice = $("#totalPrice").val();
    var inputDiscountPercentage = ($("#discount").val() == "") ? 0 : $("#discount").val();
    var inputFinalPrice = $("#finalPrice").val();

    // creo un nuovo record con i valori ricavati sopra
    var newItem = new Record(recordId, name, price, inputQuantity, inputTotalPrice, inputDiscountPercentage, inputFinalPrice);

    // l'oggetto creato lo piazzo in array
    quotationItems.push(newItem);

    // demando la creazione di una riga
    CreateGraphicRow(newItem);

    // chiamo la funzione che aggiorna il totale
    getQuotationAmount();
}

function CreateGraphicRow(itemObj) { // a questa funzione ora passo un oggetto di array, dal quale estrarre le informazioni per la riga
    var content = $("tbody");

    var row = $("<tr></tr>")
        .addClass('quotation-row')
        .attr('id', `${itemObj.id}`)
        .appendTo(content);

    var definitions = row
        .html(`<td>${itemObj.getProductName()}</td>
               <td>${itemObj.getUnitPrice()}</td>
               <td>${itemObj.quantity}</td>
               <td>${itemObj.totalPrice}</td>
               <td>${itemObj.discountPercentage}</td>
               <td>${itemObj.finalPrice}</td>
               <td>
                <div class="btn-group" id="groups">
                    <button type="button" class="btn btn-default up"><span class="glyphicon glyphicon-circle-arrow-up"></span></button>
                    <button type="button" class="btn btn-default down"><span class="glyphicon glyphicon-circle-arrow-down"></span></button>
                    <button type="button" class="btn btn-default edit" data-toggle="modal" data-target="#prova"><span class="glyphicon glyphicon-edit"></span></button>
                    <button type="button" class="btn btn-default remove"><span class="glyphicon glyphicon-trash"></span></button>
                </div>
               </td>`)
        .appendTo(row);

    // una volta che ho una riga, posso gestirne i pulsanti cablati:
    RowEvents();
}






function getQuotationAmount() {
    var result = 0;
    var partialTotals = quotationItems.map(function (x) { return x.finalPrice });

    for (var i = 0; i < partialTotals.length; i++) {
        result = +result + +partialTotals[i];
    }
    $("#tot").text(result);
}

function RowEvents() {
    $("tbody").find("tr:last .up").click(function (event) {
        var currentRow = $(this).closest("tr");
        var firstRowId = $(this).parents("tbody").find('tr:first').attr('id');

        if (currentRow.attr("id") === firstRowId) {
            alert("Non è possibile spostare più in alto la prima riga!")
        } else {
            MoveUpRow(currentRow);
        }
    });

    $("tbody").find("tr:last .down").click(function (event) {
        var currentRow = $(this).closest("tr");
        var lastRowId = $(this).parents("tbody").find('tr:last').attr('id');

        if (currentRow.attr("id") === lastRowId) {
            alert("Non è possibile spostare più in basso l'ultima riga!")
        } else {
            MoveDownRow(currentRow);
        }
    });

    $("tbody").find("tr:last .edit").click(function (event) {
        currentRow = $(this).closest("tr");
        // TODO
        $("#add").hide();
        $("#modify").show();

    });

    $("tbody").find("tr:last .remove").click(function (event) {
        var currentRow = $(this).closest("tr");
        var itemIndex = quotationItems.map(function (x) { return x.id }).indexOf(currentRow.attr('id'));

        if (itemIndex > -1) {
            quotationItems.splice(itemIndex, 1);
        }

        currentRow.remove();
        getQuotationAmount(); // il totale si aggiorna anche quando una riga viene rimossa
    });

    function MoveUpRow(row) {
        var current = $(row),
            previous = $(row.prev()),
            placeholder = $("<tr><td></td></tr>");
        previous.after(placeholder);

        current.after(previous);
        placeholder.replaceWith(current);
    }

    function MoveDownRow(row) {
        var current = $(row),
            next = $(row.next()),
            placeholder = $("<tr><td></td></tr>");
        current.after(placeholder);

        next.after(current);
        placeholder.replaceWith(next);
    }

}
