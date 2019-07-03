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

  addMarker(position, index, newlocation, label) {
    // console.log("Marker position is " + position);

    console.log("label to mark is " + label);

    let marker = new google.maps.Marker({
      map: this.map,
      position: position,
      label: { text: String(label) }
    });

    //    console.log(newlocation);
    this.markersList.push({ marker, index, location: newlocation });
    this.map.setCenter({
      lat: this.markersList[this.markersList.length - 1].marker.position.lat(),
      lng: this.markersList[this.markersList.length - 1].marker.position.lng()
    });
    //   console.log(this.markersList);
  }

  deleteMarker(index) {
    // console.log("Marker to delete is" + index);
    // console.log(this.markersList[index].marker.position.lat());

    this.markersList[index].marker.setMap(null);
    this.markersList[index].marker = null;
    this.markersList.splice(index, 1);

    //console.log(this.markersList);
  }

  displayOrHideMarkers(marker1, marker2, action) {
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
}
