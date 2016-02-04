var amount = 1,
    amountUnits = "ounce",
//    appFunction = "dilute",
    startingUnits = "proof",
    startingABV = 100,
    desiredABV = 80,
    amountWaterOz = 0,
    amountWaterTeaspoon = 0;
    amountWaterCups = 0;

//Conversion    
var ozToTeaspoons = 0.1666666666666667,
    ozToCups = 8;
    ozToJigger = 1.5;

function errorHandler(errorCode) {
    $('[data-error="'+ errorCode + '"]').removeClass('is-hidden').siblings().addClass('is-hidden');
    
    if (errorCode === 0) { 
        $('.hp-input').removeClass('has-error');
        $('[data-error]').addClass('is-hidden');
    }
    
    else if (errorCode === 1) {
        $('#amount').addClass('has-error');
        $('.hp-results').addClass('is-hidden');
    }

    else if (errorCode === 2) {
        $('#abv-starting, #abv-desired').addClass('has-error');
        $('.hp-results').addClass('is-hidden');
    }

    else {
       return; 
    }
}

function plural(target, value) {    
    value = parseFloat(value).toFixed(2);
    
    if(value === "1.00") {
        target.parents('.hp-input__group, .hp-result__group').find('.plural').addClass('is-hidden');
    }
    
    else {
        target.parents('.hp-input__group, .hp-result__group').find('.plural').removeClass('is-hidden');    
    }
}

function convert() {
    if (amountUnits === "cups") {
        amount = amount * ozToCups;
    }

    else if (amountUnits === "jiggers") {
        amount = amount * ozToJigger;
    }
    
    else {
        return;
    }    
}

function dilute() {
    if(isNaN(amount)) {
        amount = 0;
        startingABV = 0;
        desiredABV = 0;
    }

    else if(isNaN(startingABV)) {
        amount = 0;
        startingABV = 0;
        desiredABV = 0;
    }

    else if(isNaN(desiredABV)) {
        amount = 0;
        startingABV = 0;
        desiredABV = 0;
    }

    else {
        amountWaterOz = ((startingABV - desiredABV) / desiredABV) * amount;
        amountWaterTeaspoon = amountWaterOz / ozToTeaspoons;
        amountWaterCups = amountWaterOz / ozToCups;        
    }
}

function data() {
    amount = $('#amount').val();
    startingABV = $('#abv-starting').val();
    desiredABV = $('#abv-desired').val();
    
    convert();
    
    amount = parseFloat(amount);
    startingABV = parseFloat(startingABV);
    desiredABV = parseFloat(desiredABV);        
}

function results() {

    if(amount <= 0) {
        errorHandler(1);
    }
    
    else if( desiredABV > startingABV) {
        errorHandler(2);
    }
    
    else {
        errorHandler(0);
        
        amountWaterOz = ((startingABV - desiredABV) / desiredABV) * amount;
        amountWaterTeaspoon = amountWaterOz / ozToTeaspoons;
        amountWaterCups = amountWaterOz / ozToCups;
        
        $('.hp-results').removeClass('is-hidden'); 
    }

    plural($('#result-oz'), amountWaterOz);
    $('#result-oz').text(+(amountWaterOz).toFixed(2));

    if(amountWaterOz >= 2 ) {
        plural($('#result-translate'), amountWaterCups);
        $('#result-translate').text(+(amountWaterCups).toFixed(2));
        $('#result-cups').removeClass('is-hidden');
        $('#result-teaspoons').addClass('is-hidden');
    }
    
    else {
        plural($('#result-translate'), amountWaterTeaspoon);
        $('#result-translate').text(+(amountWaterTeaspoon).toFixed(2));    
        $('#result-teaspoons').removeClass('is-hidden');
        $('#result-cups').addClass('is-hidden');
    }    
}

$('.input-resize').autosizeInput();

$('input[data-visibility]').click(function(){
    var visibilityType = $(this).data('visibility');
    
    $('.hp-inputs').attr('data-visibility', visibilityType);
    
    if (startingUnits === 'abv' && visibilityType === 'proof') {
        startingABV = startingABV * 2;
        desiredABV = desiredABV * 2;
        
        $('#abv-starting').val(startingABV);
        $('#abv-desired').val(desiredABV);    
    }
    
    else {
        startingABV = startingABV / 2;
        desiredABV = desiredABV / 2;

        $('#abv-starting').val(startingABV);
        $('#abv-desired').val(desiredABV);    
    }    
    
    startingUnits = visibilityType;
});

$('.hp-input').keyup(function(){
    var value = $(this).val();
    
    data();
    dilute();
    results();   
    
    if($(this).is('#amount')) {
        plural($(this), value);    
    }
});

$('#amount-units input').click(function(){
    amountUnits = $(this).val();

    data();
    dilute();
    results();    
});