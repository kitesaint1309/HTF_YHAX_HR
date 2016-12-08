/**
 * Created by rival on 8/12/2016.
 */


let Rovers = [];
RoversTracker = new Tracker.Dependency;
let DataReqLoop = false;
let favo =['6ea5ddac-b723-42c8-9056-ece39550aa05'];
let temps = {top: -999, low: 999};
let topTempRover = null;
let topTempTracker = new Tracker.Dependency;


Template.registerHelper('isfavo', (a)=> {
    let isfavo =false;
    for (let i in favo) {
        if (favo[i] == a) {
            isfavo = true;
        }
    }
    return isfavo;
});

Template.homeIndex.helpers({
    rovers: function () {
        RoversTracker.depend();
        return Rovers;
    },
    temps: function () {
        topTempTracker.depend();
        return temps;
    }

});
Template.homeIndex.events({
    'click .fovorite'(event,template){
        const id = event.target.attributes["data-id"].value;
        console.log(event.target.checked);
        if (event.target.checked){
            favo.push(id);
        }else {
            removefavo(id);
        }

    }

});
Template.homeIndex.rendered = function () {
    if(Rovers.length <= 1){
        HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel",function (err,res) {
            if(!err){
                //console.log(res.data);
                res.data.forEach(function (ell,index) {
                    HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+ell,function (err2,res2) {
                        if(err2){
                            //console.log("rover: " +ell +" offline");
                        }else{
                            let distX = Math.abs(200-res2.data.position.x);
                            let distY = Math.abs(200-res2.data.position.y);
                            let dist = Math.floor( Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2)));
                            //console.log(res2.data);
                            Rovers.push({id:ell,name:res2.data.name,direction:res2.data.direction,speed:res2.data.speed,position:res2.data.position,distance:dist});
                            RoversTracker.changed();
                        }
                    });
                });
                //console.log(Rovers);

            }
        });
    }

    DataReqLoop = setInterval(function () {
        HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel",function (err,res) {
            if(!err){
                //console.log(res.data);
                res.data.forEach(function (ell,index) {
                    HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+ell,function (err2,res2) {
                        if(err2){
                           // console.log("rover: " +ell +" offline");
                        }else{
                            let distX = Math.abs(200-res2.data.position.x);
                            let distY = Math.abs(200-res2.data.position.y);
                            let dist = Math.floor( Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2)));
                            //console.log(res2.data);
                            update_Data(ell,{id:ell,name:res2.data.name,direction:res2.data.direction,speed:res2.data.speed,position:res2.data.position,distance:dist});
                            RoversTracker.changed();
                        }
                    });
                });
                //console.log(Rovers);

            }
        });
    },1000);
};

function update_Data( id, newData ) {
    for (var i in Rovers) {
        if (Rovers[i].id == id) {
            Rovers[i] = newData;
            break; //Stop this loop, we found it!
        }
    }
}

function removefavo( id ) {
    let index = -2;
    for (let i in favo) {
        if (favo[i] == id) {
            console.log(favo);
            favo.splice(i, 1);
            console.log(favo);

            break; //Stop this loop, we found it!
        }
    }
    if (index > -1) {
        favo.splice(index, 1);
    }
}

setInterval(function () {
    if (Rovers && Rovers.length > 0){
        Rovers.forEach(function (ell,ind) {
            HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+ell.id+"/sensor/t1",function (err,res) {
                if(!err){
                    if(res.data > 10){
                        sAlert.warning("Temp: "+res.data+" at " + ell.position.x +", "+ ell.position.y)
                    }
                    if(temps.top < res.data){
                        temps.top = res.data;
                        topTempRover = ell;
                        console.log("toptemp = " + temps.top);
                        topTempTracker.changed();
                    }
                    if(temps.low > res.data){
                        temps.low = res.data;
                        //topTempRover = ell;
                        console.log("toptemp = " + temps.low);
                        topTempTracker.changed();
                    }
                }
            });
        })
    }
},5000);