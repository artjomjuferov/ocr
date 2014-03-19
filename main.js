$(document).ready(function(){

  $("#imgInput").change(function(){
    readURL(this);
  });

  $("#showMatrix").click(function(){
    getImgMatrix(window.image);
    $("#myCanvas").empty();
  });

  $(function() {
    $('#myCanvas').sketch();
  });

  $("#clearCanvas").click(function(){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

//////// <Class Pixel> ////////// 
  function Pixel (_r, _g, _b, _a, _i, _j) {
    this.color = {
      r : _r,
      g : _g,
      b : _b,
      a : _a
    };
    this.pos = {
      i : _i,
      j : _j
    };

    this.status = {
      i : -1,
      j : -1
    };
    this.arrSib = [];
  };

  Pixel.prototype.setStatus = function(sib) {
    this.status = {
      i : sib.status.i,
      j : sib.status.j
    };
  };


  Pixel.prototype.findRigthSib = function(arr2d) {
    for(var i = this.pos.i-1; i < this.pos.i+2; i++){
      for(var j = this.pos.j-1; j < this.pos.j+2; j++){
        if (this.pos.i === i && this.pos.j === j){
          continue;
        }
        if (arr2d[i] != undefined  && arr2d[i][j] != undefined && !arr2d[i][j]._isWhite() && !arr2d[i][j]._haveStatus()){
          arr2d[i][j].setStatus(this);
          this.arrSib.push(arr2d[i][j]);
        }
      }
    }
  };

  Pixel.prototype._haveStatus = function() {
    if (this.status.i != -1 && this.status.j != -1){
      return true;
    }else{
      return false;
    }
  };
  Pixel.prototype._isWhite = function() {
    if (this.color.r > 5 || this.color.g > 5 || this.color.b > 5 || this.color.a > 5){
      return false;
    }else {
      return true;
    }
  };  
//////// </Class Pixel> ///////////


//////// <Class СonComp> ////////// 
  function СonComp (_i, _j) {
    this.num = {
      i : _i,
      j : _j
    };
    this.bound = {
      l : 1000000,
      r : -1,
      h : -1,
      d : 1000000
    };
    this.arr2d = []
  }

  СonComp.prototype.getArr2d = function(arr2d) {
    for(var i = this.bound.l; i <= this.bound.r; i++){
      this.arr2d[i] = [];
      for(var j = this.bound.h; j <= this.bound.d; j++){
        this.arr2d[i-this.bound.l].push = arr2d[i][j];
      }
    }
  };

  СonComp.prototype.addToArr = function(pixel) {
    this.arr2d.push(pixel);
  };

  СonComp.prototype.checkBound = function(pixel) {
    if (pixel.i < this.bound.l){
      this.bound.l = pixel.i;
    }
    if (pixel.i > this.bound.r){
      this.bound.r = pixel.i;
    }
    if (pixel.j < this.bound.h){
      this.bound.h = pixel.j;
    }
    if (pixel.j > this.bound.d){
      this.bound.d = pixel.j;
    }
  };
//////// </Class ConComp> ///////////


  var readURL = function(input){
    if (input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function (e){
            window.image = createImage(e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
  };

  var createImage = function (src){
    var img = document.createElement('img');
    img.src = src;
    img.height = 300;
    img.width = 500;
    return img;
  };

  var dataImgToArr2d = function(w, imgData){
    var arr = [];
    var j = -1;
    for(var i=0; i<imgData.length; i+=4){
      if (i/4 % w === 0){
        j++;
        arr[j] = [];
      }
      var pixel = new Pixel(imgData[i], imgData[i+1], imgData[i+2], imgData[i+3],j, i/4 % w);
      arr[j].push(pixel);
    }
    return arr;
  };

  var arr2dToImgData = function(arr2d){
    var arr = [];
    var k = 0;
    for(var i=0; i<arr2d.length; i++){
      for(var j=0; j< arr2d[i].length; j++){
        arr.push(arr2d[i][j].r);
        arr.push(arr2d[i][j].g);
        arr.push(arr2d[i][j].b);
        arr.push(arr2d[i][j].a);
      }
    }
    return arr;
  };


  var bfs = function(pixel, comp, arr2d){
    var queue = [];
    queue.push(pixel);
    while (queue.length != 0){
      var u = queue.shift();
      u.setStatus(pixel);
      u.findRigthSib(arr2d);
      comp.checkBound(u);
      // console.log("-+x");
      // console.log(u);
      // console.log("-!-");
      for(var i=0; i<u.arrSib.length; i++){
        // console.log("!!");
        queue.push(u.arrSib[i]);
      }
    }
  };

  var findAllConComps = function(arr2d){
    var arr = [];
    for(var i=0; i<arr2d.length; i++){
      for(var j=0; j< arr2d[i].length; j++){
        var pixel = arr2d[i][j]
        if (!pixel._isWhite() && !pixel._haveStatus()){
          var comp = new СonComp(pixel.pos.i, pixel.pos.j);
          pixel.status.i = pixel.pos.i;
          pixel.status.j = pixel.pos.j;
          bfs(pixel, comp, arr2d);
          arr.push(comp);
        }
      }
    }
    return arr;
  };

  var getImgMatrix = function(image){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var h = canvas.height, w = canvas.width;
    if (image){
      h = image.height;
      w = image.width;
      canvas.width  = w;
      canvas.height = h;
      ctx.drawImage(image, 0, 0);
    }
    var imgObj = ctx.getImageData(0, 0, w, h);
    arr2d = dataImgToArr2d(w, imgObj.data);
    var comps = findAllConComps(arr2d);
    console.log(comps);
    //return data;
  };


});