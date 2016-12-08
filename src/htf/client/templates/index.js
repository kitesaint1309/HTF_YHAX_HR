/**
 * Created by rival on 8/12/2016.
 */

let Rovers = [];
RoversTracker = new Tracker.Dependency;
let DataReqLoop;

Template.homeIndex.helpers({
    rovers: function () {
        RoversTracker.depend();
        return Rovers;
    }

});
Template.homeIndex.events({
    'click #'(event){

        clearInterval(DataReqLoop);
    }

});
Template.homeIndex.rendered = function () {
    HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel",function (err,res) {
        if(!err){
            console.log(res.data);
            res.data.forEach(function (ell,index) {
                HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+ell,function (err2,res2) {
                    if(err2){
                        console.log("rover: " +ell +" offline");
                    }else{
                        let distX = Math.abs(200-res2.data.position.x);
                        let distY = Math.abs(200-res2.data.position.y);
                        let dist = Math.floor( Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2)));
                        console.log(res2.data);
                        Rovers.push({id:ell,name:res2.data.name,direction:res2.data.direction,speed:res2.data.speed,position:res2.data.position,distance:dist});
                        RoversTracker.changed();
                    }
                });
            });
            console.log(Rovers);

        }
    });
    DataReqLoop = setInterval(function () {
        HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel",function (err,res) {
            if(!err){
                console.log(res.data);
                res.data.forEach(function (ell,index) {
                    HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+ell,function (err2,res2) {
                        if(err2){
                            console.log("rover: " +ell +" offline");
                        }else{
                            let distX = Math.abs(200-res2.data.position.x);
                            let distY = Math.abs(200-res2.data.position.y);
                            let dist = Math.floor( Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2)));
                            console.log(res2.data);
                            Rovers.push({id:ell,name:res2.data.name,direction:res2.data.direction,speed:res2.data.speed,position:res2.data.position,distance:dist});
                            RoversTracker.changed();
                        }
                    });
                });
                console.log(Rovers);

            }
        });
    },1000);
};