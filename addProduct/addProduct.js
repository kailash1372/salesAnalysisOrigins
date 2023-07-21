// var monthvalue;

// function changevalue(month){
//     document.getElementById('changeval').innerHTML = month
//     // document.getElementById('dataE').style.display = "grid"
//     monthvalue = month

// }

async function addProduct() {
    try {
        var productname = document.getElementById('pname').value;

        var fixedcosts = document.getElementById('fc').value;
        fixedcosts = parseInt(fixedcosts,10);

        var variablecosts = document.getElementById('vc').value;
        variablecosts = parseInt(variablecosts,10);

        var sellingprice = document.getElementById('sp').value;
        sellingprice = parseInt(sellingprice,10);

        // var data = document.getElementById('dataentry').value;
        // data = data.split(',').map(function(item){
        //     return parseInt(item,10);
        // });
        // var size = data.length;

        var marginperunit = sellingprice-variablecosts;
        var bep = parseInt(fixedcosts/marginperunit);

        // var total=0;

        // for (let i = 1; i <=size; i++) {
        //     total+=data[i-1];
        //     var info = {};
        //     info[i] = data[i-1];

        //     await ref
        //         .collection("allproducts")
        //         .doc(productname)
        //         .collection("data")
        //         .doc(monthvalue)
        //         .set(info, { merge: true }
        //     );
        // }

        // await ref
        //         .collection("allproducts")
        //         .doc(productname)
        //         .collection("data")
        //         .doc(monthvalue)
        //         .set({total:total}, { merge: true }
        // );
        
        await ref.collection("allproducts").doc(productname).set(
            { fixedcost: fixedcosts,
              variablecost: variablecosts,
              sellingprice:sellingprice,
              bep:bep
            },
            { merge: true }
        );

        window.location.href = "../products/products.html";
    } catch (error) {
        console.log("Error adding product: ", error);
    }
}   