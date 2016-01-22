var setRadius = function(newRad) {
    if (newRad < minRad) {
        newRad = minRad;
    }
    else if (newRad > maxRad) {
        newRad = maxRad;
    }
    return newRad;
}

var minRad = 0.5,
    maxRad = 50,
    defaultRad = 2,
    radSpan = document.getElementById("radval"),
    decrad = document.getElementById("decrad"),
    incrad = document.getElementById("incrad");
