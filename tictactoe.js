var board;
var sign = "circle";
var num_rows = 25;
var num_cells = 25;

const mark = {
	"circle": document.getElementById("circle").content.firstElementChild,
	"cross": document.getElementById("cross").content.firstElementChild
}

window.onload=function(){
	
	board = document.getElementsByTagName("table")[0];
	var height = window.innerHeight-2;
	var width = window.innerWidth-2;
	//num_rows = Math.floor(height/window.devicePixelRatio/31);
	//num_cells = Math.floor(width/window.devicePixelRatio/31);
	num_rows = Math.floor(height/31);
	num_cells = Math.floor(width/31);	
	board.onclick=function(e){make_move(e)};

	for(var r=0; r <= num_rows; r++) {
		var row = board.insertRow(r);
		for(var c=0; c <= num_cells; c++) {
			row.insertCell(c);
		}
	};

}

function make_move(click) {
	click.stopPropagation(); 
	click.preventDefault();
	var clickedCell = click.target;
	if (!clickedCell.children.length) {
		
		clickedCell.appendChild(mark[sign].cloneNode(true))
		clickedCell.dataset.sign = sign
		c_row=clickedCell.parentNode.rowIndex;
		c_col=clickedCell.cellIndex;
		
		setTimeout(()=> {if(checkFive(c_col, c_row, clickedCell, sign)) Win(sign);}, 0)
		if(sign=="circle") sign="cross"; else sign="circle";
	}

	supChannel.send({
        type: 'broadcast',
        event: 'move',
        payload: { org: 'supabase' },
      })
};

function checkFive(cCol, cRow, clicked, sign) {

	let noInRow = 0;
	let maxInRow = 0;

	const hFirst = Math.max(0,cCol-4);
	const hLast = Math.min(num_cells, cCol+4);
	const vFirst = Math.max(0,cRow-4);
	const vLast = Math.min(num_rows, cRow+4);

// case 1: horizontal
	for(let n=hFirst; n<=hLast; n+=1) {
		if(board.rows[cRow].cells[n].dataset.sign==sign) noInRow+=1; else noInRow=0;
		if (noInRow==5) return true;
	};
// case 2: vertical
	for(let n=vFirst; n<=vLast; n+=1) {
		if(board.rows[n].cells[cCol].dataset.sign==sign) noInRow+=1; else noInRow=0;
		if (noInRow==5) return true;
	};
// case 3: diagonal left
	for(let n=hFirst, m=vFirst; n<=hLast && m<=vLast; n+=1, m+=1) {
		if(board.rows[m].cells[n].dataset.sign==sign) noInRow+=1; else noInRow=0;
		if (noInRow==5) return true;
	};
// case 4: diagonal right
	for(let n=hLast, m=vFirst; n>=hFirst && m<=vLast; n-=1, m+=1) {
		if(board.rows[m].cells[n].dataset.sign==sign) noInRow+=1; else noInRow=0;
		if (noInRow==5) return true;
	};	
	return false;
}

function Win(sign) {
	alert(sign+" wins!");
	var cells = board.getElementsByTagName("td");
	for(cell in cells) {
		if(cells.propertyIsEnumerable(cell)) cells[cell].dataset.sign="";
	}
}
