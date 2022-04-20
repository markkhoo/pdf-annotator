//
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

document.querySelector("#submit").addEventListener("click", function(event) {
  event.preventDefault();
}, false);

//Step 1: Get the file from the input element                
document.querySelector("#pdf-file").onchange = function(event) {

  var file = event.target.files[0];

  //Step 2: Read the file using file reader
  var fileReader = new FileReader();  

  fileReader.onload = function() {

      //Step 4:turn array buffer into typed array
      var typedarray = new Uint8Array(this.result);

      //Step 5:pdfjs should be able to read this
      const loadingTask = pdfjsLib.getDocument(typedarray);
      loadingTask.promise.then(pdf => {
          // The document is loaded here...
          console.log('PDF loaded...');

          pdf.getPage(1).then(function(page) {
            var viewport = page.getViewport({scale: 1});
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            var renderTask = page.render(renderContext);

            renderTask.promise.then(function() {
              pageRendering = false;
              if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
              }
            });
          });
      });
  };
  //Step 3:Read the file as ArrayBuffer
  fileReader.readAsArrayBuffer(file);

}

// download.addEventListener("click", function() {
//   // only jpeg is supported by jsPDF
//   var imgData = canvas.toDataURL("image/jpeg", 1.0);
//   var pdf = new jsPDF();

//   pdf.addImage(imgData, 'JPEG', 0, 0);
//   pdf.save("download.pdf");
// }, false);