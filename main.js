window.onload = function () {
    let getLocalStorageValue = (key) => {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.get(key, function (value) {
                    resolve(value);
                })
            }
            catch (ex) {
                reject("Unexpected error occurred: "+ex);
            }
        });
    }
    let storageArr = undefined;
    getLocalStorageValue("arrWeek")
        .then((value)=>{
            storageArr = value;
            if(storageArr.arrWeek!=undefined)
                storageArr = JSON.parse(storageArr.arrWeek);
            else{
                storageArr.arrWeek = [0,0,0,0,0,0,0];
                storageArr = storageArr.arrWeek;
            }
            if(storageArr==undefined)
                storageArr = [0,0,0,0,0,0,0];
            let max = Math.max(...storageArr);
            let hours, min, seconds;
            hours = Math.floor(max/3600);
            min = Math.floor((max - hours*3600)/60);
            seconds = Math.floor(max - (min*60+hours*3600));
            let label = undefined;
            let label2 = undefined;
            console.log(max);
            let modifiedArr;
            if(hours>0){
                let sum = 0;
                label = 'Time (Hr)';
                label2 = "Hr";
                modifiedArr = storageArr.map(function(num){
                    num = (num/3600);
                    num = Math.round((num + Number.EPSILON) * 100) / 100;
                    sum += num;
                    return num;
                })
                let avg = sum/7;
                avg = Math.round((avg + Number.EPSILON) * 100) / 100;
                let h2ele = document.createElement("h2");
                let text = document.createTextNode("Average time: "+avg+" Hours");
                h2ele.appendChild(text);
                const element = document.getElementById("container");
                element.appendChild(h2ele);
                document.querySelector("h2").style["text-align"] = "center";
            }
            else if(min > 0){
                let sum = 0;
                label = 'Time (min)';
                label2= 'min';
                modifiedArr = storageArr.map(function(num){
                    num = (num/60);
                    num = Math.round((num + Number.EPSILON) * 100) / 100;
                    sum += num;
                    return num;
                })
                let avg = sum/7;
                avg = Math.round((avg + Number.EPSILON) * 100) / 100;
                let h2ele = document.createElement("h2");
                let text = document.createTextNode("Average time: "+avg+" Minutes");
                h2ele.appendChild(text);
                const element = document.getElementById("container");
                element.appendChild(h2ele);
                document.querySelector("h2").style["text-align"] = "center";
            }
            else if(seconds>=0){
                label = 'Time (s)';
                label2 = 'seconds';
                modifiedArr = storageArr;
            }
            var options = {
                colors:['#F44336'],
                series: [{
                    name: 'Time',
                    data: modifiedArr   
                }],
                chart: {
                    type: 'bar',
                    height: 350,
                    width:400,
                    toolbar:{
                        show:false
                    }
                  },
                plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '55%',
                      endingShape: 'rounded',
                      dataLabels: {
                        position: 'top', // top, center, bottom
                      }
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                      return val;
                    },
                    offsetY: -20,
                    style: {
                      fontSize: '12px',
                      colors: ["#304758"]
                    }
                  },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'],
                },
                yaxis: {
                    title: {
                      text: label
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    enabled:false,
                    y: {
                      formatter: function (val) {
                        return val + label2;
                      }
                    }
                  }
                };
            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();
        })
}  