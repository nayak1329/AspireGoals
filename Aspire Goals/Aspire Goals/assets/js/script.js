var name = "";
var email = "";
var password = "";
var goal = "";
var progress = "";

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Create user with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
    var user = firebase.auth().currentUser;
    writeUserData(user.getToken(), document.getElementById("myName").value, document.getElementById("myEmail").value, document.getElementById("myPassword").value, document.getElementById("myGoal").value);
}

//Writes user data to firebase database
function writeUserData(id, n, e, p, g) {
    firebase.database().ref('users/' + id).set({
        name: n,
        email: e,
        password: p,
        goal: g,
        progress: 0
    });
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            name = user.name;
            email = user.email;
            password = user.password;
            goal = user.goal;
            progress = user.progress;
            setProgress(progress);
            setGoal(goal);
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';
            document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]

    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
}

//Initializes Progress Bar after Sign-In.
function setProgress(value){
    document.getElementById("myBar").style.width = value + "%";
}

//Initializes Progress Bar after Sign-In.
function setGoal(goal){
    document.getElementById("Goal").innerHTML = goal;
}

//After daily task is submitted, the Progress Bar changes based on the color of the toggle button (red: harmful, yellow: neutral, green: beneficial) and
//based on the 1-5 scale (Not so (insert type) to Very (insert type)).
function determineProgress(color, num){
    var size = document.getElementById("myBar").style.width;
    var amount = parseInt(size);
    var additional = 0;
    if(num == 2){
        additional++;
    }
    else if(num == 3){
        additional+=2;
    }
    else if(num == 4){
        additional+=3;
    }
    else if(num == 5){
        additional+=4;
    }
    if(color == "red" && document.getElementById("myBar").style.width > 9){
        document.getElementById("myBar").style.width = (amount-5-additional) + "%"
    }
    else if(color == "green"){
        document.getElementById("myBar").style.width = (amount+5+additional) + "%"
    }
}

//saves ProgressBar Data
function saveProgress(){
    var user = firebase.auth().currentUser;
    user.progress = parseInt(document.getElementById("myBar").style.width);
}

//Starts EventListener onLoad of the WebPage
window.onload = function() {
    initApp();
};
