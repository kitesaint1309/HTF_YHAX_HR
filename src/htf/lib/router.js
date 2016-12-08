/**
 * Created by rival on 2/10/2016.
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'pagenotfound'
});

Router.route("/", {
    name: "homeIndex"
});
Router.route("/rover/:id", {
    name: "roverDetail"
});
Router.route("/map", {
    name: "roverMap"
});
