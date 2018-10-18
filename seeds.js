var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")

var data = [
     {
          name: "Cloud's Rest",
          image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fcbebfe204ad7e04d558d7e0cbc0d2eb&auto=format&fit=crop&w=500&q=60",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non lacus molestie, tincidunt odio et, gravida arcu. Proin lobortis lobortis ante non imperdiet. Nam sodales nunc sapien. In arcu nisl, mollis sed consectetur non, fermentum ut ex. Nunc in luctus urna, congue ullamcorper enim. Curabitur et urna non neque accumsan sodales non non eros. Aenean vel massa placerat, auctor erat eget, porta lacus. In pharetra quis mauris eget blandit. Nullam nisl dolor, porttitor pellentesque felis eget, ultricies finibus metus. Suspendisse porttitor commodo nisl, sed faucibus libero semper vel. Duis non egestas tortor. Nulla facilisi. Praesent aliquam velit id sodales ultricies. Curabitur dignissim, augue mollis porta commodo, nisi ligula mattis turpis, sed posuere nulla leo eget diam. Aenean in auctor magna. Nulla id euismod era"
     },
     {
          name: "Desert Mesa",
          image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=500&q=60",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non lacus molestie, tincidunt odio et, gravida arcu. Proin lobortis lobortis ante non imperdiet. Nam sodales nunc sapien. In arcu nisl, mollis sed consectetur non, fermentum ut ex. Nunc in luctus urna, congue ullamcorper enim. Curabitur et urna non neque accumsan sodales non non eros. Aenean vel massa placerat, auctor erat eget, porta lacus. In pharetra quis mauris eget blandit. Nullam nisl dolor, porttitor pellentesque felis eget, ultricies finibus metus. Suspendisse porttitor commodo nisl, sed faucibus libero semper vel. Duis non egestas tortor. Nulla facilisi. Praesent aliquam velit id sodales ultricies. Curabitur dignissim, augue mollis porta commodo, nisi ligula mattis turpis, sed posuere nulla leo eget diam. Aenean in auctor magna. Nulla id euismod era"
     },
     {
          name: "Near Sea",
          image: "https://images.unsplash.com/photo-1502993100359-6e0cee23764d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e19bf1af6566cfc50a97dc28fd54af55&auto=format&fit=crop&w=500&q=60",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non lacus molestie, tincidunt odio et, gravida arcu. Proin lobortis lobortis ante non imperdiet. Nam sodales nunc sapien. In arcu nisl, mollis sed consectetur non, fermentum ut ex. Nunc in luctus urna, congue ullamcorper enim. Curabitur et urna non neque accumsan sodales non non eros. Aenean vel massa placerat, auctor erat eget, porta lacus. In pharetra quis mauris eget blandit. Nullam nisl dolor, porttitor pellentesque felis eget, ultricies finibus metus. Suspendisse porttitor commodo nisl, sed faucibus libero semper vel. Duis non egestas tortor. Nulla facilisi. Praesent aliquam velit id sodales ultricies. Curabitur dignissim, augue mollis porta commodo, nisi ligula mattis turpis, sed posuere nulla leo eget diam. Aenean in auctor magna. Nulla id euismod era"
     }
]

function seedDB(){
    Campground.remove({},function(err){

    //   console.log("removed campgrounds");
    //   data.forEach(function(seed){
    //       Campground.create(seed, function(err,campground){
    //             console.log("added campground"); 
    //             Comment.create({text: "This place is great", author: "Homer"},function(err,comment){
    //                 campground.comments.push(comment);
    //                 campground.save();
    //                 console.log("Created new comment");
    //             });
    //       });
    //   });
    });
}

module.exports = seedDB;