//signIn
function signin(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        alert("sign in successful!");
        window.location.href = "./products/products.html";
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        clearPassword();
    });

    function clearPassword(){
        document.getElementById('password').value ="";
    }
    auth.onAuthStateChanged((user) => {
        if (user) {
            var u = user.uid;
            sessionStorage.setItem('uid', JSON.stringify(u));
        }
    });
}
//end


//signUP
var decide=0;
        
function signup(){
    if(decide!=0)register();
    else{
        document.getElementById('headertext').innerHTML="Register";
        document.getElementById('signupbtn').innerHTML="Register";
        document.getElementById('signinbtn').style.display="none";
        document.getElementById('or').style.display="none";
        document.getElementById('gobackbtn').style.display="block";
        document.getElementById('companyname').style.display="block";
        decide=1;
    }
}

function clearFields(){
    document.getElementById('companyname').value="";
    document.getElementById('email').value ="";
    document.getElementById('password').value ="";
}

function undosignup(){
    document.getElementById('headertext').innerHTML="Sign In";
    document.getElementById('signupbtn').innerHTML="Sign Up";
    document.getElementById('signinbtn').style.display="block";
    document.getElementById('or').style.display="block";
    document.getElementById('gobackbtn').style.display="none";
    document.getElementById('companyname').style.display="none";
    decide=0;
}

function register(){
    var companyName = document.getElementById('companyname').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(() => {
        return auth.createUserWithEmailAndPassword(email, password);
    })
    .then((cred) => {
        const uid = cred.user.uid;
        alert("You have been signed up!");
        clearFields();
        undosignup();
        db.collection("users").doc(uid).set({ companyName: companyName }, { merge: true });
    })
    .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
    });

}  
//end


