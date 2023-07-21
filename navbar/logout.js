const uid = JSON.parse(sessionStorage.getItem('uid'));
var ref = db.collection("users").doc(uid);

var email;
ref.get().then((doc)=>{
   if(doc.exists){
       companyName = doc.data().companyName;
       document.getElementById('logout').innerHTML = companyName;
   }
   else{
       console.log("doc dont exists");
   }
});

var cName=1;
function logout(){
    if(cName==1){
        document.getElementById('logout').innerHTML = "logout";
        cName=0;
    }
    else{
        firebase.auth().signOut().then(() => {
            alert("signout success");
            window.location.href = "../index.html";
          }).catch((error) => {
            console.log(error);
          });
    }
}
