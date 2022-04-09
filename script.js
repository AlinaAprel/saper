const matrix = getMatrix(10, 10);

for (let i = 0; i < 10; i++) {
  setRandomMine(matrix);
}

update();

function update() {
  const gameElement = matrixToHtml(matrix);
  const appElement = document.querySelector('#app');
  
  appElement.innerHTML = '';
  appElement.append(gameElement);
  
  appElement
    .querySelectorAll('img')
    .forEach((imgElement) => {
      imgElement.addEventListener('mousedown', mousedownHandler);
      imgElement.addEventListener('mouseup', mouseupHandler);
      imgElement.addEventListener('mouseleave', mouseleaveHandler);
    });
}

function mousedownHandler(event) {
  const { cell, left, right } = getInfo(event);

  if (left) {
    cell.left = true;
  }

  if (right) {
    cell.right = true;
  }

  if (cell.left && cell.right) {
    bothHandler(cell);
  }

  update();
}

function mouseupHandler(event) {
  const { cell, left, right } = getInfo(event);
  const both = cell.right && cell.left && (left || right);
  const leftMouse = !both && cell.left && left;
  const rightMouse = !both && cell.right && right;

  if (both) {
    runOnMatrix(matrix, x => x.poten = false);
  }

  if (left) {
    cell.left = false;
  }

  if (right) {
    cell.right = false;
  }

  if (leftMouse) {
    leftHandler(cell);
  }

  if (rightMouse) {
    rightHandler(cell);
  }

  update();
}

function mouseleaveHandler(event) {
  const { cell } = getInfo(event);

  cell.left = false;
  cell.right = false;

  update();
}

function getInfo(event) {
  const element = event.target;
  const cellId = parseInt(element.getAttribute('data-cell-id'));

  return {
    left: event.which === 1,
    right: event.which === 3,
    cell: getCellById(matrix, cellId)
  }
}

function leftHandler(cell) {
  if (cell.show || cell.flag) {
    return;
  }

  cell.show = true;
  showSpread(matrix, cell.x, cell.y);
}

function rightHandler(cell) {
  if (!cell.show) {
    cell.flag = !cell.flag;
  }

}

function bothHandler(cell) {
  if (!cell.show || !cell.number) {
    return;
  }

  const cells = getAroundCells(matrix, cell.x, cell.y);
  const flags = cells.filter(x => x.flag).length;

  if (flags === cell.number) {
    cells
      .filter(x => !x.flag && !x.show)
      .forEach(cell => {
        cell.show = true;
        showSpread(matrix, cell.x, cell.y)
      });
  } 

  else {
    cells
      .filter(x => !x.flag && !x.show)
      .forEach(cell => cell.poten = true);
  }
}
