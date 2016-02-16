
angular.module('myApp').directive('ngFlowingColumns', [ '$timeout', function ($timeout) {
	return {
		restrict: 'E',
		scope: {
			columnWidth: '=columnWidth',
			columnMargin: '=columnMargin'
		},
		link: function(scope, element, attrs) {
			var config = {
				DEFAULT_WIDTH: 200,
				COLUMN_ATTRIBUTE_NAME: "ng-flowing-columns-column",
				CHILD_ATTRIBUTE_NAME: "ng-flowing-columns-child"
			};
			var columns = [];

			var addChild = function(child,childHeight){
				var shortestColumn = null;
				if(!child.hasAttribute(config.CHILD_ATTRIBUTE_NAME))
					child.setAttribute(config.CHILD_ATTRIBUTE_NAME,"");
				for(var j=0;j<columns.length;j++){
					if(shortestColumn==null || columns[j].height<shortestColumn.height){
						shortestColumn = columns[j];
					}
				}
				if(shortestColumn!=null){
					shortestColumn.element.appendChild(child);
					var height = childHeight;
					shortestColumn.height += height;
				}
			}

			var calculateNumColumns = function(){
				var elementBounds = element[0].getBoundingClientRect();
				var totalWidth = elementBounds.width;
				var columnWidth = parseFloat(scope.columnWidth);
				var columnMargins = parseFloat(scope.columnMargin);
				var totalColumnWidth = columnWidth + (2*columnMargins);
				var numColumns = Math.floor(totalWidth / totalColumnWidth);
				return(numColumns);
			}

			var arrangeElements = function(){
				if(!scope.columnWidth)
					scope.columnWidth = config.DEFAULT_WIDTH;		//default
				if(!scope.columnMargin)
					scope.columnMargin = 0;
				var columnStyle = {
					float: "left",
					width: scope.columnWidth,
					'margin-left': scope.columnMargin,
					'margin-right': scope.columnMargin
				};

				//set min width so we never go to 0 columns
				element[0].style.minWidth = (parseFloat(scope.columnWidth)+2*parseFloat(scope.columnMargin))+"px";

				var numColumns = calculateNumColumns();
				//find children who are not column elements created by us
				var childrenToSort = [];
				var children = element[0].childNodes;
				for(var i=0;i<children.length;i++){
					var child = children[i];
					if(child.hasAttribute && child.hasAttribute(config.COLUMN_ATTRIBUTE_NAME)){	//look one level deep
						var grandchildren = child.childNodes;
						for(var j=0;j<grandchildren.length;j++){
							var grandchild = grandchildren[j];
							if(child.nodeType!=3 && child.nodeType!=8){	//if it's not a comment or text element
								childrenToSort.push(grandchild);
							}
						}
					}
					else if(child.nodeType!=3 && child.nodeType!=8){	//if it's not a comment or text element
						childrenToSort.push(child);
					}
				}
				//calculate height so we only trigger one layout recalculation
				var childrenHeight = [];
				for(var i=0;i<childrenToSort.length;i++){
					childrenHeight.push(childrenToSort[i].getBoundingClientRect().height);
				}
				//clear all current children from element to 'reset', except comment or text children
				var childrenToRemove = [];
				for(var i=0;i<element[0].childNodes.length;i++){
					var child = element[0].childNodes[i];
					if(child.nodeType!=3 && child.nodeType!=8)
						childrenToRemove.push(child);
				}
				for(var i=0;i<childrenToRemove.length;i++){
					element[0].removeChild(childrenToRemove[i]);
				}
				//create columns and add them to element
				columns = [];
				for(var i=0;i<numColumns;i++){
					var column = document.createElement("div");
					var styleKeys = Object.keys(columnStyle);
					for(var key in styleKeys){
						column.style[styleKeys[key]] = columnStyle[styleKeys[key]];
					}
					column.setAttribute(config.COLUMN_ATTRIBUTE_NAME,"");
					var columnObj = {
						element: column,
						height: 0
					};
					columns.push(columnObj);
					element[0].appendChild(column);
				}
				//go through children and add them to columns
				for(var i=0;i<childrenToSort.length;i++){
					childrenToSort[i].style.visibility = "visible";
					addChild(childrenToSort[i],childrenHeight[i]);
				}
			}

			//on first load of the element
			element.ready(function(){
				console.log("ready");
				$timeout(arrangeElements,500);
			});
			//watch for style changes
			attrs.$observe("columnStyle",function(columnStyle){
				console.log("column style change");
				$timeout(arrangeElements);
			});
			//watch for element width changes at each angular digest (this is bad to do, but no other way to accurately detect width changes)
			scope.$watch(function(){
				return(element[0].getBoundingClientRect().width);
			},function(){
				$timeout(arrangeElements);
			},true);
			//watch for element size changes due to window resize
			window.onresize = function(event){
				var newNumColumns = calculateNumColumns();
				if(newNumColumns!=columns.length){
					$timeout(arrangeElements);
				}
			}
			//watch for changes in children
			var observer = new MutationObserver(function(mutations) {
				var doMutation = false;
				//make sure we're not doing an infinite loop of mutations
				for(var i=0;i<mutations.length;i++){
					var mutation = mutations[i];
					if(mutation.addedNodes){
						for(var j=0;j<mutation.addedNodes.length;j++){
							var addedNode = mutation.addedNodes[j];
							if(addedNode.hasAttribute && !addedNode.hasAttribute(config.CHILD_ATTRIBUTE_NAME) && !addedNode.hasAttribute(config.COLUMN_ATTRIBUTE_NAME) && addedNode.nodeType!=3 && addedNode.nodeType!=8){
								doMutation = true;
							}
						}
					}
				}
				if(doMutation){
					console.log("mutation");
					$timeout(arrangeElements);	//timeout so the mutation has time to take effect in the DOM
				}
			});
			observer.observe(element[0], {
				childList: true
			});
		}
	}
}]);
