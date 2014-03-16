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
      b : _b
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

  Pixel.prototype.setStatus = function(comp) {
    this.status = {
      i : comp.num.i,
      j : comp.num.j
    };
  };

  Pixel.prototype.haveStatus = function() {
    if (this.status.i != -1 && this.status.j != -1){
      return true;
    }else{
      return false;
    }
  };

  Pixel.prototype.findNonWhiteSib = function(arr2d) {
    for(var i=this.pos.i-1; i<this.pos.j+2; i++){
      for(var j=this.pos.j-1; j<this.pos.j+2; j++){
        if (i == j){
          continue;
        }
        if (!arr[i][j].isWhite() && !arr[i][j].haveStatus()){
          this.arrSib.push(arr[i][j]);
        }
      }
    }
  };

  Pixel.prototype.isWhite = function() {
    if (this.r > 5 || this.g > 5 || this.b > 5 || this.a > 5){
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
    this.arr2d = []
  }

  СonComp.prototype.getArr2d = function(arr2d) {
    for(var i=this.bound.l; i<=this.bound.r; i++){
      this.arr2d[i] = [];
      for(var j=this.bound.h; j<=this.bound.d; j++){
        this.arr2d[i-this.bound.l].push = arr2d[i][j];
      }
    }
  };

  СonComp.prototype.checkBound = function(pixel) {
    if (pixel.i < this.bound.l){
      this.bound.l = pixel.i;
    }else if (pixel.i > this.bound.r){
      this.bound.r = pixel.i;
    }else if (pixel.j < this.bound.h){
      this.bound.h = pixel.j;
    }else if (pixel.j > this.bound.d){
      this.bound.d = pixel.j;
    }
  };
//////// </Class ConComp> ///////////

  var bfs = function(pixel, comp, arr2d){
    var queue = [];
    pixel.setStatus(comp);
    queue.push(pixel);
    while (queue.length != 0){
      var u = queue.shift();

    }
  };

  var findAllConComps = function(arr2d){
    var arr = [];
    for(var i=0; i<arr2d.length; i++){
      for(var j=0; j< arr2d[i].length; j++){
        var pixel = arr2d[i][j]
        if (pixel.isWhie && !pixel.haveStatus){
          var comp = new ConComp(i, j);
          bfs(pixel, comp, arr2d);
          arr.push(comp);
        }
      }
    }
    return arr;
  };


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
      
      if (i/4 % w == 0){
        j++;
        arr[j] = [];
      }
      var pixel = new Pixel(imgData[i], imgData[i+1], imgData[i+2], imgData[i+3], i, j);
      
      arr[j].push(pixel);
    }
    return arr;
  };

  var arr2dToImgData = function(arr2d){
    var arr = [];
    var k = 0;
    for(var i=0; i<arr2d.length; i++){
      for(var j=0; j< arr2d[i].length; j++){
        arr.push(arr2d[i][j].r+12);
        arr.push(arr2d[i][j].g);
        arr.push(arr2d[i][j].b);
        arr.push(arr2d[i][j].a-11);
      }
    }
    console.log(arr);

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
    
    //imgObj.data = arr2dToImgData(arr2d);
    
    
    //return data;
  };


});