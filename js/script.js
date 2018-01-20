 // TODO: Create a map variable
var map;
var infoWindow;
var bounds;
var loadData;
// TODO: Complete the following function to initialize the map
function initMap() {

// TODO: use a constructor to create a new map JS object. You can use the coordinates
// we used, 40.7413549, -73.99802439999996 or your own!
    map = new google.maps.Map(document.getElementById('map'), {
       center: {lat: 37.3366824, lng: -122.031958},
       zoom: 13
    });



   ko.applyBindings(new ViewModel());

}

var data = [
         {
          name: 'Pizza My Heart',
          lat: 37.366824,
          lng: -122.031958
        },
        {
          name: 'Little Ceasars Pizza',
          lat: 37.3623112,
          lng: -122.0282448
        },
        {
          name:'Domino\'s Pizza',
          lat: 37.3711940473,
          lng: -122.0479160
        },
        {
          name: 'Pizza Hut',
          lat: 37.373707,
          lng: -122.054332
        },
        {
          name: 'RoundTable Pizza',
          lat: 37.3663147,
          lng: -122.0166003
        },
        {
          name: 'Milanos Pizza',
          lat: 37.37672,
          lng: -122.030082
        }

];


loadData = function(data) {
    //console.log(data);
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.address = '';
    this.city = '';
    this.contact = '';
    this.displayString ='';
    this.visible = ko.observable(true);
    //console.log(this.lat);



    var client_id = '42ITZKVEY5AIIHWENOHIF1CXCCXYS1VPU4V0VSRWYDTYZNM5';
    var client_secret= 'MGNJU45QOQKYTCYVUVQTW5KPGEZEI2BUE4UYZEIRGKJIOHPE';



    var pizza_shop = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll='+ this.lat+'%2C%20'+this.lng+'&query='+this.name+'&client_id='+client_id+'&client_secret='+client_secret;

    $.getJSON(pizza_shop).done(function(data) {

       var shop = data.response.venues[0];

       //console.log(shop);
       self.address = shop.location.formattedAddress[0] || 'No Address';
       //console.log(self.address);
       self.city = shop.location.formattedAddress[1] || 'No Address';
       //console.log(self.city);
       self.contact = shop.contact.phone || 'No Phone';
       //console.log(self.contact);



    }).fail(function(e) {
        alert('Pizza Shops Could Not be Loaded');
    });


    // Puts the content string inside infowindow.
    this.infoWindow = new google.maps.InfoWindow({content: "<b>"+data.name+"</b></br>"+self.address +"</br>"+self.city+"</br>"+self.contact});

    // Places the marker to it's designed location on the map along with it's title.
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: data.name,
        animation: google.maps.Animation.DROP
    });

    // When marker is clicked on open up infowindow designated to the marker with it's information.
    this.marker.addListener('click', function(){

        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ self.marker.setAnimation(null); }, 750);

        self.infoWindow.setContent("<b>"+data.name+"</b></br>"+self.address +"</br>"+self.city+"</br>"+self.contact);
        self.infoWindow.open(map, this);
    });


};

var ViewModel= function() {

    var self = this;


    this.pizzaShopList = ko.observableArray([]);

    data.forEach(function(pizzaShop) {
        self.pizzaShopList.push(new loadData(pizzaShop));
    });

    console.log(self.pizzaShopList()[0]);

    this.currentShop = ko.observable(this.pizzaShopList()[0]);


    this.setPizzaShopList = function(clickedPizzaShopList) {

    };
};

