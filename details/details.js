const docid = JSON.parse(sessionStorage.getItem('docid'));
document.getElementById('pname').innerHTML = docid;
const docRef = ref.collection("allproducts").doc(docid).collection("data");
var fc = -1;
var vc = -1;
var sp = -1;

var date = new Date();
date = date.toDateString();
date = date.split(' ');

const jsMonth = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}
const monthMap = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}
var jsmonthvalue = monthMap[jsMonth[date[1]]];

const MonthMap = new Map();
const everyMonthTotal = new Map();
ref.collection("allproducts").doc(docid).get().then((doc)=>{
    fc = doc.data().fixedcost;
    vc = doc.data().variablecost;
    sp = doc.data().sellingprice;
    ref.collection("allproducts").doc(docid).collection("data").get().then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            everyMonthTotal.set(doc.id,doc.data().total);
            if(doc.id==jsmonthvalue){drawMinandMax(doc.data());drawCurMonthTrend(doc.data())}
            if(everyMonthTotal.size==querySnapshot.size){drawBEA(fc,vc,sp);drawQtrend();}
        });
    });
});
function drawBEA(fc,vc,sp){
    let margin = sp-vc;
    let bep = fc/margin;
    let sorted = [['Month','Revenue','Expenses']]
    let revenue = 0;
    let expense= fc;
    let t=0;
    let flag=0;
    for(let i=1;i<=12;i++){
        // ordered.push([monthMap[i],everyMonthTotal.get(monthMap[i])]);
        let total = everyMonthTotal.get(monthMap[i]);
        t+=total;
        if(t>bep&&flag==0){sorted.push(["BEP",parseInt((bep)*sp),parseInt((bep)*sp)]);flag=1;}
        revenue+=(total*sp);
        expense+=(total*vc);
        let temp = [monthMap[i],revenue,expense];
        sorted.push(temp);
    }
    // ['January', 139765, 527953],['February', 281020, 556204],['March', 465160, 593032],['April', 671485, 634297],['May', 937595, 687519],['June', 1251090, 750218],['July', 1612335, 822467],['August', 2034415, 906883],['September', 2532855, 1006571],['October', 3133635, 1126727],['November', 3794500, 1258900]['December', 4512335, 1402467]
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(sorted);
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        var options = {
            hAxis: {
                format:"#"
            },
            legend:{position:'bottom'}
        };
        chart.draw(data,options);
        bepDescription(bep,sorted[sorted.length-1]);
    });
}
var InsertHead = "<h6>Insights</h6>"
var listStart = "<ul class=\"text-small\">"
var listEnd = "</ul>"
var bolds = "<span class=\"bold\">"
var bolde = "</span>"
function bepDescription(bep,arr){
    let l1 = "<li>Number of units sales required to reach BEP:"+bolds+parseInt(bep,10)+bolde+" units</li>";
    let l2 = "<li>The Revenue at which BEP is achieved is: "+bolds+"Rs."+parseInt(bep*sp)+bolde+"</li>";
    let l3 = "<li>The product "+bolds+docid+bolde+" ";
    if(arr[1]>bep*sp){
        l3+="has crossed it's BEP.</li>";
    }
    else{
        l3+="is yet to reach it's BEP.</li>";
    }
    document.getElementById("beaDescription").innerHTML = InsertHead+listStart+l1+l2+l3+listEnd;
}

function drawMinandMax(obj){
    let size = Object.keys(obj).length-1;
    let minmax = getMinMax(obj,size);
    let arr = [['Day','Sales',{role:'style'}]];
    let store = new Array(2);
    for(let i=1;i<=size;i++){
        let temp = []
        if(obj[i]==minmax[0]){temp = [i,obj[i],'green'];store[0]=[i,obj[i]];}
        else if(obj[i]==minmax[1]){temp = [i,obj[i],'red'];store[1]=[i,obj[i]];}
        else temp = [i,obj[i],'#3366cc']
        arr.push(temp);
    }
    google.charts.load('current',{packages:['corechart']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(arr);
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
        chart.draw(data,options);
        MinMaxDescription(store);
    });
}

function MinMaxDescription(store){
    let l1 = "<li>The maximum sales were observed on "+bolds+store[0][0]+"th day"+bolde+" of this month,with "+bolds+store[0][1]+" units sold."+bolde+"</li>";
    let l2 = "<li>The minimum sales were observed on "+bolds+store[1][0]+"th day"+bolde+" of this month,"+"</br>"+"with only "+bolds+store[1][1]+" units sold."+bolde+"</li>";

    document.getElementById("MinMaxDescription").innerHTML = InsertHead+listStart+l1+l2+listEnd;
}

function getMinMax(obj,size){
    let minmax= new Array(2);
    minmax[0] = obj[1]
    minmax[1] = obj[1]
    for(let i=2;i<=size;i++){
        if(obj[i]>minmax[0])minmax[0] = obj[i];
        if(obj[i]<minmax[1])minmax[1] = obj[i];
    }
    return minmax;
}

function drawCurMonthTrend(obj){
    let size = Object.keys(obj).length-1;
    let arr = [['Day','Sales']]
    for(let i=1;i<=size;i++)arr.push([i,obj[i]]);
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(arr);
        var chart = new google.visualization.LineChart(document.getElementById('curMonthTrend'));
        var msg="";
        google.visualization.events.addListener(chart, 'ready', function() {
            msg = analyzeTrend(data);
        });
        chart.draw(data,options);
        TrendDetails(parseInt(obj.total/size),msg);
        drawWeeklyBar(arr);
    });
}

function TrendDetails(i,msg){
    let l1 = "<li>Average sales per day:"+bolds+i+" units"+bolde+"</li>";
    let l2 = "<li>"+msg+"</li>";
    document.getElementById("cmtDescription").innerHTML = InsertHead + listStart + l1 + l2 + listEnd;
}

function analyzeTrend(data) {
    var upwardCount = 0;
    var downwardCount = 0;
    var numDataPoints = data.getNumberOfRows();
  
    for (var i = 1; i < numDataPoints; i++) {
      var y1 = data.getValue(i - 1, 1);
      var y2 = data.getValue(i, 1);
  
      if (y1 < y2) {
        upwardCount++;
      } else if (y1 > y2) {
        downwardCount++;
      }
    }
  
    if (upwardCount > downwardCount) {
      return('The trend has '+bolds+'major ups'+bolde+',the sales are '+bolds+'consistent and growing.'+bolde);
    } else if (downwardCount > upwardCount) {
      return('The trend has '+bolds+'major downfalls'+bolde+',the sales are '+bolds+'inconsistent.'+bolde);
    } else {
      return('The trend is mixed or flat.');
    }
  }
  

function drawWeeklyBar(arr){
    let w1=[['Day','Total Sales',{role:'style'}]];
    let w2=[['Day','Total Sales',{role:'style'}]];
    let w3=[['Day','Total Sales',{role:'style'}]];
    let w4=[['Day','Total Sales',{role:'style'}]];

    for(let i=1;i<arr.length;i++){
        if(i<=7){
            w1.push([arr[i][0],arr[i][1],'#3366cc']);
        }
        else if(i<=14){
            w2.push([arr[i][0],arr[i][1],'#3366cc']);
        }
        else if(i<=21){
            w3.push([arr[i][0],arr[i][1],'#3366cc']);
        }
        else{
            w4.push([arr[i][0],arr[i][1],'#3366cc']);
        }
    }

    findAndSet(w1,"w1barIns");
    findAndSet(w2,"w2barIns");
    findAndSet(w3,"w3barIns");
    findAndSet(w4,"w4barIns");


    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(w1);
        var chart = new google.visualization.ColumnChart(document.getElementById('w1bar'));
        chart.draw(data,options);
    });

    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(w2);
        var chart = new google.visualization.ColumnChart(document.getElementById('w2bar'));
        chart.draw(data,options);
    });

    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(w3);
        var chart = new google.visualization.ColumnChart(document.getElementById('w3bar'));
        chart.draw(data,options);
    });

    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(w4);
        var chart = new google.visualization.ColumnChart(document.getElementById('w4bar'));
        chart.draw(data,options);
    });
}

var options = {
    legend: { position: 'bottom' }
}


function drawQtrend(){
    let q1=[['Month','Total Sales',{role:'style'}]];
    let q2=[['Month','Total Sales',{role:'style'}]];
    let q3=[['Month','Total Sales',{role:'style'}]];

    for(let i=1;i<=12;i++){
        if(i<=4){
            q1.push([monthMap[i],everyMonthTotal.get(monthMap[i]),'#3366cc']);
        }
        else if(i<=8){
            q2.push([monthMap[i],everyMonthTotal.get(monthMap[i]),'#3366cc']);
        }
        else{
            q3.push([monthMap[i],everyMonthTotal.get(monthMap[i]),'#3366cc']);
        }
    }

    findAndSet(q1,"q1barIns");
    findAndSet(q2,"q2barIns");
    findAndSet(q3,"q3barIns");


    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(q1);
        var chart = new google.visualization.ColumnChart(document.getElementById('q1bar'));
        chart.draw(data,options);
        // var chart = new google.visualization.LineChart(document.getElementById('q1line'));
        // chart.draw(data);

        

    });
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(q2);
        var chart = new google.visualization.ColumnChart(document.getElementById('q2bar'));
        chart.draw(data,options);
        // var chart = new google.visualization.LineChart(document.getElementById('q2line'));
        // chart.draw(data);
    });
    google.charts.load('current',{packages:['corechart','line']});
    google.charts.setOnLoadCallback(()=>{
        var data = google.visualization.arrayToDataTable(q3);
        var chart = new google.visualization.ColumnChart(document.getElementById('q3bar'));
        chart.draw(data,options);
        // var chart = new google.visualization.LineChart(document.getElementById('q3line'));
        // chart.draw(data);

    });
}

function findAndSet(q,id){
    let max=q[1][1];
    let maxIndex=1;
    let min=q[1][1];
    let minIndex = 1;
    for(let i=1;i<=4;i++){
        if(q[i][1]>max){max = q[i][1]; maxIndex = i;}
        if(q[i][1]<min){min = q[i][1]; minIndex = i;}
    }
    q[maxIndex][2] = 'green';
    q[minIndex][2] = 'red';

    qDescription([max,q[maxIndex][0],min,q[minIndex][0]],id);
}

function qDescription(store,idName){
    let l1 = "<li>The maximum sales were observed in "+bolds+store[1]+bolde+", with "+bolds+store[0]+" units sold."+bolde+"</li>";
    let l2 = "<li>The minimum sales were observed on "+bolds+store[3]+bolde+"</br>"+", with only "+bolds+store[2]+" units sold."+bolde+"</li>";
    // console.log(idName)
    document.getElementById(idName).innerHTML = InsertHead+listStart+l1+l2+listEnd;
}

// ref.collection("allproducts").doc(docid).get().then((doc) => {
//     if (doc.exists) {
//         fc = doc.data().fixedcost;
//         vc = doc.data().variablecost;
//         sp = doc.data().sellingprice;

//         docRef.get().then((doc) => {
//             if (doc.exists) {
//                 var info = doc.data();
//                 var size = Object.keys(info).length;
//                 var min = info[1];
//                 var max = info[1];

//                 google.charts.load('current', { packages: ['corechart', 'line'] });
//                 google.charts.setOnLoadCallback(drawchart);
//                 google.charts.setOnLoadCallback(drawMinMax);

//                 function drawchart() {
//                     var data = new google.visualization.DataTable();
//                     data.addColumn('number', 'Days');
//                     data.addColumn('number', 'Expenditure');
//                     data.addColumn('number', 'Revenue');
//                     data.addRows(size + 1);
//                     var i = 1;
//                     data.setCell(0, 0, 0);
//                     data.setCell(0, 1, fc);
//                     data.setCell(0, 2, 0);
//                     var expenditure = fc;
//                     var revenue = 0;

//                     while (i <= size) {
//                         if(info[i]<min)min = info[i];
//                         if(info[i]>max)max = info[i];
//                         expenditure += info[i] * vc;
//                         revenue += info[i] * sp;
//                         data.setCell(i, 0, i);
//                         data.setCell(i, 1, expenditure);
//                         data.setCell(i, 2, revenue);
//                         i = i + 1;
//                     }

//                     var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
//                     var options = {
//                         hAxis: {
//                             format:"#"
//                         }
//                     };
//                     chart.draw(data,options);
//                 }



//                 function drawMinMax(){
//                     var data = new google.visualization.DataTable();
//                     data.addColumn('number', 'Days');
//                     data.addColumn('number', 'Sales');
//                     data.addColumn({type:'string',role:'style'});
//                     data.addRows(size+1);
//                     var i = 1;
//                     while(i<=size){
//                         data.setCell(i,0,i,);
//                         data.setCell(i,1,info[i]);
//                         if(info[i]==max)data.setCell(i,2,'green');
//                         if(info==min)data.setCell(i,2,'red');
                
//                         i=i+1;
//                     }
                
//                     // Set chart options
//                     var options = {'title':'Max:Green||Min:Red',
//                                     'width':400,
//                                     'height':300};
                
//                     // Instantiate and draw our chart, passing in some options.
                
//                     var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
//                     chart.draw(data,options);
//                 }
//             } else {
//                 console.log("No such document!");
//             }
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//         });
//     } else {
//         console.log("No such document!");
//     }
// }).catch((error) => {
//     console.log("Error getting document:", error);
// });
