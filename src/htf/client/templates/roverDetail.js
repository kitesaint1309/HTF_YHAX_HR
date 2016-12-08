
let id = null;
let Rover = null;
let RoverTracker = new Tracker.Dependency;
let temps =["Temperatuur"];
let water = ["Water"];
let detailInterval = null;
Template.roverDetail.helpers({
    rover : function () {
        RoverTracker.depend();
        if(id != null && id != undefined){
            return Rover;
        }

    }
});


Template.roverDetail.rendered = function () {

    id = Router.current().params.id;
    let waterchart = c3.generate({
        bindto: '#chartWater',
        data: {
            // iris data from R
            columns: [
                ["Water", 10],
                ["Temperatuur", 50],
            ],
            type: 'spline',
            color: {
                pattern: [
                    '#0000ff', '#ff0000']
            }
    }
    });

    temps =["Temperatuur"];
    water = ["Water"];
    if(detailInterval != null){
        clearInterval(detailInterval);
    }

    detailInterval = setInterval(function () {
        HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+id,function (err2,res2) {
            if(err2){
                console.log("rover: " +id +" offline");
            }else{
                let distX = Math.abs(200-res2.data.position.x);
                let distY = Math.abs(200-res2.data.position.y);
                let dist = Math.floor( Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2)));
                console.log(res2.data);
                Rover = ({id:id,name:res2.data.name,direction:res2.data.direction,speed:res2.data.speed,position:res2.data.position,distance:dist});
                RoverTracker.changed();
                HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+id+"/sensor/t1",function (err,res) {
                    if(!err){
                        console.log("temp: "+ res.data);
                        temps.push(res.data);
                    }
                });
                HTTP.call("GET","https://roguerovers-api-develop.azurewebsites.net/api/channel/"+id+"/sensor/w1",function (err,res) {
                    if(!err){
                        console.log("water: "+ res.data);
                        water.push(res.data);
                    }
                });
                if(water.length > 200){
                    water.slice(1,1);
                }
                if(temps.length > 200){
                    temps.slice(1,1);
                }


                waterchart.load({
                    columns:[water,temps]
                })
            }
        });
    },1000)
};
Template.roverDetail.onDestroyed(function () {
    if(detailInterval != null){
        clearInterval(detailInterval);
    }
    console.log("template destroyed")
});

