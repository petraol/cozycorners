//add script here
currentUser = null;
places = new Array();
var markers = [];
let firstFile;
let profileFile;
var context;

getAllPlaces();

picture = document.getElementById("picture");                
picture.addEventListener('change', function(evt) {
    console.log("laddar up fil!!!!")
      firstFile = evt.target.files[0] // upload the first file only
  })

profilepicture = document.getElementById("profilepicture");                
profilepicture.addEventListener('change', function(evt) {
    console.log("laddar up fil!!!!")
      profileFile = evt.target.files[0] // upload the first file only
  })

document.getElementById("loggedIn").style.display = "none";
document.getElementById("signupPage").style.display = "none";
document.getElementById("newPlace").style.display = "none";
var hamburger = document.getElementById("openIt");

function createPlace() {
    username = currentUser;
    picture = document.getElementById("picture");
    description = document.getElementById("description").value;
    name = document.getElementById("name").value;
    tags = document.getElementById("tags").value;
    location_lat = document.getElementById("location_lat").value;
    location_long = document.getElementById("location_long").value;
    console.log(username, picture.name, description, name, tags, location_lat, location_long)
    firebase.database().ref('locations/' + name).set({
        place: name,
        username: username,
        picture: firstFile.name,
        description: description,
        tags: tags,
        location_lat: location_lat,
        location_long: location_long
        });  
    
    if (picture.size > 1024000) {
                    window.alert("The profile picture you tried to upload is too big (MAX 1 MB)! Try again.");
                    return;
                }

                else {
                    console.log(picture.size)
                    var storageRef = firebase.storage().ref();

                    storageRef.child("places/" + firstFile.name).put(firstFile)
                    
                    //storageRef.put(firstFile).then(function(snapshot) {
                    //  console.log('Uploaded a blob or file!');
                    //});
                }
    
    updateUser(name);
    //drawPicture(name);
    console.log("Created new place: ", name);
}


function createUser() {
    username = document.getElementById('new_username').value;
    password = document.getElementById('new_password').value;
    profilepicture = document.getElementById("profilepicture");
    allUsers = [];
    var query = firebase.database().ref("users").orderByKey();
    query.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                console.log(key);
                allUsers.push(key);
            });
            console.log(allUsers);
            if (allUsers.includes(username)) {
                console.log("Nu stötte den på ett namn som redan finns i databasen")
                return;
            }

            else {
                try {
                    firebase.database().ref('users/' + username).set({
                        username: username,
                        password: password,
                        picture: profileFile.name
                        });
                        if (picture.size > 1024000) {
                            window.alert("The profile picture you tried to upload is too big (MAX 1 MB)! Try again.");
                            return;
                        }

                        else {
                            console.log(picture.size)
                            var storageRef = firebase.storage().ref();

                            storageRef.child("profile/" + profileFile.name).put(profileFile)

                            //storageRef.put(firstFile).then(function(snapshot) {
                            //  console.log('Uploaded a blob or file!');
                            //});
                        }
                    console.log("Created new user: ", username)
                }
                catch(err) {
                    console.log("Fel under skapandet i databasen")
                }
            }
        });  
    
}

function updateUser(name) {

firebase.database().ref('users/' + username + '/locations/' + name).set({
        place: name
        });  
}
    

function fetchInfo() {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    firebase.database().ref('/users/' + username).on('value', function(snapshot) {
        if (snapshot.val() != null) {
            login(username, snapshot.val().password, password);
            username.value='';
            password.value='';
            }
        else {
            console.log("not a user")
        }
    });
}

function login(username, dbpassword, password) {
    if (dbpassword === password) {
        setCurrentUser(username);
        console.log("Passwords match");

        document.getElementById("loggedIn").style.display = "block";
        document.getElementById("notLoggedIn").style.display = "none";
    }
    else {
        console.log("Fel lösenord eller användarnamn!")
    }
    drawProfilePicture();
            
}

function setCurrentUser(username) {
    currentUser = username;
    document.getElementById("theUsername").innerHTML = currentUser;
    console.log("currentUser", currentUser)
}

function getAllPlaces() {
    //document.getElementById("myPlace").innerHTML = "";
    return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            
            var place = childSnapshot.val();
            the_place = {place: place.place, description: place.description, location_lat: place.location_lat, locations_long: place.location_long, picture: place.picture, username: place.username, tags: place.tags};
            //----------------------------------------------------------------------------code for writing out places here!!!!!!!----------------------------------------------------------------------------------------
                var pic;
    var profileRef = firebase.database().ref("locations/" + place.place);
    profileRef.child("picture").once('value', function(snapshot) {
        pic = snapshot.val();
        console.log(pic)

    });
    var storage = firebase.storage().ref();
    var spaceRef = storage.child('places/' + pic);
    var path = spaceRef.fullPath;
    var image_url;
            storage.child(path).getDownloadURL().then(function(url){
                image_url = url;
                console.log("image url:", image_url)

                var icon = {
                    url: image_url,
                    scaledSize: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };
                
                var myLatLng = new google.maps.LatLng(place.location_lat, place.location_long);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: place.place,
                    icon: icon,
                    username: place.username,
                    tags: place.tags
                });

                var i = new Image();
                i.src = image_url;

                i.onload = function () {
                    marker.setIcon(icon); //If icon found go ahead and show it
                }

                i.onerror = function () {
                    marker.setIcon(null); //This displays brick colored standard marker icon in case image is not found.
                }
                

                var contentString = '<img id="infoWindowPic" src='+image_url+'"/>' + 
                '<div id="info">' + '<p id="infoWindowText">' + place.description + '</p>' + '</div>';

                var infowindow = new google.maps.InfoWindow({
                      content: contentString
                    });

                    marker.addListener('click', function() {
                      infowindow.open(map, marker);
                    });

                markers.push(marker);
                    
            })


            
        });
    });
}

function filterByTag() {
    //document.getElementById("myPlace").innerHTML = "";
    search = document.getElementById("myTag").value;
        return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var place = childSnapshot.val();
            console.log(place.tags);
            if (place.tags.indexOf(search) >= 0) {
                the_place = {place: place.place, description: place.description, location_lat: place.location_lat, locations_long: place.location_long, picture: place.picture, username: place.username, tags: place.tags};
                //----------------------------------------------------------------------------code for writing out places here!!!!!!!----------------------------------------------------------------------------------------
                /*var element = document.getElementById("myPlace");
                var node = document.createElement("LI");   
                var textnode = document.createTextNode(place.place);
                node.appendChild(textnode);
                element.appendChild(node);*/
            }    
        });
    });
}


 function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
    document.getElementById("mySidenav").style.width = "0";
}

function searchByName() {
    //document.getElementById("myPlace").innerHTML = "";
    search = document.getElementById("mySearch").value;
    searchFilter = document.getElementById("searchFilter").value;

    for (var i = 0; i < markers.length; i++) {
        //console.log(markers[i].username);
        //console.log(markers[i].title);
        //console.log(search);
        console.log(searchFilter);
        if (searchFilter == 'placeName') {
            if (markers[i].title != search) {
                markers[i].setMap(null);
            }
        }

        if (searchFilter == 'username') {
            if (markers[i].username != search) {
                markers[i].setMap(null);
            }
        }

        //fungerar bara för 1 tag, ej när finns flera tags
        if (searchFilter == 'tags') {
            if (markers[i].tags != search) {
                markers[i].setMap(null);
            }
        }
        document.getElementById("mySidenav").style.width = "0";

       /* if (markers[i].username != search) {
            markers[i].setMap(null);
        }*/
    }
       /* return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var place = childSnapshot.val();
            console.log(place.place);
            if (search == place.place) {
                the_place = {place: place.place, description: place.description, location_lat: place.location_lat, locations_long: place.location_long, picture: place.picture, username: place.username, tags: place.tags};
                //----------------------------------------------------------------------------code for writing out places here!!!!!!!----------------------------------------------------------------------------------------

                /*var element = document.getElementById("myPlace");
                var node = document.createElement("LI");   
                var textnode = document.createTextNode(place.place);
                node.appendChild(textnode);
                element.appendChild(node);
            }    
        });
    });*/
}


function filterPlaceByUser() {
    //document.getElementById("myPlace").innerHTML = "";
    user = document.getElementById("myText").value;
    places_from_user = [];
    firebase.database().ref('/users/' + user + "/locations").orderByChild('place').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var place = childSnapshot.child('place').val();
            places_from_user.push(place);
        });
        
        return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var place = childSnapshot.val();
            console.log(places_from_user);
            console.log(place.place);
            if (places_from_user.indexOf(place.place) >= 0) {
                the_place = {place: place.place, description: place.description, location_lat: place.location_lat, locations_long: place.location_long, picture: place.picture, username: place.username, tags: place.tags};
                //----------------------------------------------------------------------------code for writing out places here!!!!!!!----------------------------------------------------------------------------------------
                /*var element = document.getElementById("myPlace");
                var node = document.createElement("LI");   
                var textnode = document.createTextNode(place.place);
                node.appendChild(textnode);
                element.appendChild(node);*/
            }    
        });
    });
    });
}

function drawLocationPicture(location) {
    console.log("drawing picture: ", location)
    var pic;
    var profileRef = firebase.database().ref("locations/" + location);
    profileRef.child("picture").once('value', function(snapshot) {
        pic = snapshot.val();
        console.log(pic)

    });
    var storage = firebase.storage().ref();
    var spaceRef = storage.child('places/' + pic);
    var path = spaceRef.fullPath;

            storage.child(path).getDownloadURL().then(function(url){
                var image_url = url;
                document.getElementById("viewport").src = image_url;
                
            }).catch(function(error) {
            console.log("error")
            console.log(error.code);
            console.log(error.message);
            });
}

function drawProfilePicture() {
    console.log("drawing picture: ", location)
    var pic;
    var profileRef = firebase.database().ref("users/" + currentUser);
    profileRef.child("picture").once('value', function(snapshot) {
        pic = snapshot.val();
        console.log(pic)

    });
    var storage = firebase.storage().ref();
    var spaceRef = storage.child('profile/' + pic);
    var path = spaceRef.fullPath;

            storage.child(path).getDownloadURL().then(function(url){
                var image_url = url;
                document.getElementById("profilepic").src = image_url;
                
            }).catch(function(error) {
            console.log("error")
            console.log(error.code);
            console.log(error.message);
            });
}

//OPEN AND CLOSE SIDEBAR
function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
} 

//SHOW SIGNUP
function showSignupDetails() {
    document.getElementById("signupPage").style.display = "block";
    document.getElementById("notLoggedIn").style.display = "none";
}

//BACK TO LOGINPAGE
function goBack () {
    document.getElementById("notLoggedIn").style.display = "block";
    document.getElementById("signupPage").style.display = "none";
}

function newPlace() {
    document.getElementById("newPlace").style.display = "block";
    document.getElementById("mySidenav").style.width = "0";
    hamburger.style.display = "none";
    mapPage.style.display = "none";
}

function closeList() {
    document.getElementById("newPlace").style.display = "none";
    hamburger.style.display = "block";
    mapPage.style.display = "block";
}

function signOut() {
    document.getElementById("loggedIn").style.display = "none";
    document.getElementById("notLoggedIn").style.display = "block";
}

//MAP FUNCTIONS
var map;

function initMap() {

    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(59.3498092,18.0684758),
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        }
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    getLocation();

    //setMarkers(beaches);

    /*// Bind event listener on button to reload markers
    document.getElementById('reloadMarkers').addEventListener('click', reloadMarkers);*/
    
    /*var MyCenter = {lat: 59.3498092, lng: 18.0684758};
    map = new google.maps.Map(document.getElementById('map'), {
      center: MyCenter,
      zoom: 16,
      mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER
          }
    });

    var icon = {
        url: 'https://www.nwf.org/-/media/NEW-WEBSITE/Shared-Folder/Wildlife/Reptiles/reptile_green-sea-turtle_600x300.ashx',
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    var marker = new google.maps.Marker({
        position: {lat: 59.347462, lng: 18.073772},
        map: map,
        title: 'cool turtle',
        icon: icon
    });

    var contentString = '<img src="https://www.nwf.org/-/media/NEW-WEBSITE/Shared-Folder/Wildlife/Reptiles/reptile_green-sea-turtle_600x300.ashx" style="width:300px;height:auto;"/>'+
            '<div id="info">'+'<p>Very cool turtle lives here can recomend B)</p>'+'</div>';

    var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

    map.addListener('click', function(e) {
      placeMarkerAndPanTo(e.latLng, map);
    });*/
  }

function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        pos.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
    function showPosition(position) {
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.panTo(latLng);
      var icon = {
    url: 'https://cdn1.iconfinder.com/data/icons/pretty-office-part-13-simple-style/512/user-orange.png', // url
    scaledSize: new google.maps.Size(40, 40), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
var marker = new google.maps.Marker({
    map: map,
    position: latLng,
    icon: icon
  });
}

  function placeMarkerAndPanTo(latLng, map) {
    var icon = {
        url: 'https://www.nwf.org/-/media/NEW-WEBSITE/Shared-Folder/Wildlife/Reptiles/reptile_green-sea-turtle_600x300.ashx',
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    var icon2 = {
        url: 'images/turtle.jpg',
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: 'cool turtle',
      icon: icon
    });
    map.panTo(latLng);

    //click on the icon again, changes icon to icon2
    google.maps.event.addListener(marker, 'click', function() {
    marker.setIcon(icon2);                                    
    infowindow.open(map);
    });
}

var mapPage = document.getElementById("map");
var start = document.getElementById("welcomeDiv");

mapPage.style.display = "none";
start.style.display = "block";

function welcomeMap() {
    mapPage.style.display = "block";
    start.style.display = "none";
}

/*function reloadMarkers() {

    // Loop through markers and set map to null for each
    for (var i=0; i<markers.length; i++) {

        markers[i].setMap(null);
    }

    // Reset the markers array
    markers = [];

    // Call set markers to re-add markers
    setMarkers(beaches);
}*/

