var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// document.querySelector("#submit").addEventListener("click", function(event) {
//   event.preventDefault();
// }, false);

//Step 1: Get the file from the input element                
document.querySelector("#pdf-file").onchange = function (event) {

  var file = event.target.files[0];

  //Step 2: Read the file using file reader
  var fileReader = new FileReader();

  fileReader.onload = function () {

    //Step 4:turn array buffer into typed array
    var typedarray = new Uint8Array(this.result);

    //Step 5:pdfjs should be able to read this
    const loadingTask = pdfjsLib.getDocument(typedarray);
    loadingTask.promise.then(pdf => {
      // The document is loaded here...
      console.log('PDF loaded...');

      // Outputs the PDF onto the Canvas
      pdf.getPage(1).then(function (page) {
        var viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        renderTask.promise.then(function () {
          pageRendering = false;
          // if (pageNumPending !== null) {
          //   renderPage(pageNumPending);
          //   pageNumPending = null;
          // }
        });
      });
    });
  };
  //Step 3:Read the file as ArrayBuffer
  fileReader.readAsArrayBuffer(file);

}

// style the context
ctx.strokeStyle = "red";
ctx.lineWidth = 3;

// calculate where the canvas is on the window
// (used to help calculate mouseX/mouseY)
var $canvas = $("#myCanvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

// this flage is true when the user is dragging the mouse
var isDown = false;

// these vars will hold the starting mouse position
var startX;
var startY;


function handleMouseDown(e) {
  e.preventDefault();
  e.stopPropagation();

  // save the starting x/y of the rectangle
  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);

  // set a flag indicating the drag has begun
  isDown = true;
}

function handleMouseUp(e) {
  e.preventDefault();
  e.stopPropagation();

  // the drag is over, clear the dragging flag
  isDown = false;

  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;

  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  var width = mouseX - startX;
  var height = mouseY - startY;

  ctx.strokeRect(startX, startY, width, height);
}

function handleMouseOut(e) {
  e.preventDefault();
  e.stopPropagation();

  // the drag is over, clear the dragging flag
  isDown = false;
}

function handleMouseMove(e) {
  e.preventDefault();
  e.stopPropagation();

  // if we're not dragging, just return
  if (!isDown) {
    return;
  }

  // // get the current mouse position
  // mouseX = parseInt(e.clientX - offsetX);
  // mouseY = parseInt(e.clientY - offsetY);

  // // Put your mousemove stuff here

  // // clear the canvas
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // // calculate the rectangle width/height based
  // // on starting vs current mouse position
  // var width = mouseX - startX;
  // var height = mouseY - startY;

  // // draw a new rect from the start position 
  // // to the current mouse position
  // ctx.strokeRect(startX, startY, width, height);

}

// listen for mouse events
$("#myCanvas").mousedown(function (e) {
  handleMouseDown(e);
});
$("#myCanvas").mousemove(function (e) {
  handleMouseMove(e);
});
$("#myCanvas").mouseup(function (e) {
  handleMouseUp(e);
});
$("#myCanvas").mouseout(function (e) {
  handleMouseOut(e);
});

document.querySelector("#download").addEventListener("click", function() {
  // only jpeg is supported by jsPDF
  var imgData = canvas.toDataURL("image/jpeg", 1.0);
  var pdf = new jspdf.jsPDF();

  pdf.addImage(imgData, 'JPEG', 0, 0);
  pdf.save("download.pdf");
}, false);