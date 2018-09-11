// Grab the articles as a json
$.getJSON("/items", function(data) { 
  // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].albumName + "<br />" 
      + data[i].artist + "<br />" + "</p><img src ='" +data[i].img+ "' alt = 'album picture'>" +"<br />"
        + "<a class='btn btn-danger' href ='https://pitchfork.com/" +data[i].link+ "'>Read the Review on Pitchfork</a></button>"
      + "<br><a class='btn btn-warning'>Leave a Comment</a></button>" + "<br><a class='btn btn-success' id='like' data-id='"+data[i]._id+"'>Like this Review</a></button>");
    }
  });

// When user click's update button, update the specific note
$(document).on("click", "#like", function() {

  var selected = $(this);

  $.ajax({
    type: "POST",
    url: "/like/" + selected.attr("data-id"),
    dataType: "json",
    // On successful call
    success: function(data) {
      console.log("like complete")
    }
  });
});

  