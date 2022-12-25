var version = "1.0.0 Release5";
var apiVertion = "formal";
var exp = false;

//定义烈度配色
const intColor = {
    "0":{
        "bkcolor":"#444444"
    },
    "1":{
        "bkcolor":"#9bc4e4"
    },
    "2":{
        "bkcolor":"#00a0f1"
    },
    "3":{
        "bkcolor":"#0062f5"
    },
    "4":{
        "bkcolor":"#2de161"
    },
    "5":{
        "bkcolor":"#1cac5d"
    },
    "6":{
        "bkcolor":"#ffbd2b"
    },
    "7":{
        "bkcolor":"#ff992b"
    },
    "8":{
        "bkcolor":"#fa5151"
    },
    "9":{
        "bkcolor":"#f4440d"
    },
    "10":{
        "bkcolor":"#ff000d"
    },
    "11":{
        "bkcolor":"#c20007"
    },
    "12":{
        "bkcolor":"#fd2fc2"
    }
};

if (apiVertion == "test") {
    if (exp) document.getElementById("loading_Text2").innerHTML = "CEIV " + version + " 测试接口 实验版<br>提示：首次使用或长时间未使用时，加载时间可能会较长";
    if (!exp) document.getElementById("loading_Text2").innerHTML = "CEIV " + version + " 测试接口<br>提示：首次使用或长时间未使用时，加载时间可能会较长";
}

if (apiVertion == "formal"){
    if (exp) document.getElementById("loading_Text2").innerHTML = "CEIV " + version + " 正式接口 实验版<br>提示：首次使用或长时间未使用时，加载时间可能会较长";
    if (!exp) document.getElementById("loading_Text2").innerHTML = "CEIV " + version + " 正式接口<br>提示：首次使用或长时间未使用时，加载时间可能会较长";
}

addEventListener("load",function(){
    setTimeout(function(){
        $("#loading_Background").fadeTo("slow", 0);
    },1000);
    setTimeout(function(){
        $("#loading_Background").css("height", "0px");
        $("#loading_Background").css("width", "0px");
    },2000)
});

if (apiVertion == "test") {
    if (exp) document.getElementById("settingsVertion").innerHTML = "CEIV " + version + " 测试接口 实验版";
    if (!exp) document.getElementById("settingsVertion").innerHTML = "CEIV " + version + " 测试接口";
}
 
if (apiVertion == "formal"){
    if (exp) document.getElementById("settingsVertion").innerHTML = "CEIV " + version + " 正式接口 实验版";
    if (!exp) document.getElementById("settingsVertion").innerHTML = "CEIV " + version + " 正式接口";
}

document.ontouchmove = function(e) {
    e.preventDefault();
}

var cdi;
var localName;
var localLat;
var localLon;
function initProgram() {
    localName = getCookie("localName");
    $("#settings_LocalInputName").val(localName);
    localLat = getCookie("localLat");
    $("#settings_LocalInputLat").val(localLat);
    localLon = getCookie("localLon");
    $("#settings_LocalInputLon").val(localLon);

    bound = getCookie("bound");
    if (bound == "true") bound = true;
    if (bound == "false") bound = false;
    if (bound) {
        $("#zdsf").prop("checked", true);
    } else if (!bound) {
        $("#zdsf").prop("checked", false);
    }
    if (bound == null || bound == "null") {
        $("#zdsf").prop("checked", true);
        bound = "true";
        setCookie("bound", bound);
    }

    bbzd = getCookie("bbzd");
    if (bbzd == "true") bbzd = true;
    if (bbzd == "false") bbzd = false;
    if (bbzd) {
        $("#bbzd").prop("checked", true);
        $("#bbzdMap").removeAttr("disabled");
    } else if (!bbzd) {
        $("#bbzd").prop("checked", false);
        $("#bbzdMap").attr("disabled", "disabled");
        $("#currentTime").css("bottom", "8px");
    }

    if (bbzd == null || bbzd == "null") {
        $("#bbzdMap").removeAttr("disabled");
        $("#bbzd").prop("checked", true);
        bbzd = "true";
        setCookie("bbzd", bbzd);
    }

    bbzdMap = getCookie("bbzdMap");
    if (bbzdMap == "shindo") {
        $("#bbzdMap").val("震度");
    } else if (bbzdMap == "PGA") {
        $("#bbzdMap").val("PGA");
    }
    if (bbzdMap == undefined || bbzdMap == null || bbzdMap == "null" || bbzdMap == "") {
        $("#bbzdMap").val("PGA");
        bbzdMap = "PGA";
        setCookie("bbzdMap", "PGA");
    }
}
initProgram();

//init mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoieW93b3QiLCJhIjoiY2tkNG10ZnpmMTNuYTJwcGJja2w2aTVuYSJ9.9QRtVncQVTbedZZBz3pUeA';
const map = new mapboxgl.Map({
    container: 'map',
    // container ID
    style: 'mapbox://styles/yowot/cl583m0az002714pthclz95pf',
    // style URL
    center: [107.79942839007867, 37.093496518166944],
    //[lng, lat]
    zoom: 1.0677152302054749,
    //zoom
    projection: 'mercator',
});
let nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right')
// disable map rotation using right click + drag
map.dragRotate.disable();
// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();
//init mapbox finish

//var
var bbzdMap;
var bound;
var cencType;
var cencLat;
var cencLon;
var cencDepth;
var cencEpicenter;
var cencStartAt;
var cencMagnitude;
var cencMaxInt;
var cencMd5;
var cencMd51;
var cencMd52;
var iclEventId;
var iclUpdates;
var iclLat;
var iclLon;
var iclDepth;
var iclEpicenter;
var iclStartAt;
var iclMagnitude;
var iclMaxInt;
var iclMaxInt2;
var iclOriTime;
var iclMd5;
var iclMd51;
var iclMd52;
var iclType;
var cencSta = false;
var iclSta = false;
var delta = 0;
var currentTime;

function getServerDate() {
    $.getJSON("https://api.wolfx.jp/ntp.json", function(json) {
        var date_str = json.CST.str;
        var date_date = new Date(date_str);
        var timestamps = Date.parse(date_date);
        delta = Date.now() - timestamps;
})}
getServerDate();

function getCurrentTime() {
    currentTime = Date.now() - delta - 1000;
}
setInterval(getCurrentTime, 1000);

function cencDataGet() {
    $.getJSON("https://api.projectbs.cn/v2/ceic/get_data.json?" + currentTime,
    function(json) {
        cencType = json.data.type;
        cencLat = json.data.epicenterLat;
        cencLon = json.data.epicenterLon;
        cencDepth = json.data.depth;
        cencEpicenter = json.data.epicenter;
        cencStartAt = json.data.occurTime;
        cencMagnitude = json.data.magnitude;
        cencMaxInt = json.data.maxInt;
        cencMd5 = json.data.md5;
    })
}

function iclDataGet() {
    if (apiVertion == "test") var url = "https://app.projectbs.cn/ceiv/test.json?";
    if (apiVertion == "formal") var url = "https://api.projectbs.cn/icl/get_data.json?";
    $.getJSON(url + currentTime, function(json) {
        iclType = json.ICL.type;
        iclEventId = json.ICL.eventId;
        iclUpdates = json.ICL.updates;
        iclLat = json.ICL.latitude;
        iclLon = json.ICL.longitude;
        iclDepth = json.ICL.depth;
        iclDepth = Math.round(iclDepth);
        iclEpicenter = json.ICL.epicenter;
        iclStartAt = json.ICL.startAt;
        iclMagnitude = json.ICL.magnitude;
        iclMaxInt = json.ICL.maxInt;
        iclMaxInt2 = Math.round(iclMaxInt);
        iclOriTime = json.ICL.oritime;
        iclMd5 = json.ICL.md5;
        //console.log(iclOriTime);
    })
}

setInterval(cencDataGet, 2000);
//setInterval(iclDataGet, 2000); // Disable icl

//随机数
function randomFrom(lowerValue, upperValue) {
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

function cencCheck() {
    cencMd51 = cencMd5;
    if (cencMd51 !== cencMd52) {
        cencMd52 = cencMd5;
        cencRun();
    }
}
setInterval(cencCheck, 500)

function cencRun() {
    $(".marker").remove();
    var randomzoom = randomFrom(4.0, 5.0);
    map.flyTo({
        center: [cencLon, cencLat],
        essential: true,
        speed: 0.8,
        zoom: randomzoom,
        curve: 1
    });
    const cencEl = document.createElement('div');
    cencEl.className = 'marker';
    cencPopup = new mapboxgl.Popup({
        offset: 25
    }).setHTML("<b>地震速报（" + cencType + "报）<br/>时间：" + cencStartAt + "<br/>震中：" + cencEpicenter + "<br/>规模：" + cencMagnitude + "<br/>深度：" + cencDepth + "千米<br/>最大烈度（粗估）：" + cencMaxInt + "</b>");
    new mapboxgl.Marker(cencEl).setLngLat([cencLon, cencLat]).setPopup(cencPopup).addTo(map);
}

function iclCheck() {
    iclMd51 = iclMd5;
    if (iclMd51 !== iclMd52) {
        iclMd52 = iclMd5;
        if (parseInt(currentTime) - parseInt(iclOriTime) <= 300000) {
            iclRun();
        }
    }
}
//setInterval(iclCheck, 1000); // Disable icl

function iclRun() {
    //console.log("eew,map");
    $(".marker").remove();
    iclSta = true;
    iclWaveDraw();
    countDown();
    const iclEl = document.createElement('div');
    iclEl.className = 'marker';
    iclPopup = new mapboxgl.Popup({
        offset: 25
    }).setHTML("<b>地震预警（第" + iclUpdates + "报）<br/>时间：" + iclStartAt + "<br/>震中：" + iclEpicenter + "<br/>规模：" + iclMagnitude + "<br/>深度：" + iclDepth + "千米<br/>最大烈度（粗估）：" + iclMaxInt + "</b>");
    new mapboxgl.Marker(iclEl).setLngLat([iclLon, iclLat]).setPopup(iclPopup).addTo(map);
    map.flyTo({
        center: [iclLon, iclLat],
        essential: true,
        speed: 0.8,
        curve: 1
    });
new Notification(iclType,{body:iclEpicenter+"正发生"+iclMagnitude+"级地震，"+localName+"预估烈度"+localInt+"，"+feel+"。"});
}

var sClosed;
var pClosed;
function iclWaveExpand() {
    timeMinus = parseInt(currentTime) - parseInt(iclOriTime);
    if (iclSta == true) {
        sWave.setRadius(timeMinus / 1000 * 4000);
        pWave.setRadius(timeMinus / 1000 * 6000);
    } else {
        clearInterval(pandTimer);
        if (sClosed == true) {} else {
            sClosed = true;
            pClosed = true;
            sWave.remove();
            pWave.remove();
        }
    }
}

function iclWaveDraw() {
    if (sClosed == false) {
        sWave.remove();
    }
    if (pClosed == false) {
        pWave.remove();
    }
    sClosed = false;
    pClosed = false;
    sWave = new MapboxCircle([ + iclLon, +iclLat], 1, {
        editable: false,
        minRadius: 1,
        maxRadius: 9999999,
        strokeWeight: 1,
        strokeColor: "#FFA500",
        fillOpacity: 0.7,
        fillColor: '#242424'
    }).addTo(map);
    pWave = new MapboxCircle([ + iclLon, +iclLat], 1, {
        editable: false,
        minRadius: 1,
        maxRadius: 9999999,
        strokeWeight: 1,
        strokeColor: "#00FFFF",
        fillOpacity: 0,
        fillColor: '#00FFFF'
    }).addTo(map);
    fitWaveBounds();
    pandTimer = setInterval(iclWaveExpand, 1000);
}

function iclCancel() {
    if (!iclSta) return;
    if (currentTime - iclOriTime <= 300000) return;
    iclSta = false;
    if (!pClosed) pWave.remove();
    if (!sClosed) sWave.remove();
    $(".marker").remove();
    cencRun();
    clearInterval(cdi);
    cdi = undefined;
    clearInterval(cdi);
    cdi = undefined;
    clearInterval(cdi);
    cdi = undefined;
    clearInterval(cdi);
    cdi = undefined;
    clearInterval(cdi);
    cdi = undefined;
    clearInterval(cdi);
    cdi = undefined;
    $("#currentTime").css("color", "white");
    $("#countDown").css("width", "0px");
    $("#countDown").css("height", "0px");
}
//setInterval(iclCancel, 1000); // Disable icl

function fitWaveBounds() {
    if (!iclSta) return;
    if (bound) {
        //console.log("fitWaveBounds");
        pb = (pWave.getBounds());
        pbj = eval(pb);
        pwswlon = pb.sw.lng;
        pwswlat = pb.sw.lat;
        pwnelon = pb.ne.lng;
        pwnelat = pb.ne.lat;
        map.fitBounds([[pwswlon - 1, pwswlat - 1], // southwestern corner of the bounds
        [pwnelon + 1, pwnelat + 1] // northeastern corner of the bounds
        ]);
    }
}

//setInterval(fitWaveBounds, 5000); // Disable icl
function loadEewBar() {
    if (iclSta == false) {
        $("#eewBar").css("opacity", "0");
        document.getElementById("status").innerHTML = '<span style="position: relative; top: 3px;"><ion-icon name="information-circle"></ion-icon></span>暂无生效中的地震预警';
        $("#status").css("color", "black");
        $("#status").css("background-color", "white");
    }
    if (iclSta == true) {
        $("#eewBar").css("opacity", "1");
        if (iclType == "地震预警") {
            document.getElementById("status").innerHTML = '<span style="position: relative; top: 3px;"><ion-icon name="alert-circle"></ion-icon></span> 地震预警（第' + iclUpdates + "报）";
        }
        if (iclType == "地震预警（测试）") {
            document.getElementById("status").innerHTML = '<span style="position: relative; top: 3px;"><ion-icon name="alert-circle"></ion-icon></span> 地震预警（测试第' + iclUpdates + "报）";
        }
        $("#status").css("color", "white");
        $("#status").css("background-color", "red");
        document.getElementById("eewBar_shindo").innerHTML = iclMaxInt2;
        document.getElementById("eewBar_shindo").innerHTML = iclMaxInt2;
        document.getElementById("eewBar_epicenter").innerHTML = iclEpicenter;
        document.getElementById("eewBar_time").innerHTML = iclStartAt + " 发生";
        document.getElementById("eewBar_magnitude").innerHTML = "M" + iclMagnitude;
        document.getElementById("eewBar_depth").innerHTML = iclDepth + '<span style="font-size:15px;">km</span>';
        $("#eewBar_shindo").css("background-color", intColor[iclMaxInt2].bkcolor);
        $("#eewBar_shindo").css("color", "#fff");
        document.getElementById("eewBar_shindo").innerHTML = iclMaxInt2;
    }
}
//setInterval(loadEewBar, 1000); // Disable icl

//写cookies
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读取cookies 
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}

//删除cookies 
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function infoPopup(type, msg) {
    if (type == "warning") {
        $("#announcement").css("background-color", "#c40a04");
        $("#announcement").css("color", "#fff");
        msg = "警告：" + msg;
    }
    if (type == "info") {
        $("#announcement").css("background-color", "#fff");
        $("#announcement").css("color", "#000");
        msg = "提示：" + msg;
    }

    document.getElementById("announcement").innerHTML = msg;
    $("#announcement").animate({
        top: '10px'
    });

    setTimeout(function() {
        $("#announcement").animate({
            top: '-40px'
        });
    },
    5000)
}

function announcement() {
    $.getJSON("https://app.projectbs.cn/ceiv/announcement.json?" + currentTime,
    function(json) {
        announcementType = json.type;
        announcementMsg = json.msg;

    })
}

function cookiesCheck() {
    if (localName == null || localLat == null || localLon == null || localName == "" || localLat == "" || localLon == "" || localName == "请手动输入") {
        $(".localIcon").css("height", "0px");
        infoPopup("warning", "请到设置中填写您所在地地名及经纬度信息，以免CEIV运行出错。")
    }
}

setTimeout(function() {
    cookiesCheck();
},
5000);

function settings() {
    //display bkgd
    $("#settingsBackground").css("width", "100%");
    $("#settingsBackground").css("height", "100%");
    $("#settingsBackground").fadeTo("slow", 0.7);

    $("#settingsWindow").css("width", "300px");
    $("#settingsWindow").css("height", "calc(100% - 40px);");
    $("#settingsWindow").animate({
        right: '0px'
    });
    //
    bound = getCookie("bound");
    if (bound == "true") bound = true;
    if (bound == "false") bound = false;
    if (bound) $("#zdsf").prop("checked", true);
    if (!bound) $("#zdsf").prop("checked", false);
    if (bound == null || bound == "null") {
        $("#zdsf").prop("checked", true);
        bound = "true";
    }
    bbzd = getCookie("bbzd");
    if (bbzd == "true") bbzd = true;
    if (bbzd == "false") bbzd = false;
    if (bbzd) {
        $("#bbzd").prop("checked", true);
        $("#bbzdMap").removeAttr("disabled");
    }
    if (!bbzd) {
        $("#bbzd").prop("checked", false);
        $("#bbzdMap").attr("disabled", "disabled");
    }
    if (bbzd == null || bbzd == "null") {
        $("#bbzdMap").removeAttr("disabled");
        $("#bbzd").prop("checked", true);
        bbzd = "true";
    }
    localName = getCookie("localName");
    $("#settings_LocalInputName").val(localName);
    localLat = getCookie("localLat");
    $("#settings_LocalInputLat").val(localLat);
    localLon = getCookie("localLon");
    $("#settings_LocalInputLon").val(localLon);
    bbzdMap = getCookie("bbzdMap");
    if (bbzdMap == "shindo") $("#bbzdMap").val("震度");
    if (bbzdMap == "PGA") $("#bbzdMap").val("PGA");
    if (bbzdMap == undefined || bbzdMap == null || bbzdMap == "null" || bbzdMap == "") {
        $("#bbzdMap").val("PGA");
        bbzdMap = "PGA";
    }
}

function settingsSaveClose() {
    bbzdMap = $("#bbzdMap option:selected").text();
    if (bbzdMap == "震度") setCookie("bbzdMap", "shindo");
    if (bbzdMap == "PGA") setCookie("bbzdMap", "PGA");
    bbzd = $('#bbzd').is(":checked");
    if (bbzd) setCookie("bbzd", "true");
    if (!bbzd) setCookie("bbzd", "false");
    bound = $('#zdsf').is(":checked");
    if (bound) setCookie("bound", "true");
    if (!bound) setCookie("bound", "false");
    localName = $("#settings_LocalInputName").val();
    localLat = $("#settings_LocalInputLat").val();
    localLon = $("#settings_LocalInputLon").val();
    setCookie("localName", localName);
    setCookie("localLat", localLat);
    setCookie("localLon", localLon);
    $("#settingsBackground").fadeTo("slow", 0.0);
    setTimeout(function() {
        $("#settingsBackground").css("width", "0%");
        $("#settingsBackground").css("height", "0%");
    },
    1000)

    $("#settingsWindow").animate({
        right: '-300px'
    });
    setTimeout(function() {
        location.reload();
    },
    500)
}

function settingsCancel() {
    $("#settings_LocalInputName").val(localName);
    $("#settings_LocalInputLat").val(localLat);
    $("#settings_LocalInputLon").val(localLon);
    $("#settingsBackground").fadeTo("slow", 0.0);
    setTimeout(function() {
        $("#settingsBackground").css("width", "0%");
        $("#settingsBackground").css("height", "0%");
    },
    1000);
    $("#settingsWindow").animate({
        right: '-300px'
    });
}

function Rad(d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}

//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    //s=s.toFixed(4);
    return s;
}

var countdownId = "";
var localInt;
var feel;
function countDown() {
    distance = getDistance(iclLat, iclLon, localLat, localLon);
    timeMinus = parseInt(currentTime) - parseInt(iclOriTime);
    timeMinusSec = timeMinus / 1000;

    if (timeMinus <= 300000) {
        cdi = setInterval(countdownRun, 1000);

        cd = parseInt(distance / 4 - timeMinusSec);
        if (cd < 0) {
            cd = "0";
        }
        document.getElementById("countDown_Number").innerHTML = cd;
        localInt = 0.92 + 1.63 * iclMagnitude - 3.49 * Math.log10(distance)
        //console.log (localInt);
        if (localInt < 0) {
            localInt = "0.0"
        } else if (localInt >= 0 && localInt < 12) {
            localInt = localInt.toFixed(1);
        } else if (localInt >= 12) {
            localInt = "12.0"
        }
        if (localInt >= iclMaxInt) localInt = iclMaxInt;
        document.getElementById("countDown_LocalName").innerHTML = '<span style="position: relative; top: 3px;"><ion-icon name="navigate-circle-outline"></ion-icon></span>' + localName + "&nbsp;预估烈度" + localInt + "度";
        $("#countDown").css("width", "350px");
        $("#countDown").css("height", "300px");
        if (localInt < 1.0){
            feel = "无震感";
            $("#countDown").css("background-color","#00b9b9");
            $("#countDown").css("color","#fff");
            $("#countDown_Border").css("border","2px solid #fff");
        }else if (localInt >= 1.0 && localInt < 2.0){
            feel = "震感微弱";
            $("#countDown").css("background-color","#003efa");
            $("#countDown").css("color","#fff");
            $("#countDown_Border").css("border","2px solid #fff");
        }else if (localInt >= 2.0 && localInt < 3.0){
            feel = "高楼层有震感";
            $("#countDown").css("background-color","#ffc02c");
            $("#countDown").css("color","#fff");
            $("#countDown_Border").css("border","2px solid #fff");
        }else if (localInt >= 3.0 && localInt < 4.0){
            feel = "震感较强";
            $("#countDown").css("background-color","#ff771a");
            $("#countDown").css("color","#fff");
            $("#countDown_Border").css("border","2px solid #fff");
        }else if (localInt >= 4.0 && localInt < 5.0){
            feel = "震感强烈";
            $("#countDown").css("background-color","#ff420f");
            $("#countDown").css("color","#fff");
            $("#countDown_Border").css("border","2px solid #fff");
        }else if (localInt >= 5.0){
            feel = "震感极强";
            $("#countDown").css("background-color","#ff420f");//11
            $("#countDown").css("color","#fff");
            $("#countDown_Border").css("border","2px solid #fff");
        }
    }
}

function countdownRun() {
    //console.log("countdownRun() 运行中");
    distance = getDistance(iclLat, iclLon, localLat, localLon);
    timeMinus = parseInt(currentTime) - parseInt(iclOriTime);
    timeMinusSec = timeMinus / 1000;
    cd = parseInt(distance / 4 - timeMinusSec);
    if (cd <= 0) {
        cd = "0";
        document.getElementById("countDown_Text").innerHTML = feel+"<br>"+"地震横波已抵达";
    }else{
        document.getElementById("countDown_Text").innerHTML = feel+"<br>"+"地震横波将抵达";
    }
    if (cd >= 999) cd = 999;
    document.getElementById("countDown_Number").innerHTML = cd;
}

var IPName = "",
IPLat = "",
IPLon = "";
function geoIP() {
    $.getJSON("https://api.wolfx.jp/geoip.php?" + currentTime,
    function(json) {
        if (json.province_name_zh == json.city_zh) IPName = json.province_name_zh;
        if (json.province_name_zh !== json.city_zh) IPName = json.province_name_zh + json.city_zh;
        if (json.province_name_zh == null) {
            IPName = "请手动输入";
            infoPopup("warning", "所在地地名获取失败，请手动输入。")
        }
        IPLat = json.latitude;
        IPLon = json.longitude;
        $("#settings_LocalInputName").val(IPName);
        $("#settings_LocalInputLat").val(IPLat);
        $("#settings_LocalInputLon").val(IPLon);
        // localName = $("#settings_LocalInputName").val();
        // localLat = $("#settings_LocalInputLat").val();
        // localLon = $("#settings_LocalInputLon").val();
        // setCookie("localName", localName);
        // setCookie("localLat", localLat);
        // setCookie("localLon", localLon);
    })
}

function bbzdDisplay() {
    if (!bbzd) {
        $("#bbshindo").css("height", "0px");
        $("#bbshindo").css("width", "0px");
        setInterval(function() {
            $(".bbshindoMapPoint").css("height", "0px");
            $(".bbshindoMapPoint").css("width", "0px");
        },
        1000)
    } else {
        $("#bbshindo").css("height", "152px");
        $("#bbshindo").css("width", "302px");
        setInterval(function() {
            $(".bbshindoMapPoint").css("height", "10px");
            $(".bbshindoMapPoint").css("width", "10px");
        },
        1000)
    }
}
bbzdDisplay();

const bbGeoJson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [106.3944963, 29.81081081]
        }
    }]
};

// add markers to map
for (const feature of bbGeoJson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'bbshindoMapPoint';
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
};

var local = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [localLon, localLat]
        }
    }]
};

const localEl = document.createElement('div');
localEl.className = 'localIcon';
new mapboxgl.Marker(localEl).setLngLat([localLon, localLat]).addTo(map);

function calclocalshindocolor(shindo, level) {
    var localshindo = shindo;
    if (localshindo >= (-3.0) && localshindo < (-2.0)) {
        var a = d3.rgb(0, 0, 205);
        var b = d3.rgb(0, 64, 245);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (-2.0) && localshindo < (-1.0)) {
        var a = d3.rgb(0, 72, 250);
        var b = d3.rgb(0, 194, 150);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (-1.0) && localshindo < (0.0)) {
        var a = d3.rgb(0, 208, 139);
        var b = d3.rgb(56, 245, 62);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (0.0) && localshindo < (1.0)) {
        var a = d3.rgb(63, 250, 54);
        var b = d3.rgb(176, 254, 16);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (1.0) && localshindo < (2.0)) {
        var a = d3.rgb(189, 255, 12);
        var b = d3.rgb(248, 255, 1);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (2.0) && localshindo < (3.0)) {
        var a = d3.rgb(255, 255, 0);
        var b = d3.rgb(255, 224, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (3.0) && localshindo < (4.0)) {
        var a = d3.rgb(255, 221, 0);
        var b = d3.rgb(255, 151, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (4.0) && localshindo < (5.0)) {
        var a = d3.rgb(255, 144, 0);
        var b = d3.rgb(255, 75, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (5.0) && localshindo < (6.0)) {
        var a = d3.rgb(255, 68, 0);
        var b = d3.rgb(246, 6, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (6.0) && localshindo < (7.0)) {
        var a = d3.rgb(245, 0, 0);
        var b = d3.rgb(177, 0, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (localshindo >= (7.0)) {
        var a = d3.rgb(170, 0, 0);
        var b = d3.rgb(170, 0, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    }
}

function calclocalpgacolor(pga) {
    if (pga <= (0.01)) {
        return "rgb(0, 6, 209)";
    } else if (pga == (0.02)) {
        return "rgb(0, 33, 186)";
    } else if (pga > (0.02) && pga <= (0.05)) {
        let level = (pga * 10 - 0.2) * 0.333333;
        var a = d3.rgb(0, 45, 223);
        var b = d3.rgb(0, 108, 202);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (0.05) && pga <= (0.1)) {
        let level = (pga - 0.05) * 20;
        var a = d3.rgb(0, 125, 204);
        var b = d3.rgb(0, 205, 148);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (0.1) && pga <= (0.2)) {
        let level = (pga - 0.1) * 10;
        var a = d3.rgb(2, 214, 136);
        var b = d3.rgb(26, 228, 82);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (0.2) && pga <= (0.5)) {
        let level = (pga - 0.2) * 3.333;
        var a = d3.rgb(39, 246, 75);
        var b = d3.rgb(92, 246, 28);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (0.5) && pga <= (1)) {
        let level = (pga - 0.5) * 2;
        var a = d3.rgb(111, 251, 24);
        var b = d3.rgb(179, 250, 12);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (1) && pga <= (2)) {
        let level = (pga - 1);
        var a = d3.rgb(193, 248, 10);
        var b = d3.rgb(229, 232, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (2) && pga <= (10)) {
        let level = (pga - 2) * 0.333;
        var a = d3.rgb(255, 255, 0);
        var b = d3.rgb(255, 226, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (10) && pga <= (20)) {
        let level = (pga - 10) * 0.1;
        var a = d3.rgb(255, 217, 0);
        var b = d3.rgb(225, 180, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (20) && pga <= (50)) {
        let level = (pga - 20) * 0.0333;
        var a = d3.rgb(255, 167, 0);
        var b = d3.rgb(255, 121, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (50) && pga <= (100)) {
        let level = (pga - 50) * 0.02;
        var a = d3.rgb(255, 105, 0);
        var b = d3.rgb(255, 75, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (100) && pga <= (200)) {
        let level = (pga - 100) * 0.01;
        var a = d3.rgb(255, 61, 0);
        var b = d3.rgb(255, 25, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (200) && pga <= (500)) {
        let level = (pga - 200) * 0.00333;
        var a = d3.rgb(250, 20, 0);
        var b = d3.rgb(220, 0, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (500) && pga <= (1000)) {
        let level = (pga - 500) * 0.002;
        var a = d3.rgb(210, 0, 0);
        var b = d3.rgb(160, 0, 0);
        var compute = d3.interpolate(a, b);
        return compute(level);
    } else if (pga > (1000)) {
        return "rgb(160, 0, 0)";
    }
}

function getTimeYmd(timeNum) {
    var nowdate = new Date(timeNum);
    var year = nowdate.getFullYear();
    var month = nowdate.getMonth() + 1;
    var day = Number(nowdate.getDate());
    var hours = nowdate.getHours();
    var mins = nowdate.getMinutes();
    var secs = nowdate.getSeconds();
    if (month < 10) {
        month = "0" + month;
    } else {
        month = String(month);
    }
    if (day < 10) {
        day = "0" + day;
    } else {
        day = String(day);
    }
    if (hours < 10) {
        hours = "0" + hours;
    } else {
        hours = String(hours);
    }
    if (mins < 10) {
        mins = "0" + mins;
    } else {
        mins = String(mins);
    }
    if (secs < 10) {
        secs = "0" + secs;
    } else {
        secs = String(secs);
    }
    var servertime = year + month + day + hours + mins + secs;
    return servertime;
}

function bbzdCbCheck() {
    bbzdCbStatus = $('#bbzd').is(":checked");
    if (bbzdCbStatus) $("#bbzdMap").removeAttr("disabled");
    if (!bbzdCbStatus) $("#bbzdMap").attr("disabled", "disabled");
}

//全屏
function fullScreen() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

//退出全屏
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }

}

var i = 1;
function fullScreenF() {
    if (i == 1) {
        fullScreen();
    } else if (i == 2) {
        exitFullScreen();
    }
}

function isFullScreen() {
    return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false;
}

function fullScreenCheck() {
    if (isFullScreen() == false) {
        i = 1;
        document.getElementById("fullScreenBu").innerHTML = "全屏显示";
    } else {
        i = 2;
        document.getElementById("fullScreenBu").innerHTML = "退出全屏";
    }
}

setInterval(fullScreenCheck, 1000);

function currentTimeDisplay() {
    $.getJSON("https://api.wolfx.jp/red68/" + getTimeYmd(currentTime) + ".json",
    function(json) {
        latestTimeDetail = json.create_at;
        document.getElementById("currentTime").innerHTML = latestTimeDetail;
        if (iclSta) {
            if (iclType == "地震预警（测试）") $("#currentTime").css("color", "#ffcc65");
            if (iclType == "地震预警") $("#currentTime").css("color", "white");
        }
        if (!iclSta) {
            $("#currentTime").css("color", "white");
        }
        bbPGA = json.max_pga;
        bbCalcshindo = (2 * Math.log10(bbPGA) + 0.94);
        if (bbzdMap == "shindo") $(".bbshindoMapPoint").css("background-color", calclocalshindocolor(bbCalcshindo, bbCalcshindo - parseInt(bbCalcshindo)));
        if (bbzdMap == "PGA") $(".bbshindoMapPoint").css("background-color", calclocalpgacolor(bbPGA));
    })
}
setInterval(currentTimeDisplay, 1000);

function backToEpicenter(){
    if (iclSta){
        //console.log("fitWaveBounds");
        pb = (pWave.getBounds());
        pbj = eval(pb);
        pwswlon = pb.sw.lng;
        pwswlat = pb.sw.lat;
        pwnelon = pb.ne.lng;
        pwnelat = pb.ne.lat;
        map.fitBounds([[pwswlon - 1, pwswlat - 1], // southwestern corner of the bounds
        [pwnelon + 1, pwnelat + 1] // northeastern corner of the bounds
        ]);
    }
    if (!iclSta){
        var randomzoom = randomFrom(4.0, 5.0);
    map.flyTo({
        center: [cencLon, cencLat],
        essential: true,
        speed: 0.8,
        zoom: randomzoom,
        curve: 1
    });
    }
}
