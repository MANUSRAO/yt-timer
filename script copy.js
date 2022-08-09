let starter = (value) => {
    storageArr = value;
    console.log(storageArr);
    storageArr = JSON.parse(storageArr.arrWeek);
    let newArr;
    if(storageArr!=undefined)
        newArr = [...storageArr];
    else
        newArr = [0,0,0,0,0,0,0];
    let today = new Date().getDay();
    let todayCount = 0;
    todayCount = parseInt(newArr[today]);
    console.log("Today " +todayCount);
    let starts = document.querySelector("#start");
    let child = document.createElement("h2");
    child.setAttribute("id","timer-func");
    child.innerText = " s";
    child.style = "color:#fff";
    starts.append(child);
    setInterval(function() {   
        if(window.closed) {  
            clearInterval(timer);         
        }  
        else{
            todayCount += 1;
            let hours = Math.floor(todayCount/3600);
            let min = Math.floor((todayCount - hours*3600)/60);
            let seconds = Math.floor(todayCount - (min*60+hours*3600));
            update(hours,min,seconds,child);
        }
    }, 1000);
    window.addEventListener('beforeunload', function () {
        newArr[today]=todayCount;
        chrome.storage.local.set({'arrWeek':JSON.stringify(newArr)},function(){
        });
    });
}
let getLocalStorageValue = (key,func) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(func(value));
            })
        }
        catch (ex) {
            reject("Unexpected error occurred: "+ex);
        }
    });
}
getLocalStorageValue("arrWeek",starter);
function update(hours, min, seconds,child){
    let result = " ";
    if(hours>0)
        result = hours + " Hr " + min+" min "+seconds+" s ";
    else if(min > 0)
        result = min+" min "+seconds+" s ";
    else
        result = seconds+" s ";
    child.innerHTML = result;
}