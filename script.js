currentdate = new Date();
let oneJan = new Date(currentdate.getFullYear(),0,1);
let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
let currWeekResult = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);

let weekOver = (key) => {
    return new Promise((resolve,reject) => {
        try{
            chrome.storage.local.get(key, function(value){
                resolve(value);
            })
        }
        catch(ex){
            reject("Error occurred: "+ex);
        }
    });
}
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

function starter(){
    let starts = document.querySelector("#start");
    let child = document.createElement("h2");
    child.setAttribute("id","timer-func");
    child.innerText = " s";
    child.style = "color:#000";
    starts.append(child);
}

weekOver("currWeek")
    .then((value)=>{
        let currWeekStorage;
        if(value.currWeek!=undefined)
            currWeekStorage = JSON.parse(value.currWeek);
        else{
            currWeekStorage=currWeekResult;
        }
        console.log(currWeekStorage);
        if(currWeekResult!=currWeekStorage)
            chrome.storage.local.set({'arrWeek':JSON.stringify([0,0,0,0,0,0,0])},function(){
            });
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
            let today = new Date().getDay();
            let todayCount = 0;
            todayCount = parseInt(storageArr[today]);
            starter();
            setInterval( () =>{
                let child = document.querySelector("#timer-func");
                let hours, min, seconds;
                if(window.closed) {  
                    clearInterval(timer);         
                }  
                else{
                    todayCount++;
                    hours = Math.floor(todayCount/3600);
                    min = Math.floor((todayCount - hours*3600)/60);
                    seconds = Math.floor(todayCount - (min*60+hours*3600));
                }
                let result = " ";
                if(hours>0)
                    result = hours + " Hr " + min+" min "+seconds+" s ";
                else if(min > 0)
                    result = min+" min "+seconds+" s ";
                else
                    result = seconds+" s ";
                child.innerHTML = result;
            }, 1000);  
            window.addEventListener('beforeunload', function () {
                storageArr[today]=todayCount;
                chrome.storage.local.set({'arrWeek':JSON.stringify(storageArr)},function(){
                });
            });
        });
    window.addEventListener('beforeunload', function () {
            chrome.storage.local.set({'currWeek':JSON.stringify(currWeekResult)},function(){
            });
        });
    })
