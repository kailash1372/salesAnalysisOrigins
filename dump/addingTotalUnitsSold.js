var monthTotal = 0;
ref.collection("allproducts").get().then((querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
        var pname=doc.id;
        ref.collection("allproducts").doc(pname).collection("data").get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                monthTotal += doc.data().total; 
                if(querySnapshot.size==12)addTotal(monthTotal,pname);
                
            });
        });
    });
});


function addTotal(v,pname){
    ref.collection("allproducts").doc(pname).set({totalunitssold:v},{merge: true});
}