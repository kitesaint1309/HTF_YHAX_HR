let Rovers = [];
RoversTracker = new Tracker.Dependency;
let DataReqLoop;
let roverMap = null;
let imageBase, imageRover;
getColor = function () {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
};

drawRoverOnMap = function (ctx) {
    console.log("draw");
    ctx.clearRect(0, 0, roverMap.width, roverMap.height);
    console.log("cleared");
    ctx.drawImage(imageBase, roverMap.width / 2, roverMap.height / 2, 50, 50);
    //ctx.fillRect(roverMap.width / 2 - 30, roverMap.height / 2 - 30, 30, 30);
    Rovers.forEach(function (rover, index) {
        console.log("draw" + rover);
        //ctx.drawImage(imageRover, rover.position.x * 2 + roverMap.width / 4, rover.position.y * 2 + roverMap.height / 4, 50, 50)
        //ctx.fillStyle= getColor();
        console.log(index);
        ctx.fillRect(rover.position.x + roverMap.width / 2, rover.position.y + roverMap.height / 2, 10, 10);
    });
};

Template.roverMap.rendered = function () {
    let ctx;
    if (!roverMap) {
        roverMap = document.getElementById("map");
        console.log("Map added");
        ctx = roverMap.getContext("2d");

        imageBase = new Image();
        imageBase.src = "img/base.png";
        imageRover = new Image();
        imageRover.src = "img/rover.png";
    }

    HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel", function (err, res) {
        if (!err) {
            console.log(res.data);
            res.data.forEach(function (ell, index) {
                HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel/" + ell, function (err2, res2) {
                    if (err2) {
                        console.log("rover: " + ell + " offline");
                    } else {
                        let distX = Math.abs(200 - res2.data.position.x);
                        let distY = Math.abs(200 - res2.data.position.y);
                        let dist = Math.floor(Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)));
                        console.log(res2.data);
                        Rovers.push({
                            id: ell,
                            name: res2.data.name,
                            direction: res2.data.direction,
                            speed: res2.data.speed,
                            position: res2.data.position,
                            distance: dist
                        });
                        drawRoverOnMap(ctx);
                    }
                });
            });
            console.log(Rovers);

        }
    });
    DataReqLoop = setInterval(function () {
        HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel", function (err, res) {
            if (!err) {
                console.log(res.data);
                res.data.forEach(function (ell, index) {
                    HTTP.call("GET", "https://roguerovers-api-develop.azurewebsites.net/api/channel/" + ell, function (err2, res2) {
                        if (err2) {
                            console.log("rover: " + ell + " offline");
                        } else {
                            let distX = Math.abs(200 - res2.data.position.x);
                            let distY = Math.abs(200 - res2.data.position.y);
                            let dist = Math.floor(Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)));
                            console.log(res2.data);
                            Rovers.push({
                                id: ell,
                                name: res2.data.name,
                                direction: res2.data.direction,
                                speed: res2.data.speed,
                                position: res2.data.position,
                                distance: dist
                            });
                            drawRoverOnMap(ctx);
                        }
                    });
                });
                console.log(Rovers);

            }
        });
    }, 1000);
};

