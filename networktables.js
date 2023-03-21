NetworkTables.addRobotConnectionListener(function(connected){
    console.log("Robot connected: " + connected);
}, true);

//https://robotpy.readthedocs.io/projects/pynetworktables2js/en/stable/api_js.html