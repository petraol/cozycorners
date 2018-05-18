//add script here
currentUser = null;
places = new Array();

getAllPlaces();

document.getElementById("loggedIn").style.display = "none";
document.getElementById("signupPage").style.display = "none";
document.getElementById("newPlace").style.display = "none";
var hamburger = document.getElementById("openIt");

function createPlace() {
    username = currentUser;
    picture = document.getElementById("picture").value;
    description = document.getElementById("description").value;
    name = document.getElementById("name").value;
    tags = document.getElementById("tags").value;
    location_lat = document.getElementById("location_lat").value;
    location_long = document.getElementById("location_long").value;
    console.log(username, picture, description, name, tags, location_lat, location_long)
    firebase.database().ref('locations/' + name).set({
        place: name,
        username: username,
        picture: picture,
        description: description,
        tags: tags,
        location_lat: location_lat,
        location_long: location_long
        });  
    updateUser(name);
    console.log("Created new place: ", name);
}


function createUser() {
    username = document.getElementById('new_username').value;
    password = document.getElementById('new_password').value;
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
                        password: password
                        });
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

            var myLatLng = new google.maps.LatLng(place.location_lat, place.location_long);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                animation: google.maps.Animation.DROP,
                title: place.place
            });

            
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

function searchByName() {
    //document.getElementById("myPlace").innerHTML = "";
    search = document.getElementById("mySearch").value;
        return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
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
                element.appendChild(node);*/
            }    
        });
    });
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

