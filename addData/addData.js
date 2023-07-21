var productname =JSON.parse(sessionStorage.getItem('docid'));

function csv(){
    document.getElementById('btnGrp').style.display = "none";
    document.getElementById('csvEntry').style.display = "grid";
}

function manual(){
    document.getElementById('btnGrp').style.display = "none";
    document.getElementById('manualEntry').style.display = "grid";
}

var monthvalue;

function changevalue(month){
    document.getElementById('changeval').innerHTML = month
    monthvalue = month
}

async function addData() {
    try {
        var data = document.getElementById('dataentry').value;
        data = data.split(',').map(function(item){
            return parseInt(item, 10);
        });

        var size = data.length;
        var total = 0;
        var info = {}; // Initialize an empty object to hold the data for Firestore update

        for (var i = 1; i <= size; i++) {
            total += data[i - 1];
            info[i] = data[i - 1]; // Add the data to the 'info' object for Firestore update
        }

        info.total = total; // Add the 'total' property to the 'info' object

        // Use one set() function call to update the Firestore document with all the data
        await ref
            .collection("allproducts")
            .doc(productname)
            .collection("data")
            .doc(monthvalue)
            .set(info, { merge: true });

        window.location.href = "../products/products.html";
    } catch (error) {
        console.log("Error adding product: ", error);
    }
}

async function addProductCSV(){
    let csvData = document.getElementById('csv').value;
    csvData = csvData.split('\n');

    const map = new Map();
    
    for(let i=0;i<csvData.length;i++){
        let indiv = csvData[i].split(',');
        if(map.has(indiv[0])){
            let temp = map.get(indiv[0]);
            temp[parseInt(indiv[1],10)] = parseInt(indiv[2],10);
            temp["total"]+=parseInt(indiv[2],10);
            map.set(indiv[0],temp);
        }
        else{
            let temp = {};
            temp[parseInt(indiv[1],10)] = parseInt(indiv[2],10);
            temp["total"] = parseInt(indiv[2],10);
            map.set(indiv[0],temp);
        }
    }

    for (const [key, value] of map) {
        await ref
            .collection("allproducts")
            .doc(productname)
            .collection("data")
            .doc(key)
            .set(value, { merge: true });

        window.location.href = "../products/products.html";
      }
    

}
  