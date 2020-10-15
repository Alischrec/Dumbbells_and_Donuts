
$(document).ready(function() {

    // if (typeof localStorage.userProfile !== undefined) {
    //     $(".welcomeBack").attr("class","welcomeBack show");
    //     $("#title").attr("class","hide");
    // }


})


$("#submit").on("click", function (event) {
  event.preventDefault();

  let varname = fullName.value;
  let varemail = email.value;
  let varheightFoot = heightFoot.value;
  let varheightInch = heightInch.value;
  let varweight = weightinlbs.value;
 //let varweight = 120;


 console.log ("name " + varname);
 console.log("email " + varemail);
 console.log("foot " + varheightFoot);
 console.log("inch " + varheightInch);
 console.log("Weight " + varweight);

  if (varheightFoot == '') {
    $("#validation_height").html("<p>Please enter a valid height value</p>");
  } else 
  if (isNaN(varweight) || varweight === '') {
    $("#validation_weight").html("<p>Please enter a valid weight value</p>");
    $("#validation_height").attr("class","hide");
  } else {
    $("#validation_weight").attr("class","hide");
    $("#validation_height").attr("class","hide");
    
    let varbmi = ((703*parseFloat(varweight))/(Math.pow((12*parseInt(varheightFoot)+parseInt(varheightInch)),2))).toFixed(2);

    console.log("BMI " + varbmi);
    let userProfile = {
      full_name: varname,
      email: varemail,
      heightFoot: varheightFoot,
      heightInch: varheightInch,
      weight: varweight,
      bmi: varbmi,
    };

    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    $("#selectnextPage").attr("class", "show");
  }
});
