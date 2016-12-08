/**
 * Created by rival on 8/12/2016.
 */

let Rovers = [];
RoversTracker = new Tracker.Dependency;
Template.homeIndex.helpers({
    rovers: function () {
        RoversTracker.depend();
        return Rovers;
    }

});
Template.homeIndex.events({

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
                        console.log(res2.data);
                        Rovers.push({id:ell,name:res2.data.name,direction:res2.data.direction,speed:res2.data.speed,position:res2.data.position})
                        RoversTracker.changed();
                    }
                });
            });
            console.log(Rovers);

        }
    });
};