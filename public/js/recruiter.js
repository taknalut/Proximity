$(document).ready(function() {

$("#resultsRecreuiterPageTitleText").text("Your posted jobs")

function initializeRows(posts) {
  var latestPosts = posts.reverse();
  var rowsToAdd = [];
  for (var i = 0; i < posts.length; i++) {
    rowsToAdd.push(createNewRow(latestPosts[i]));
  }
  $("#postedJobs").append(rowsToAdd);
}

function getPosts() {
  $.get("/api/posts", function(data) {
    posts = data;
    initializeRows(posts);
    console.log(posts)
  });
}

function createNewRow(posts) {
  var date = moment(posts.created_at).format('MM/DD/YYYY');
  var tBody = $("tbody")
  var tRow = $("<tr>").addClass("jobRow")
  var titleTd = $("<td>").text(posts.jobTitle).addClass("jobData")
  var descriptionTd = $("<td>").text(posts.jobDescription).addClass("jobData description-td")
  var createdDateTd = $("<td>").text(date).addClass("jobData padding-table-left")
  var viewbtn = $("<td>").text("View").addClass("btn-view").attr("id", "viewBtn")
  tRow.append(titleTd, descriptionTd, createdDateTd, viewbtn)
  tBody.append(tRow);
}

getPosts();

// $("#addNewJob").on("click", function() {
//
// })




//recruiter post, and taking address to geocode Latitude & Longitude in mySQL
$("#addPost").on("click", function(event) {
  event.preventDefault();
  //emptySearchMarkersArray
  searchMarkersLatLng = []
  googleMapsRecruiter();
  var jobTitInput = $("#jobTit");
  var jobDescInput = $("#jobDesc");
  var jobQualInput = $("#jobQualDesc")
  var jobAddInfoInput = $("#jobAddInfoDesc")
  // var jobCompInput = $("#jobComp");
  var jobAdrsInput = $("#jobAdr");
  var jobCityInput = $("#jobCity");
  // var jobStateSelector = $("#jobState");
  var jobStateSelector = document.getElementById("jobState")
  var jobStateInput = jobStateSelector.options[jobStateSelector.selectedIndex].value
  console.log(jobStateInput)
  var jobZipInput = $("#jobZip");
  var address = "'" + jobAdrsInput.val().trim() + "," + " " + jobCityInput.val().trim() + "," + " " + String(jobStateInput) + " " + jobZipInput.val().trim() + "'"
  geocodeAddress()

  function geocodeAddress() {
    geocoder.geocode({
      address: address
    }, function(results, status) {
      console.log("placeID", results[0].place_id)
      placePostId = results[0].place_id
      lat = results[0].geometry.location.lat()
      lng = results[0].geometry.location.lng()
      console.log(lat, lng)
      newPost(lat, lng)
    })
  }
  function newPost(lat, lng) {
    var newPost = {
      jobTitle: jobTitInput.val().trim(),
      jobDescription: jobDescInput.val().trim(),
      jobQualification: jobQualInput.val().trim(),
      additionalInfo: jobAddInfoInput.val().trim(),
      // companyName: jobCompInput.val().trim(),
      address: jobAdrsInput.val().trim(),
      city: jobCityInput.val().trim(),
      state: String(jobStateInput),
      zipCode: jobZipInput.val().trim(),
      placeID: placePostId,
      latitude: lat,
      longitude: lng
    };
    submitPost(newPost);
  }
  function submitPost(newPost) {
    $.post("/api/posts", newPost, function() {
      console.log(newPost)
      location.reload();
    });
  }
});

})

//------------------------------------------------------------------------------




function googleRecruiter() {
var washingtonDC = new google.maps.LatLng(38.9072, -77.0369)
//Creates map in HTML centered on Washington, D.C.
map = new google.maps.Map(document.getElementById('map'), {
  center: {
    lat: 38.9072,
    lng: -77.0369
  },
  zoom: 4,
});
}
function googleMapsRecruiter() {
//geocoder for recruiter posting for latitude/longitude
geocoder = new google.maps.Geocoder();
// Display Search Markers
if (searchMarkersLatLng != []) {
  console.log("working!")
  image = {
    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    size: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  };
  shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
  var infowindow = new google.maps.InfoWindow();
  console.log("SEARCH", searchMarkersLatLng)
  for (var i = 0; i < searchMarkersLatLng.length; i++) {
    var marksLatLng = searchMarkersLatLng[i]
    var marker = new google.maps.Marker({
          position: {lat: marksLatLng[0], lng: marksLatLng[1]
          },
          map: map,
          placeId: marksLatLng[2],
          content: '<div><strong>' + marksLatLng[4] + '</strong><br>' +
            'Job Title: ' + marksLatLng[5] + '<br>' + 'Address: ' +
            marksLatLng[3] + '</div>' + 'More Info: ' + '<a class="moreInfoUrl" data-value='+marksLatLng[6]+'" href="api/posts/'+ marksLatLng[6]+'">testURL</a>' + '<br>',
          zIndex: 999999
        })
    gMarkers.push(marker);
    console.log("gMarkers array: ", gMarkers)
    google.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.setContent(this.content);
          infowindow.open(map, this);
    })
    google.maps.event.addListener(marker, 'click', function() {
        queryURL = 'http://localhost:8080/api/posts/' + $(".moreInfoUrl").data("value")
        console.log(queryURL)
        $.ajax({
          url: queryURL,
          method: "GET",
        }).done(function(results) {
          console.log(results)
            $("#markerName").empty()
            $("#markerCheckins").empty()
            $("#applyButton").empty()
            var jbTit = results.jobTitle
            var cmpName = results.companyName
            var jobDesc = results.jobDescription
            var adr1 = results.address
            var adr2 = results.city
            var adr3 = results.state
            var adr4 = results.zipCode
            var fullAddress = adr1 + " " + adr2 + " " + adr3 + " " + adr4
            var createdAt = results.created_at
            var updatedAt = results.updated_at

            var placeDetailsModal = ('<div>'+ 'Company: <COMPANY NAME>' + '<br>' + 'Job Description:'+ jobDesc + '<br>' + 'Job Address:'+ fullAddress + '<br>' +'Created At:'+ createdAt + '<br>' +'Updated At:'+ updatedAt+ '<br>' +'</div>');
            $("#markerName").text('Job Title: ' + jbTit)
            $("#markerCheckins").append(placeDetailsModal)
            $("#applyButton").append('<button type="submit" id="apply" class="btn btn-success">Apply</button>')
            jQuery.noConflict();
            $("#markerModal").modal()
        })
      });
  }
}
}
