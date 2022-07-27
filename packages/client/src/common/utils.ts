function deg2rad( x ) { return x * Math.PI / 180 };
function rad2deg( x ) { return x * 180 / Math.PI };

function sinDeg( x ) {
  return Math.sin( deg2rad( x ) );
}

function cosDeg( x ) {
  return Math.cos( deg2rad( x ) );
}

function asinDeg( x ) {
  return rad2deg( Math.asin( x ) );
}

function atan2Deg( y, x ) {
  return rad2deg( Math.atan2( y, x ) );
}

// getLST copied from https://github.com/Blank2275/AstroCoordsJS/blob/master/index.js
// and then tweaked.

function getLST(time, lon){
    //time = new Date(time)
    const J2000Date = new Date('January 1, 2000 12:00:00 GMT+0000').getTime();
    const diff = time - J2000Date;
    const d = diff / (1000 * 60 * 60 * 24);
    var hours = time.getUTCHours();
    var minutes = time.getUTCMinutes();
    var seconds = time.getUTCSeconds();
    var ms = time.getUTCSeconds();
    var utc = (hours * (1000 * 60 * 60) + minutes * (1000 * 60) + seconds * 1000 + ms) / (1000 * 60 * 60 * 24) * 360;//(now.getTime() - beginning.getTime()) / (1000 * 60 * 60 * 24) * 360;
    var lst = 100.46 + (0.985647 * d) + lon + utc;
    if(lst > 360){
        while(lst > 360){
            lst -= 360;
        }
    } else if(lst < 0){
        while(lst < 0){
            lst += 360;
        }
    }
    return lst;
}

// Equations sourced from https://www.mathworks.com/matlabcentral/fileexchange/24581-convert-azimuth-and-elevation-to-right-ascension-and-declination

export function altazToradec( alt, az, lat, lon, time ){
    /*
    right ascension (α)
    declination (δ)
    altitude (a)
    azimuth (A)
    siderial time (ST)
    latitude (φ) (Φ)
    */
    var lst = getLST( time, lon );
    var dec = asinDeg( sinDeg( alt ) * sinDeg( lat ) + cosDeg( alt ) * cosDeg( lat ) * cosDeg( az ) );
    var ha = atan2Deg(
      -sinDeg( az ) * cosDeg( alt ) / cosDeg( dec ),
      ( sinDeg( alt ) - sinDeg( dec ) * sinDeg( lat ) ) / ( cosDeg( dec ) * cosDeg( lat ) )
    );
    var ra = ( lst - ha ) % 360;

    return {
        "ha": ha,
        "ra": ra,
        "dec": dec
    }
}