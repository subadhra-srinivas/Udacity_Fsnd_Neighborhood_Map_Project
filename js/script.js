 // Create a global variable
var map;
var infoWindow;
var loadData;
// function to initialize the map
function initMap() {

// use a constructor to create a new map JS object. You can use the coordinates
// we used, 37.3366824, -122.031958 or your own!
    map = new google.maps.Map(document.getElementById('map'), {
       center: {lat: 37.3366824, lng: -122.031958},
       zoom: 13
    });



   ko.applyBindings(new ViewModel());

}
//initialize the data for the pizza Shop
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

//function gets information from FourSquare and stores in the variable,
//creates infoWindow and markers for the particular location
loadData = function(data) {

    //initialize local variables
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.address = '';
    this.city = '';
    this.contact = '';
    this.displayString ='';

    this.visible = ko.observable(true);


    //Store the client_id and client_secret from FourSquare in a variable
    var client_id = '42ITZKVEY5AIIHWENOHIF1CXCCXYS1VPU4V0VSRWYDTYZNM5';
    var client_secret= 'MGNJU45QOQKYTCYVUVQTW5KPGEZEI2BUE4UYZEIRGKJIOHPE';


    //FourSquare query to get the address, city and contact information for the pizza shop
    var pizza_shop = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll='+ this.lat+'%2C%20'+this.lng+'&query='+this.name+'&client_id='+client_id+'&client_secret='+client_secret;

    //AJAX request to FourSquare
    $.getJSON(pizza_shop).done(function(data) {

       var shop = data.response.venues[0];


       self.address = shop.location.formattedAddress[0] || 'No Address';

       self.city = shop.location.formattedAddress[1] || 'No Address';

       self.contact = shop.contact.phone || 'No Phone';



    //function to check if there is any error in getting the data from Foursquare
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
        animation: google.maps.Animation.DROP,
    });



    // When marker is clicked on open up infowindow designated to the marker with it's information.
    this.marker.addListener('click', function(){

        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ self.marker.setAnimation(null); }, 1450);

        self.infoWindow.setContent("<b>"+data.name+"</b></br>"+self.address +"</br>"+self.city+"</br>"+self.contact);
        self.infoWindow.open(map, this);
    });

    // Makes the one selected marker visible
    this.displayMarker = ko.computed(function() {
        if(self.visible() === true) {
            self.marker.setMap(map);
        } else {
            self.marker.setMap(null);
        }
        return true;
    }, self);


};


//Creating a Knockout ViewModel
var ViewModel= function() {

    var self = this;

    //Creating a pizzaShopList as a observable array
    this.pizzaShopList = ko.observableArray([]);

    //Creating the filter as observable variable
    this.filter = ko.observable('');

    //Creating a new pizzaShopList array
    data.forEach(function(pizzaShop) {
        self.pizzaShopList.push(new loadData(pizzaShop));
    });


    //clicks the PizzaShopList to display the marker and infoWindow
    this.setPizzaShopList = function(clickedPizzaShopList) {
           var clickedShop = this;

           clickedShop.infoWindow.setContent("<b>"+clickedShop.name+"</b></br>"+clickedShop.address +"</br>"+clickedShop.city+"</br>"+clickedShop.contact);
           clickedShop.infoWindow.open(map, clickedShop.marker);
           clickedShop.marker.setAnimation(google.maps.Animation.BOUNCE);
           setTimeout(function() {
                 clickedShop.marker.setAnimation(null);
           }, 1450);
           map.panTo(clickedShop.marker.position);
    };

   //filter the items using the filter text
    this.filteredMarkers = ko.computed(function() {
          var filter = self.filter().toLowerCase();
          if (!filter) {
                self.pizzaShopList().forEach(function(pizzaShop){
                         pizzaShop.visible(true);

                });
                return self.pizzaShopList();
          } else {
                return ko.utils.arrayFilter(self.pizzaShopList(), function(pizzaShop) {
                        var result = pizzaShop.name.toLowerCase().indexOf(filter) >= 0;

                        //sets markers with match to visible
                        pizzaShop.visible(result);
                        pizzaShop.marker.setAnimation(google.maps.Animation.DROP);

                        return result;

                });
          }
    }, self);
};


