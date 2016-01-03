var amount = 1,
    amountUnits = "proof",
    startingABV = 100,
    desiredABV = 80,
    amountWaterOz = 0,
    amountWaterTeaspoon = 0;
    amountWaterCups = 0;

//Conversion    
var ozToTeaspoons = 0.1666666666666667,
    ozToCups = 8;

function errorHandler(errorCode) {
    $('[data-error="'+ errorCode + '"]').removeClass('is-hidden').siblings().addClass('is-hidden');
    
    if (errorCode > 0) {
       //$('.hp-results').addClass('is-hidden');
    }
    
    else {
       $('[data-error]').addClass('is-hidden');
    }
    
    if (errorCode === 0) { 
        $('.hp-input').removeClass('has-error');
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

function single(target, value) {    
    value = parseFloat(value);
    
    if(value === 1) {
        target.next('.hp-unit').children('.plural').addClass('is-hidden');
    }
    
    else {
        target.next('.hp-unit').children('.plural').removeClass('is-hidden');    
    }
}

function convert() {
    //console.log(amount);
    //console.log(startingABV);
    //console.log(desiredABV);

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

    single($('#result-oz'), amountWaterOz);
    $('#result-oz').text(+(amountWaterOz).toFixed(2));
    
    if(amountWaterOz >= 2 ) {
        single($('#result-translate'), amountWaterCups);
        $('#result-translate').text(+(amountWaterCups).toFixed(2));
        $('#result-cups').removeClass('is-hidden');
        $('#result-teaspoons').addClass('is-hidden');
    }
    
    else {
        single($('#result-translate'), amountWaterTeaspoon);
        $('#result-translate').text(+(amountWaterTeaspoon).toFixed(2));    
        $('#result-teaspoons').removeClass('is-hidden');
        $('#result-cups').addClass('is-hidden');
    }    
}

$('.input-resize').autosizeInput();

$('input[data-visibility]').click(function(){
    var visibilityType = $(this).data('visibility');
    
    $('.hp-inputs').attr('data-visibility', visibilityType);
    
    if (amountUnits === 'abv' && visibilityType === 'proof') {
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
    
    amountUnits = visibilityType;
});

$('.hp-input').keyup(function(){
    value = $(this).val();

    data();
    setTimeout(convert(), 1000);
    results();   
    
    single($(this), value);
});