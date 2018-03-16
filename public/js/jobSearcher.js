$(document).ready(function() {

  function initializeRows(posts) {
    var latestPosts = posts.reverse();
    var rowsToAdd = [];
    for (var i = 0; i < 10; i++) {
      rowsToAdd.push(createNewRow(latestPosts[i]));
    }
    $("#recentJobs").append(rowsToAdd);
  }

  function getPosts() {
    $.get("/api/posts", function(data) {
      posts = data;
      initializeRows(posts);
      console.log(posts)
    });
  }

  function createNewRow(posts) {
    var tBody = $("tbody")
    var tRow = $("<tr>").addClass("jobRow")
    var titleTd = $("<td>").text(posts.jobTitle).addClass("jobData")
    var companyTd = $("<td>").text(posts.jobTitle).addClass("jobData")
    var cityTd = $("<td>").text(posts.city).addClass("jobData")
    var stateTd = $("<td>").text(posts.state).addClass("jobData")
    var applybtn = $("<td>").text("Apply").addClass("btn-apply").attr("id", "applyBtn")
    tRow.append(titleTd, companyTd, cityTd, stateTd, applybtn)
    tBody.append(tRow);
  }

  getPosts();

  $( ".btn-success" ).click(function() {
    starJob();
  });

  function starJob() {
    console.log("You starred a job");
  }

  function unstarJob() {
    console.log("You unstarred a job");
  }
})
