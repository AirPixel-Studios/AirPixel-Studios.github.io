$(document).ready(function () {
  "use strict";

  const cellDeviation = {
    "1S": 0.1,
    "2S": 0.2,
    "3S": 0.3,
    "4S": 0.4,
    "5S": 0.5,
    "6S": 0.6,
  };

  $("#calculateBtn").on("click", function () {
    var cells = $("#cellSelect").val();
    var numberBats = $("#batteryNumberSelect").val();
    var splits = parseInt($("#splitSelect").val());

    console.log(cells + ", " + numberBats + ", " + splits);

    let batArray = [];

    for (var i = 1; i <= numberBats; i++) {
      batArray.push({
        batNo: $(`#bat_${i}_no`).val(),
        batVoltage: $(`#bat_${i}_value`).val(),
        batOrderNo: null,
      });
    }

    let batsSorted = batArray.sort((a, b) => a.batVoltage - b.batVoltage);

    let batsOrdered = [];
    let temp = [];

    const result = batsSorted.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/splits)

        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] //new chunk
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
      }, [])
  });
});
