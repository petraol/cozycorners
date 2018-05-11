//add script here
currentUser = null;

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
    }
    else {
        console.log("Fel lösenord eller användarnamn!")
    }
			
}

function setCurrentUser(username) {
    currentUser = username;
    console.log("currentUser", currentUser)
}