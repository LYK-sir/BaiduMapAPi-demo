
var map = new BMap.Map("ct2"); //创建地图实例
var point1 = new BMap.Point(116.609564,40.083812);// 创建点坐标:首都机场

map.centerAndZoom(point1,10);     //初始化地图，设置中心点坐标和地图级别

map.enableScrollWheelZoom(true);  //鼠标滑动放大缩小

var top_left_scaleCtrl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});      // 创建比例尺对象,位置左下角
var bottom_right_viewCtrl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT});   // 创建缩放控件对象,位置右下角

/*移除控件:map.removeControl();   */
function add_control()  //添加组件函数
{
  map.addControl(top_left_scaleCtrl );
  map.addControl(bottom_right_viewCtrl);
}

add_control();   //调用函数



$("#city").change(function(){
  //获取城市完整信息
  var local = $("#city").val();
  //截取城市名称
  var city = local.substr(0,3);
  //截取区名
  var area = local.substr(3,3);
  //创建地址解析器实例
  var myGeo = new BMap.Geocoder();
  // 将地址解析结果显示在地图上，并调整地图视野
  myGeo.getPoint(area, function(point){
    if(point){
      map.centerAndZoom(point, 10);  //刷新地图中心,并设置级别
    }else{
      alert('您选择的地址没有解析到结果！');
    }
  },city);
});

//热力图数据
var heatPoint = [];

//LocalSearch本地检索的可选参数.options
var options={
  //标注气泡内容创建后的回调函数。 参数： poi: LocalResultPoi，通过其marker属性可得到当前的标注。
  onInfoHtmlSet:function(poi){
    //获取查询结果的相关信息
    name = poi.title;
    phone = poi.phoneNumber;
    address = poi.address;



    if(phone== null)
    {
      phone = "未收录";
    }

    //标注可以被清除
    poi.marker.enableMassClear();
    //对查询结果的标注进行监听"click"监听,点击就可以获取相关信息
    poi.marker.addEventListener("click",function (e){
      document.getElementById("firstname").value = name ;
      document.getElementById("phoneNumber").value =  phone;
      document.getElementById("address").value = address;
    });
  },
  //结果呈现设置. 列表形势,一页10个.
  renderOptions:{
    map: map,
    panel:"ctm",
  },
  //查询完成后的回调函数,results 是LocalResult类型,一次检索只能获取一页10个数据
  onSearchComplete:function(results){

    console.log(results);
    //返回结果数
    var number = results.getNumPois();
    heatPoint = [];    //清空热力图数据.
    var data = {};     //获取查询结果的经纬度数据
    var lngnum;        //经度
    var latnum;        //维度
    var num;           //权重

    for(var i=0; i<10; i++){
       //获取经度.results的相关数据的json格式,可以直接获取
       lngnum = results.getPoi(i).point.lng;
       //获取维度
       latnum =  results.getPoi(i).point.lat;
       //热力图的设置需要权重,随机生成数据
        num = Math.floor(Math.random()*100+1);
        //将经度,维度,权重,格式化为json格式
       data ={"lng":lngnum,"lat":latnum,"count":num};
       //收集当页结果的经纬度权重数据,
       heatPoint.push(data);
    }
  },
};


function searchPlan(){
  //清除地图上的所有覆盖物.
  map.clearOverlays();
  //创建本地检索对象.
  var local = new BMap.LocalSearch(map, options);
  //检索关键词,关键词的选取,可以参考百度地图api中的POI行业分类
  local.search("机场");
}

function searchSub(){
  map.clearOverlays();
  var local = new BMap.LocalSearch(map,options);
  local.search("火车站");
}

function searchFood(){
  map.clearOverlays();
  var local = new BMap.LocalSearch(map,options);
  local.search("星级酒店");
}

function searchBus(){
  map.clearOverlays();
  var local = new BMap.LocalSearch(map,options);
  local.search("园区");
}

//显示热力图
function openHeatmap(){
  //清除地图所有覆盖物
  map.clearOverlays();
  //判断浏览器是否支持canvas
  if(!isSupportCanvas()){alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')}
 //热力图初始化
  heatmapOverlay1 = new BMapLib.HeatmapOverlay({"radius":20});
 //地图添加热力图层
  map.addOverlay(heatmapOverlay1);
 //热力图层添加数据
  heatmapOverlay1.setDataSet({data:heatPoint,max:100});

//判断浏览区是否支持canvas
  function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
 //显示热力图
  heatmapOverlay1.show();
}

//关闭热力图
function closeHeatmap(){
  heatmapOverlay1.hide();
}








