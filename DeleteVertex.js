var G = google.maps;
var zoom = 7;
var centerPoint = new G.LatLng(45.5, -100.5);


$(function () {
    // create options object
    var myOptions = {
        center: centerPoint,
        zoom: zoom,
        mapTypeId: G.MapTypeId.ROADMAP
    };

    // create map with options
    var map = new G.Map($("#map_canvas")[0], myOptions);

    addPolygon(map);
});


function addPolygon(map) {
    var paths = [
          new G.LatLng(45, -100),
          new G.LatLng(45.5, -99.5),
          new G.LatLng(46, -100),
          new G.LatLng(46, -101),
          new G.LatLng(45, -101)
  ];

    poly = new G.Polygon({
        clickable: false,
        paths: paths,
        map: map
    });

    poly.setEditable(true);

    addDeleteButton(poly, 'http://i.imgur.com/RUrKV.png');
}


function addDeleteButton(poly, imageUrl) {
    var path = poly.getPath();
    path["btnDeleteClickHandler"] = {};
    path["btnDeleteImageUrl"] = imageUrl;

    google.maps.event.addListener(poly.getPath(), 'set_at', pointUpdated);
    google.maps.event.addListener(poly.getPath(), 'insert_at', pointUpdated);
}

function pointUpdated(index) {
    var path = this;
    var btnDelete = getDeleteButton(path.btnDeleteImageUrl);

    if (btnDelete.length === 0) {
        var undoimg = $("img[src$='http://maps.gstatic.com/mapfiles/undo_poly.png']");

        undoimg.parent().css('height', '21px !important');
        undoimg.parent().parent().append('<div style="overflow-x: hidden; overflow-y: hidden; position: absolute; width: 30px; height: 27px;top:21px;"><img src="' + path.btnDeleteImageUrl + '" class="deletePoly" style="height:auto; width:auto; position: absolute; left:0;"/></div>');

        // now get that button back again!
        btnDelete = getDeleteButton(path.btnDeleteImageUrl);
        btnDelete.hover(function () { $(this).css('left', '-30px'); return false; },
                    function () { $(this).css('left', '0px'); return false; });
        btnDelete.mousedown(function () { $(this).css('left', '-60px'); return false; });
    }

    // if we've already attached a handler, remove it
    if (path.btnDeleteClickHandler)
        btnDelete.unbind('click', path.btnDeleteClickHandler);

    // now add a handler for removing the passed in index
    path.btnDeleteClickHandler = function () {
        path.removeAt(index);
        return false;
    };
    btnDelete.click(path.btnDeleteClickHandler);
}

function getDeleteButton(imageUrl) {
    return $("img[src$='" + imageUrl + "']");
}

