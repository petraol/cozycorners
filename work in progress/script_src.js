//add script here
currentUser = null;
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
        username: username,
        picture: picture,
        description: description,
        tags: tags,
        location_lat: location_lat,
        location_long: location_long
        });  
    updateUser(name);
    console.log("Created new place: ", name);
  //  document.getElementById("placeForm").value=''
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
  // A post entry.
  var postData = {
            place: name
            }

  // Get a key for a new Post.
  //var newPostKey = firebase.database().ref().child('users/' + username).push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};

  updates['/users/' + username + '/locations'] = postData;

  return firebase.database().ref().update(updates);
    console.log("Updated user locations");
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
    var MyCenter = {lat: 59.3498092, lng: 18.0684758};
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
}

var mapPage = document.getElementById("map");
var start = document.getElementById("welcomeDiv");

mapPage.style.display = "none";
start.style.display = "block";

function welcomeMap() {
    mapPage.style.display = "block";
    start.style.display = "none";
}