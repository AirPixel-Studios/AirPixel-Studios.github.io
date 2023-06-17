$(document).ready(function () {
  "use strict";

  var cells = $("#cellSelect").val();
  var numberBats = $("#batteryNumberSelect").val();
  var splits = parseInt($("#splitSelect").val());

  const cellDeviation = {
    "1S": 0.1,
    "2S": 0.2,
    "3S": 0.3,
    "4S": 0.4,
    "5S": 0.5,
    "6S": 0.6,
  };

  $(".calculateBtn").on("click", function () {
    let batArray = [];

    for (var i = 1; i <= numberBats; i++) {

      let voltage = parseFloat($(`#bat_${i}_value`).val());

      if (isNaN(voltage)) {
        $('#modalInfo').modal('show')
        return;
      }

      batArray.push({
        batNo: $(`#bat_${i}_no`).val(),
        batVoltage: $(`#bat_${i}_value`).val(),
        batOrderNo: null,
      });
    }

    let batsSorted = batArray.sort((a, b) => a.batVoltage - b.batVoltage);

    let batsOrdered = [];
    let temp = [];

    for (let i = 0; i < batsSorted.length; i++) {
      batsSorted[i].batOrderNo = i + 1;

      if (temp.length === 0) {
        temp.push(batsSorted[i]);
      } else if (
        (batsSorted[i].batVoltage - temp[0].batVoltage).toFixed(2) <=
          cellDeviation[cells] &&
        temp.length < splits
      ) {
        temp.push(batsSorted[i]);
      } else {
        batsOrdered.push(temp);
        temp = [];
        temp.push(batsSorted[i]);

        if (i === batsSorted.length - 1) {
          batsOrdered.push(temp);
        }
      }
    }

    deleteAllChildNodes();    

    var index = 1;
    batsOrdered.forEach((element) => {
      let title = document.createElement("h3");
      title.style.marginTop = "25px";
      title.innerHTML = index + ". Battery Group";
      document.getElementById("batteryInput").appendChild(title);

      element.forEach((item) => {
        addRow(item.batNo, item.batVoltage, item.batOrderNo);
      });

      index += 1;
    });

    $(".calculateBtn").hide();
    // document.getElementsByClassName("calculateBtn")[0].style.display = "none";
    // document.getElementById("resetBtn").style.display = "block";
  });

  function addRow(batnumber, batVoltage, batOrderNumber) {
    let div = document.createElement("div");
    div.className = "row";

    let batDiv = document.createElement("div");
    batDiv.className = "col-sm";

    let batDiv_1 = document.createElement("div");
    batDiv_1.className = "col-sm";

    let batNoDiv = document.createElement("input");
    batNoDiv.type = "text";
    batNoDiv.className = "form-control";
    batNoDiv.value = batnumber;
    batNoDiv.setAttribute("readOnly", "");

    let batVoltageDiv = document.createElement("input");
    batVoltageDiv.type = "text";
    batVoltageDiv.className = "form-control";
    batVoltageDiv.value = batVoltage;
    batVoltageDiv.setAttribute("readOnly", "");

    batDiv.appendChild(batNoDiv);
    batDiv_1.appendChild(batVoltageDiv);
    div.appendChild(batDiv);
    div.appendChild(batDiv_1);

    document.getElementById("batteryInput").appendChild(div);
  }

  $(".resetBtn").on("click", function () {
    // document.getElementsByClassName("calculateBtn")[0].style.display = "block";
    $(".calculateBtn").show();
    setBatteryRows(numberBats);
  });

  function setBatteryRows(rows) {
    deleteAllChildNodes();
    for (let i = 1; i <= rows; i++) {
      let div = document.createElement("div");
      div.className = "row";

      let batDiv = document.createElement("div");
      batDiv.className = "col-sm";

      let batDiv_1 = document.createElement("div");
      batDiv_1.className = "col-sm";

      let batNoDiv = document.createElement("input");
      batNoDiv.id = `bat_${i}_no`;
      batNoDiv.type = "text";
      batNoDiv.className = "form-control";
      batNoDiv.value = i;
      batNoDiv.setAttribute("readOnly", "");

      let batVoltageDiv = document.createElement("input");
      batVoltageDiv.id = `bat_${i}_value`;
      batVoltageDiv.type = "text";
      batVoltageDiv.className = "form-control";

      batDiv.appendChild(batNoDiv);
      batDiv_1.appendChild(batVoltageDiv);
      div.appendChild(batDiv);
      div.appendChild(batDiv_1);

      document.getElementById("batteryInput").appendChild(div);
    }
  }

  function deleteAllChildNodes() {
    document.getElementById("batteryInput").replaceChildren();
  }

  $('#batteryNumberSelect').change(function () {
    numberBats = $("#batteryNumberSelect").val();
    setBatteryRows(numberBats);
});
});
