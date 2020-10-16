


function drawChart() {
    let table = [
        ['Date', 'Calories']
      ];
    for(i =0;i< days.length;i++){
        table.push([days[i],parseFloat(cals[i])]);
    }
  var data = google.visualization.arrayToDataTable(table);

  var options = {
    title: 'Calories',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}

$("#draw").on("click", function(event){
    google.charts.load('current', {'packages':['corechart']});
    days = JSON.parse(localStorage.getItem("daysHist"));
    cals = JSON.parse(localStorage.getItem("calHist"));
    if(!days){
        $("#curve_chart").text("there are no saved data");
    }
    else if(!cals){
        $("#curve_chart").text("there are no saved data");
    }
    else{
        google.charts.setOnLoadCallback(drawChart);}
})