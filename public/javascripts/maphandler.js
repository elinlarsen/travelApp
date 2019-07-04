class mapHandler {
  constructor(mapId, zoom, center) {
    this.mapId = mapId;
    this.zoom = zoom;
    this.center = center;
    this.geocoder = new google.maps.Geocoder();
    this.markersList = [];

    this.map = new google.maps.Map(document.getElementById(this.mapId), {
      zoom: this.zoom,
      center: center
    });
  }

  geoCodeAddress(addressToGeocode, clbk) {
    this.geocoder.geocode({ address: addressToGeocode }, function(
      results,
      status
    ) {
      if (status == "OK") {
        let position = {};
        position.lat = results[0].geometry.location.lat();
        position.lng = results[0].geometry.location.lng();
        clbk(position);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  addMarker(position, index, newLocation, label, startDate) {
    let marker = new google.maps.Marker({
      position: position
      //label: this.markersList.length.toString()
    });

    // this.markersList.forEach(marker => marker.setLabel(null));

    //    console.log(newlocation);
    this.markersList.push({
      marker,
      index: index,
      location: newLocation,
      startDate: startDate
    });

    this.sortMarkersByDate();

    this.map.setCenter({
      lat: this.markersList[this.markersList.length - 1].marker.position.lat(),
      lng: this.markersList[this.markersList.length - 1].marker.position.lng()
    });

    let markersListSize = this.markersList.length;

    this.markersList.forEach((markerItem, index) => {
      markerItem.marker.setLabel((index + 1).toString());
      markerItem.marker.setMap(this.map);
    });

    setTimeout(() => this.connectAllMarkers(), 400);
  }

  sortMarkersByDate() {
    this.markersList = this.markersList.sort((a, b) => {
      if (
        convertToJavascriptDateFormat(a.startDate) >
        convertToJavascriptDateFormat(b.startDate)
      )
        return 1;
      else return -1;
    });
  }

  deleteMarker(index) {
    // console.log("Marker to delete is" + index);
    // console.log(this.markersList[index].marker.position.lat());

    this.markersList[index].marker.setMap(null);
    this.markersList[index].marker = null;
    this.markersList.splice(index, 1);

    //console.log(this.markersList);
  }

  displayOrHideMarkersConnections(marker1, marker2, action) {
    let coordinates = [
      {
        lat: marker1.position.lat(),
        lng: marker1.position.lng()
      },
      {
        lat: marker2.position.lat(),
        lng: marker2.position.lng()
      }
    ];

    let line = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    //console.log(action);
    if (action === "display") line.setMap(this.map);
    if (action === "hide") line.setMap(null);
  }

  displayMarker() {}

  displayMapConnections() {
    console.log("ready to display connections");

    if (this.markersList.length >= 2) {
      for (let i = 2; i <= this.markersList.length; i++) {
        this.displayOrHideMarkersConnections(
          this.markersList[i - 2].marker,
          this.markersList[i - 1].marker,
          "display"
        );
      }
    }
  }

  deleteMapConnections() {
    if (map.markersList.length >= 2) {
      for (i = 2; i <= map.markersList.length; i++) {
        map.displayOrHideMarkersConnections(
          map.markersList[i - 2].marker,
          map.markersList[i - 1].marker,
          "hide"
        );
      }
    }
  }

  connectAllMarkers() {
    console.log("connecting");

    let markersListSize = this.markersList.length;
    console.log(this.markersList);

    console.log("At this stage, marker list size is " + markersListSize);
    if (markersListSize > 1) {
      for (let i = 2; i <= markersListSize; i++) {
        console.log(
          "connecting " +
            this.markersList[i - 1].location +
            " and " +
            this.markersList[i - 2].location
        );

        this.displayOrHideMarkersConnections(
          this.markersList[i - 2].marker,
          this.markersList[i - 1].marker,
          "display"
        );
      }
    }
  }
}
