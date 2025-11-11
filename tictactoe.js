const BOARD = document.getElementById("board");
const BOARD_SIZE = 50;
const CELL_SIZE = 31;

// game state - moves and current sign
const state = {
	"circle": [],
	"cross": [],
	"last_move": null,
	"sign": "circle"
}

const templates = {
	"circle": document.getElementById("circle").content.firstElementChild,
	"cross": document.getElementById("cross").content.firstElementChild
}

drawBoard()
	
function drawBoard() {
	BOARD.style.setProperty("--cell-size", `${CELL_SIZE * (Math.pow(1.3, (window.devicePixelRatio-1)) || 1)}px`);
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

	let curRow=clickedCell.parentNode.rowIndex;
	let curCol=clickedCell.cellIndex;

	if (!findMove([...state.circle, ...state.cross], [curRow, curCol])) {
		make_move(curRow, curCol, state.sign, "local")	
	}
};

function make_move(curRow, curCol, currentSign, clickedCell, mode) {

	// draw the sign
	cell = BOARD.rows[curRow].cells[curCol]
	cell.appendChild(templates[currentSign].cloneNode(true))

	// update the state
	state[currentSign].push([curRow, curCol])
	state.sign = currentSign == "circle" ? "cross" : "circle";
	state.last_move = {row: curRow, column: curCol, sign: currentSign}

	// check if win
	let five = checkFive(curRow, curCol, currentSign)
	if(five.win) Win(currentSign, five.array);
	
	// if mode is local, broadcast the move
	if(mode == "local") {
		supChannel.send({
			type: 'broadcast',
			event: 'move',
			move: {row: curRow, col: curCol, sign: currentSign},
		})	
	}
}

function checkFive(cRow, cCol, sign) {

	let checkFive = {
		"fiveArray": [],
		set: (n) => checkFive.fiveArray.push(n),
		clear: () => checkFive.fiveArray = []
	}

	const hFirst = Math.max(0,cCol-4);
	const hLast = Math.min(BOARD_SIZE, cCol+4);
	const vFirst = Math.max(0,cRow-4);
	const vLast = Math.min(BOARD_SIZE, cRow+4);

// case 1: horizontal
	for(let n=hFirst; n<=hLast; n+=1) {
		if(findMove(state[sign],[cRow, n]))	checkFive.set([cRow,n])
		else checkFive.clear()
		if (checkFive.fiveArray.length==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 2: vertical
	for(let n=vFirst; n<=vLast; n+=1) {
		if(findMove(state[sign], [n, cCol]))	checkFive.set([n, cCol])			
		else checkFive.clear()
		if (checkFive.fiveArray.length==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 3: diagonal left
	for(let n=hFirst, m=vFirst; n<=hLast && m<=vLast; n+=1, m+=1) {
		if(findMove(state[sign], [m, n])) checkFive.set([m,n])				
		else checkFive.clear()
		if (checkFive.fiveArray.length==5) return {"win": true, "array": checkFive.fiveArray};
	};
// case 4: diagonal right
	for(let n=hLast, m=vFirst; n>=hFirst && m<=vLast; n-=1, m+=1) {
		if(findMove(state[sign], [m, n])) checkFive.set([m,n])
		else checkFive.clear()
		if (checkFive.fiveArray.length==5) return {"win": true, "array": checkFive.fiveArray};
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
	make_move(payload.move.row, payload.move.col, payload.move.sign, "online")
})

// check if the current move [row, col] exists in list of allMoves
function findMove( allMoves, newMove ) {
	return allMoves.some( m => m[0] == newMove[0] && m[1] == newMove[1])
}
