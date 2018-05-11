//add script here
function createPlace(username, picture, description, name, tags, location_lat, location_long) {
    console.log(name);
    firebase.database().ref('locations/' + name).set({
        username: username,
        picture: picture,
        description: description,
        tags: tags,
        location_lat: location_lat,
        location_long: location_long
        });  
    updateUser(username, picture, description, name, tags, location_lat, location_long);
}

function createUser(username) {
    firebase.database().ref("users/" + username).set({
            username: username,
    });
}

function updateUser(username, picture, description, name, tags, location_lat, location_long) {
  // A post entry.
  var postData = {
            picture: picture,
            description: description,
            tags: tags,
            location_lat: location_lat,
            location_long: location_long
            }

  // Get a key for a new Post.
  //var newPostKey = firebase.database().ref().child('users/' + username).push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};

  updates['/users/' + username + '/locations'] = postData;

  return firebase.database().ref().update(updates);
}
    