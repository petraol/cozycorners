//add script here
currentUser = null;
places = new Array();

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
    }
    else {
        console.log("Fel lösenord eller användarnamn!")
    }
			
}

function setCurrentUser(username) {
    currentUser = username;
    console.log("currentUser", currentUser)
}

function getAllPlaces() {
    document.getElementById("myPlace").innerHTML = "";
    return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            
            var place = childSnapshot.val();
            the_place = {place: place.place, description: place.description, location_lat: place.location_lat, locations_long: place.location_long, picture: place.picture, username: place.username, tags: place.tags};
            //----------------------------------------------------------------------------code for writing out places here!!!!!!!----------------------------------------------------------------------------------------
            var element = document.getElementById("myPlace");
            var node = document.createElement("LI");   
            var textnode = document.createTextNode(place.place);
            node.appendChild(textnode);
            element.appendChild(node);
            
        });
    });
}

function filterByTag() {
    document.getElementById("myPlace").innerHTML = "";
    search = document.getElementById("myTag").value;
        return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var place = childSnapshot.val();
            console.log(place.tags);
            if (place.tags.indexOf(search) >= 0) {
                the_place = {place: place.place, description: place.description, location_lat: place.location_lat, locations_long: place.location_long, picture: place.picture, username: place.username, tags: place.tags};
                //----------------------------------------------------------------------------code for writing out places here!!!!!!!----------------------------------------------------------------------------------------
                var element = document.getElementById("myPlace");
                var node = document.createElement("LI");   
                var textnode = document.createTextNode(place.place);
                node.appendChild(textnode);
                element.appendChild(node);
            }    
        });
    });
}

function searchByName() {
    document.getElementById("myPlace").innerHTML = "";
    search = document.getElementById("mySearch").value;
        return firebase.database().ref('/locations').orderByChild('username').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var place = childSnapshot.val();
            console.log(place.place);
            if (search == place.place) {
                the_place = {place: place.place, description: place.description, location_lat: place.location_lat, locations_long: place.location_long, picture: place.picture, username: place.username, tags: place.tags};
                //----------------------------------------------------------------------------code for writing out places here!!!!!!!----------------------------------------------------------------------------------------
                var element = document.getElementById("myPlace");
                var node = document.createElement("LI");   
                var textnode = document.createTextNode(place.place);
                node.appendChild(textnode);
                element.appendChild(node);
            }    
        });
    });
}

function filterPlaceByUser() {
    document.getElementById("myPlace").innerHTML = "";
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
                var element = document.getElementById("myPlace");
                var node = document.createElement("LI");   
                var textnode = document.createTextNode(place.place);
                node.appendChild(textnode);
                element.appendChild(node);
            }    
        });
    });
    });
}