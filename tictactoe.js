const board = document.getElementsByTagName("table")[0];
const num_rows = 50;
const num_cells = 50;
let scroll = 0;

const mark = {
	"circle": document.getElementById("circle").content.firstElementChild,
	"cross": document.getElementById("cross").content.firstElementChild
}

let sign = "circle";

window.onload=function(){
	
	board.onclick=function(e){make_move(e)};
	for(let r=0; r <= num_rows; r++) {
		let row = board.insertRow(r);
		for(let c=0; c <= num_cells; c++) {
			row.insertCell(c);
		}
	}
}

function make_move(click) {
	let clickedCell = click.target;
	if (!clickedCell.dataset.sign) {
		let currentSign = sign
		if(sign=="circle") sign="cross"; else sign="circle";
		clickedCell.dataset.sign = currentSign
		clickedCell.appendChild(mark[currentSign].cloneNode(true))

		curRow=clickedCell.parentNode.rowIndex;
		curCol=clickedCell.cellIndex;
		
		let five = checkFive(curRow, curCol, currentSign)
		if(five.win) Win(currentSign, five.array);
	}

	supChannel.send({
        type: 'broadcast',
        event: 'move',
        payload: { org: 'supabase' },
      })
};

function checkFive(cRow, cCol, sign) {

	let checkFive = {
		"noInRow": 0,
		"fiveArray": [],
		set: (n) => {
			checkFive.noInRow +=1;
			checkFive.fiveArray.push(n)
		},
		clear: () => {
			checkFive.noInRow = 0;
			checkFive.fiveArray = []
		}
	}

	const hFirst = Math.max(0,cCol-4);
	const hLast = Math.min(num_cells, cCol+4);
	const vFirst = Math.max(0,cRow-4);
	const vLast = Math.min(num_rows, cRow+4);

// case 1: horizontal
	for(let n=hFirst; n<=hLast; n+=1) {
		if(board.rows[cRow].cells[n].dataset.sign==sign) checkFive.set([cRow,n])
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 2: vertical
	for(let n=vFirst; n<=vLast; n+=1) {
		if(board.rows[n].cells[cCol].dataset.sign==sign) checkFive.set([n,cCol]) 
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 3: diagonal left
	for(let n=hFirst, m=vFirst; n<=hLast && m<=vLast; n+=1, m+=1) {
		if(board.rows[m].cells[n].dataset.sign==sign) checkFive.set([m,n])
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 4: diagonal right
	for(let n=hLast, m=vFirst; n>=hFirst && m<=vLast; n-=1, m+=1) {
		if(board.rows[m].cells[n].dataset.sign==sign) checkFive.set([m,n])
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};	
	return {"win": false}
}

function Win(sign, array) {
	array.forEach(cell => {
		board.rows[cell[0]].cells[cell[1]].style.backgroundColor = "rgba(255,0,0,0.3)"
	})
	setTimeout(() => {
		alert(`${sign} wins!!!`);	
	}, 300); 
}

setTimeout(
	()=>{
		window.scrollTo(document.body.scrollWidth/2 - window.innerWidth/2, document.body.scrollHeight/2 - window.innerHeight/2)},
	5)