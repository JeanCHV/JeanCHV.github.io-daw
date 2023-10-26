let startValue = 0;
let disabledBtn = document.getElementById("disabledBtn");
disabledBtn.disabled = true;

function addValueFunction(valPar){
    document.getElementById("amount").value;

    if(valPar.value == 'increase'){
        startValue++;
    } else {
        startValue--;
    }
    document.getElementById("amount").textContent = startValue

    if (startValue == 0){
        disabledBtn.disabled = true;
    } else {
        disabledBtn.disabled = false;
    }
}
