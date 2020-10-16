let app_id = '40d3953c';
let APIKey = '3b1a7af407f95e939b45bbf3554de014';

let query = "https://api.edamam.com/api/food-database/v2/parser?ingr=pepperoni%20pizza&app_id="+app_id+"&app_key="+APIKey;
/* example of parser query
$.ajax({
    url: query,
    method: "GET"
  }).done(function(response) {
      
    console.log(response);})*/

    //// create data for post request

  /*  
let data_ex = {
  "ingredients": [
    {
      "quantity": 1,
      "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_serving",
      "foodId": "food_a1gb9ubb72c7snbuxr3weagwv0dd"
    }
  ]
}; */

AJAX_POST_URL = "https://api.edamam.com/api/food-database/v2/nutrients?app_id="+app_id+"&app_key="+APIKey;
/* example of nutrion query
$.ajax({
  beforeSend: function(xhrObj){
    xhrObj.setRequestHeader("Content-Type","application/json");
},
  url : AJAX_POST_URL,
  type: "POST",
  //headers: {"Content-Type": "application/json"},
  data : JSON.stringify(data_ex),
  dataType: "json"
}).done(function(response){
  console.log(response);
}).fail(function(response){
  console.log(response);
})
*/
let totalCal = 0;
let totalPr = 0;
let totalFat = 0;
let totalCarb = 0;
let totalSugar = 0;
let totalFiber = 0;

let last = JSON.parse( localStorage.getItem('lastTotal'));
let todayLast = false;
let today = new Date();
let todayDate = today.toLocaleDateString()
if (last){
  if (last.day == todayDate){
    todayLast = true;
    totalCal = parseFloat(last.cal);
    totalPr = parseFloat(last.pr);
    totalFat = parseFloat(last.fat);
    totalCarb = parseFloat(last.carb);
    totalSugar = parseFloat(last.sug);
    totalFiber = parseFloat(last.fib);
  }
};



///add parsing of local storage
// if day === new Date().toLocalString date: total parse from that object

function renderTotal(){
  /**
       *Calories
        Protein
        Fat
        Carbs
        Sugar
        Fiber
       */
  $("#total-cal").text(totalCal);
  $("#total-pr").text(totalPr);
  $("#total-fat").text(totalFat);
  $("#total-carb").text(totalCarb);
  $("#total-sugar").text(totalSugar);
  $("#total-fiber").text(totalFiber);
}
renderTotal()

$("#find-food").on("click", function(event) {

  event.preventDefault();
  let food = $("#food-input").val();
  console.log(food);
  let query = "https://api.edamam.com/api/food-database/v2/parser?ingr="+food+"&app_id="+app_id+"&app_key="+APIKey;
  $.ajax({
    url: query,
    method: "GET"
  }).done(function(response) {
      
    console.log(response);
    let nutr = response.parsed[0].food.nutrients
    let parsed = response.parsed;
    let ingr = [];
    parsed.forEach(function(el) {
      console.log(el.food.foodId);
      console.log(el.food.nutrients.ENERC_KCAL);
      //console.log(el.measure.uri); 
      //console.log(el.quantity);
      /**
       * {
      "quantity": 1,
      "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_serving",
      "foodId": "food_aeqk7lua3h3qopbk2qew0aeif5p8"
       }
       */
      ///add default values for quantity and m.uri
      let qu = el.quantity;
      if (!qu){
        qu = 1;
      }
      let me = "";
      if (!el.measure){
        me = "http://www.edamam.com/ontologies/edamam.owl#Measure_serving";
      }
      else{
        me = el.measure.uri;
      }
      
      let foodID = el.food.foodId;
      let new_ing = {'quantity':qu,'measureURI':me,'foodId': foodID};
      ingr.push(new_ing);
    });
    
    ingr.forEach(function(el){
    data_post = {'ingredients':[el]};
    console.log("======data-post====");
    console.log(data_post);
/// work with just one ingridient , have to have loop
    $.ajax({
      beforeSend: function(xhrObj){
        xhrObj.setRequestHeader("Content-Type","application/json");
    },
      url : AJAX_POST_URL,
      type: "POST",
      data : JSON.stringify(data_post),
      dataType: "json"
    }).done(function(response){
      
      console.log(response);
      let nutr = response.totalNutrients;
      let cal = nutr.ENERC_KCAL;
      console.log(cal);
      let calorie =cal.quantity;
      
      let proteins = 0 ;
      if(nutr.PROCNT){
        proteins = nutr.PROCNT.quantity;}

      let fat = 0;
      if (nutr.FAT){
        fat = nutr.FAT.quantity;}
      
      let carb = 0
      if(nutr.CHOCDF){
        carb = nutr.CHOCDF.quantity;}
      
      let sugar = 0;
      if(nutr.SUGAR){
        sugar = nutr.SUGAR.quantity;}
      
      let fiber = 0;
      if(nutr.FIBTG){
        fiber = nutr.FIBTG.quantity;}
      /**
       *Calories
        Protein
        Fat
        Carbs
        Sugar
        Fiber
       */
      totalCal+=calorie;
      totalPr+=proteins;
      totalFat+=fat;
      totalCarb+=carb;
      totalSugar+=sugar;
      totalFiber+=fiber;
      /// add table row
    
      let new_row = $("<tr>");
      let foodCol = $("<td>");
      foodCol.text(food);
      let calCol = $("<td>");
      calCol.text(calorie);
      let prCol = $("<td>");
      prCol.text(proteins);
      let fatCol = $("<td>");
      fatCol.text(fat);
      let carbCol = $("<td>");
      carbCol.text(carb);
      let sugarCol = $("<td>");
      sugarCol.text(sugar);
      let fiberCol = $("<td>");
      fiberCol.text(fiber);
      new_row.append(foodCol,calCol,prCol,fatCol,carbCol,sugarCol,fiberCol);
      $("#food-view").append(new_row);
      renderTotal();
    }).fail(function(response){
      console.log(response);
    });
    });

  ////add row to table
    
  }).fail(function(error){console.log(error)});

})

$("#total-save").on("click", function(event) {
  event.preventDefault();
  let dt = new Date();
  let dateSave = dt.toLocaleDateString();
  let totSaveCal = $("#total-cal").text();
  let totSavePr = $("#total-pr").text();
  let totSaveFat = $("#total-fat").text();
  let totSaveCarb = $("#total-carb").text();
  let totSaveSug = $("#total-sugar").text();
  let totSaveFib = $("#total-fiber").text();
  console.log("=====Date====");
  console.log(dateSave);
   /* I need logic how I save history
  I save date and cal(all nutr)
  if lastTotal is today , than I rewrite last elem in arr, else I add new
  and to it before I save last total
  */
  
  

  let objS = {'day':dateSave,'cal':totSaveCal,'pr':totSavePr, 'fat':totSaveFat,'carb':totSaveCarb,'sug':totSaveSug,'fib':totSaveFib};
  localStorage.setItem("lastTotal",JSON.stringify(objS));
  let calHist = JSON.parse(localStorage.getItem("calHist"));
  let daysHist = JSON.parse(localStorage.getItem("daysHist"));
  if (!calHist){
    calHist = [];
    daysHist = [];
  }
  if (todayLast){
    /// update last element in calHist and daysHist
    calHist[calHist.length -1] = totSaveCal;
    daysHist[daysHist.length-1] = dateSave;
  }
  else{
    /// add new element
    calHist.push(totSaveCal);
    daysHist.push(dateSave);
    todayLast = true;

  }
 localStorage.setItem("calHist",JSON.stringify(calHist));
 localStorage.setItem("daysHist",JSON.stringify(daysHist));
});