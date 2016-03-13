
var saveAsImage = function(html2canvas) {
  return {
  	scope: {
			targetElementId: '=saveAsImage',
			downloadName: '=downloadName'
		},
    link: function(scope, element, attributes) {
      element.on('click', function(){
      	if(scope.targetElementId){
	      	var targetElement = document.getElementById(scope.targetElementId);
	      	//convert html to canvas
	        html2canvas.render(targetElement, {}).then(function(canvas){
	        	//convert canvas to image data
						var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
						//create link element temporarily
						var link = document.createElement('a');
						var downloadName = scope.downloadName || "image.png";
						link.download = downloadName;
						link.href = image;
						//simulate clicking on the link to download image
						link.click();
					});
				}
      });
    }
  };
};

angular.module('myApp').directive("saveAsImage", saveAsImage);