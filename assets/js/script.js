/*global variables initialization */
let workoutType = "";
let workoutLength = "";
let videoFrame = "";

/*Initialize workout library array if it does not exist in localstorage */
if (typeof localStorage.myworkouts === "undefined") {
  var workoutLibrary = [];
} else {
  var workoutLibrary = JSON.parse(localStorage.getItem("myworkouts"));
}

/* This function MET (Metabolic Equivalents) of exercises. 
   MET value is used to calculate the total calories burnt for specific exercise */
function getmetValues(type) {
  let metValue = 1;
  switch (type) {
    case "zumba":
      metValue = 8.8;
      break;
    case "yoga":
      metValue = 4;
      break;
    case "hiit":
      metValue = 8;
      break;
    case "strength":
      metValue = 6;
      break;
    case "pilates":
      metValue = 3.7;
      break;
  }
  return metValue;
}

/* This function calculates the total calories burnt based 
   on length and type of workout and users weight */
function caloriesBurned() {
  let calburnt = 0;
  var currentUser = JSON.parse(localStorage.getItem("userProfile"));
  console.log(getmetValues(workoutType));
  calburnt =
    (currentUser.weight / 2.205) *
    getmetValues(workoutType) *
    0.0175 *
    parseInt(workoutLength);
  console.log(Math.floor(calburnt));
  return Math.floor(calburnt);
}

/* This function is called on click event of submit button on the homepage (index.html)
    Function validates user input for height and weight and calculates the BMI.
    Finally it stores the user stats in local storage for retrieval later */
$("#submit").on("click", function (event) {
  event.preventDefault();
  //Record user input in local variables
  let varname = fullName.value;
  let varemail = email.value;
  let varheightFoot = heightFoot.value;
  let varheightInch = heightInch.value;
  let varweight = weightinlbs.value;

  //Check if user has selected valid height and weight value
  if (varheightFoot == "") {
    $("#validation_height").html("<p>Please enter a valid height value</p>");
  } else if (isNaN(varweight) || varweight === "") {
    $("#validation_weight").html("<p>Please enter a valid weight value</p>");
    $("#validation_height").attr("class", "hide");
  } else {
    $("#validation_weight").attr("class", "hide");
    $("#validation_height").attr("class", "hide");

    //BMI calculation
    let varbmi = (
      (703 * parseFloat(varweight)) /
      Math.pow(12 * parseInt(varheightFoot) + parseInt(varheightInch), 2)
    ).toFixed(2);

    // Store user stats in local storage
    let userProfile = {
      full_name: varname,
      email: varemail,
      heightFoot: varheightFoot,
      heightInch: varheightInch,
      weight: varweight,
      bmi: varbmi,
    };
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    // Show Workout/Nutrition button if user stats are saved successfully
    $("#selectNextPage").attr("class", "show");
  }
});

/* This function highlights the workout type chosen by the user */
$(".workout-type").on("click", function (event) {
  console.log($(this).attr("id"));
  workoutType = $(this).attr("id");
  $(this)
    .toggleClass("workout-selected")
    .siblings()
    .removeClass("workout-selected");
});

/* This function highlights the workout length chosen by the user */
$(".workout-length").on("click", function (event) {
  console.log($(this).attr("id"));
  workoutLength = $(this).attr("id");
  $(this)
    .toggleClass("workout-selected")
    .siblings()
    .removeClass("workout-selected");
});

/* This function calls the google youtube APIs to search for the videos based on 
   user's chosen worktype type and length */
$("#show-workout").on("click", function (event) {
  event.preventDefault();

  // show error message if workout type or length is not chosen
  if (workoutType === "" || workoutLength === "") {
    $("#choose_type_length").foundation("open");
    return;
  }

  // Call  the youtube API search endpoint to search for videos based on user's workout preferences
  let apikey = "AIzaSyAgUshtKqb_q6zx4neWBEy9O1ja2d9cIu0";
  let url =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=" +
    workoutLength +
    " min " +
    workoutType +
    "&regionCode=us&relevanceLanguage=en&type=video&videoEmbeddable=true" +
    "&key=" +
    apikey;

  $.ajax({
    url: url,
    method: "GET",
  }).then(function (response) {

    //choose a video randomly from list of 25 videos returned by search endpoint
    let videoIndex = Math.floor(Math.random() * 25);
    let videoID = response.items[videoIndex].id.videoId;
   
    //Call the API video endpoint to get the video URL
    let urlVideo =
      "https://www.googleapis.com/youtube/v3/videos?part=player&id=" +
      videoID +
      "&maxHeight=342&maxWidth=608" +
      "&key=" +
      apikey;

    $.ajax({
      url: urlVideo,
      method: "GET",
    }).then(function (response) {
   
      //capture the video in videoFrame global variable
      videoFrame = response.items[0].player.embedHtml;

      //calculate the calories burnt and add that info to appropriate div
      $("#calories-info").html(
        " <p class='calories-display'> Awesome! This workout will burn about " +
          caloriesBurned() +
          " calories for you </p>"
      );

      // display video, calories burnt, add to library and schedule workout options 
      $("#display-video").html(videoFrame);
      $("#video-card").attr("class", "card-video cell small-4 show");
      $("#schedule-workout").attr("class", "card cell small-4 show");
      $("#calories-info").attr("class", "card cell small-4 border-none show");
    });
  });
});

/* This function is called in click event for 'Add to Library' button
   Current video on screen will be added to workout library */
$("#add-to-library").on("click", function (event) {
  event.preventDefault();
  if (videoFrame !== "") {
    let video_small = videoFrame.replace('width="608"', 'width="200"');
    video_small = video_small.replace('height="342"', 'height="112.5"');
    workoutLibrary.push(video_small);
    localStorage.setItem("myworkouts", JSON.stringify(workoutLibrary));
  }
  loadWorkoutLibrary();
});

/* This function will retrieve the workout library videos from local storage
   and display them in workout library side pane */
function loadWorkoutLibrary() {
  $("#workout-videos-list").html("");

  if (typeof localStorage.getItem("myworkouts") !== undefined) {
    let myworkOuts = JSON.parse(localStorage.getItem("myworkouts"));

    let mydiv = "";
    myworkOuts.forEach((element) => {
      mydiv = $("<div>").html(element);
      mydiv.attr("class", "workout-library-display");
      $("#workout-videos-list").prepend(mydiv);
    });
  }
  openNav();
}

/* openNav and closeNav functions will open and close the sidebar
   that displays workout library */
function openNav() {
  document.getElementById("mySidebar").style.width = "350px";
  document.getElementById("main").style.marginLeft = "350px";
}
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

/* This function is called when library tab on navigation bar is clicked
   and it loads the workout libary side pane*/
$("#libraryTab").on("click", function (event) {
  event.preventDefault();
  loadWorkoutLibrary();
});

/* This function takes the date and number of minutes input and 
   returns the date in a format that will work with calendar function */
function updateTimeFormat(startTime, mins) {
  let returnDate = "";

  if (mins === "0") {
    var dt1 = moment(startTime);
  } else {
    var dt1 = moment(startTime);
    dt1 = dt1.add(mins, "minutes");
  }

  let year = dt1.get("year");
  let month = dt1.get("month");
  let date = dt1.get("date");
  let hour = dt1.get("hour");
  let minute = dt1.get("minute");
  let second = dt1.get("second");

  returnDate =
    parseInt(month) + 1 + "/" + date + "/" + year + " " + hour + ":" + minute;
  return returnDate;
}

/* This function is called when user inputs the date and time to schedule thier 
   workout. Date input is formatted using moment.js library and calendar event 
   is updated based on user's chosen time*/
$("#workouttime").change(function (event) {
  let startTime = updateTimeFormat(workouttime.value, 0);
  let endTime = updateTimeFormat(workouttime.value, workoutLength);
  let indexOfVideoStart = videoFrame.indexOf("https");
  let indexOfVideoEnd = videoFrame.indexOf("frameborder") - 2;
  let videoUrl = videoFrame.substring(indexOfVideoStart, indexOfVideoEnd);

  $(".start").html(startTime);
  $(".end").html(endTime);
  $(".title").html("Scheduled Workout");
  $(".description").html(
    `Please click on this <a href="${videoUrl}"> link</a> to access your workout`
  );
  $(".location").html("Home");
  $("#addeventatc1").attr("class", "addeventatc show");
});

/* This function is called when Check Stats link on navigation bar is clicked.
   function will retrieve the user stats from localstorage and display it on 
   modal div - current-stats*/
$("#statsTab").on("click", function () {
  if (typeof localStorage.userProfile !== "undefined") {
    let currentStats = JSON.parse(localStorage.getItem("userProfile"));
    $("#cur-height-feet").html(currentStats.heightFoot);
    $("#cur-height-inch").html(currentStats.heightInch);
    $("#cur-weight").html(currentStats.weight);
    $("#cur-bmi").html(currentStats.bmi);
    $("#current_stats").foundation("open");
  }
});
