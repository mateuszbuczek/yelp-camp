var express= require("express")
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware");

// cloud images
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dafgcdzwy', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//index route
router.get("/", function(req,res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = "";
    if(req.query.search){
       const regex = new RegExp(escapeRegex(req.query.search),'gi');
       Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
           Campground.count({name: regex}).exec(function (err, count) {
                if(err)
                    console.log(err)
                else {
                    if(allCampgrounds.length < 1){
                        noMatch = "No campgrounds match that query, please try again.";
                    } else {
                        noMatch = "Search results:"
                    }
                    res.render("campgrounds/index", {campgrounds: allCampgrounds,current: pageNumber,pages: Math.ceil(count / perPage), page:'campgrounds', noMatch: noMatch, search: req.query.search});
                }
             });
       });
    } else {
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        Campground.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
                    page: 'campground',
                    noMatch: noMatch,
                    search: false
                });
            }
        });
    });
    }
});

//create route
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
  // get data from form and add to campgrounds array
  cloudinary.uploader.upload(req.file.path, function(result) {
      var image = result.secure_url;
      var name = req.body.name;
      var desc = req.body.description;
      var author = {
          id: req.user._id,
          username: req.user.username
      }
      geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err.message)
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = {name: name, image: image,imageId: result.public_id, description: desc, author:author, location: location, lat: lat, lng: lng, price: req.body.price};
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds/" + newlyCreated.id);
            }
        });
      });
  });
});

router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err)
        console.log(err);
       else
    //   console.log(foundCampground)
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

//edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err)
        console.log(err)
        else
        res.render("campgrounds/edit", {campground: foundCampground});
    })

});
//update route
// UPDATE CAMPGROUND ROUTE
router.put("/:id", upload.single('image'), middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
             if(req.file){
                 try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
                  } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
                  }
             }
            geocoder.geocode(req.body.location, function (err, data) {
                if (err || !data.length) {
                  req.flash('error', 'Invalid address');
                  return res.redirect('back');
                }
                campground.lat = data[0].latitude;
                campground.lng = data[0].longitude;
                campground.location = data[0].formattedAddress;
                
                campground.name = req.body.name;
                campground.description = req.body.description;
                campground.price = req.body.price;
            
                campground.save();
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });
});

//destroy campground route
router.delete('/:id', function(req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(campground.imageId);
        campground.remove();
        req.flash('success', 'Campground deleted successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\%$|#\s]/g, "\\$&");
}

module.exports = router;