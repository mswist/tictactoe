const BOARD = document.getElementById("board");
const BOARD_SIZE = 50;
const CELL_SIZE = 31;

const mark = {
	"circle": document.getElementById("circle").content.firstElementChild,
	"cross": document.getElementById("cross").content.firstElementChild
}

//object containing all moves
const moves = {
	"last": {},
	"all": []
}

//current sign
let sign = "circle";

drawBoard()
	
function drawBoard() {
	BOARD.style.setProperty("--cell-size", `${CELL_SIZE * (window.devicePixelRatio || 1)}px`);
	BOARD.onclick = (e) => { click_cell(e) };
	for(let r=0; r <= BOARD_SIZE; r++) {
		let row = BOARD.insertRow(r);
		for(let c=0; c <= BOARD_SIZE; c++) {
			row.insertCell(c);
		}
	}	
}

function click_cell(click) {
	let clickedCell = click.target.closest("td");
	
	if (!clickedCell.dataset.sign) {
		let currentSign = sign
		clickedCell.dataset.sign = currentSign
		let curRow=clickedCell.parentNode.rowIndex;
		let curCol=clickedCell.cellIndex;

		make_move(curRow, curCol, currentSign, clickedCell)	

	}
};

function make_move(curRow, curCol, currentSign, clickedCell) {
	cell = clickedCell || BOARD.rows[curRow].cells[curCol]
	cell.appendChild(mark[currentSign].cloneNode(true))
	if(sign=="circle") sign="cross"; else sign="circle";
		
	let five = checkFive(curRow, curCol, currentSign)
	if(five.win) Win(currentSign, five.array);

	//clickedCell is only passed if move is made locally - and only then should be broadcasted
	if(clickedCell) {
		supChannel.send({
			type: 'broadcast',
			event: 'move',
			payload: {row: curRow, col: curCol, sign: currentSign},
		})	
	}
}

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
	const hLast = Math.min(BOARD_SIZE, cCol+4);
	const vFirst = Math.max(0,cRow-4);
	const vLast = Math.min(BOARD_SIZE, cRow+4);

// case 1: horizontal
	for(let n=hFirst; n<=hLast; n+=1) {
		if(BOARD.rows[cRow].cells[n].dataset.sign==sign) checkFive.set([cRow,n])
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 2: vertical
	for(let n=vFirst; n<=vLast; n+=1) {
		if(BOARD.rows[n].cells[cCol].dataset.sign==sign) checkFive.set([n,cCol]) 
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 3: diagonal left
	for(let n=hFirst, m=vFirst; n<=hLast && m<=vLast; n+=1, m+=1) {
		if(BOARD.rows[m].cells[n].dataset.sign==sign) checkFive.set([m,n])
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 4: diagonal right
	for(let n=hLast, m=vFirst; n>=hFirst && m<=vLast; n-=1, m+=1) {
		if(BOARD.rows[m].cells[n].dataset.sign==sign) checkFive.set([m,n])
		else checkFive.clear()
		if (checkFive.noInRow==5) return {"win": true, "array": checkFive.fiveArray};
	};	
	return {"win": false}
}

function Win(sign, array) {
	array.forEach(cell => {
		BOARD.rows[cell[0]].cells[cell[1]].style.backgroundColor = "rgba(255,0,0,0.3)"
	})
	setTimeout(() => {
		alert(`${sign} wins!!!`);	
	}, 300); 
}

supChannel.on('broadcast', { event: 'move' }, (payload) => {
	console.log(payload)
	make_move(payload.curRow, payload.curCol, payload.currentSign)
})
