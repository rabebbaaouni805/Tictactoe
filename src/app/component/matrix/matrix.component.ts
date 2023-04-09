import { Component, Input, OnInit } from '@angular/core';
import { Cell } from '../../model/cell.model';
import { Coordinates } from '../../model/coordinates.model';
import { ArrayService } from '../../service/array.service';


@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {

  private _matrixSize!: number;

  public get matrixSize() {
    return this._matrixSize;
  }
  @Input()
  public set matrixSize(matrixSize: number) {
    this._matrixSize = matrixSize;
    this. startGame();
  }
  

  playMode: string;



  matrix: Cell[][];
  rowIndexArry: number[];
  nextSymbol: 'x' | 'o';
  noWinnerYet: boolean;

  constructor(private arrayService: ArrayService) {
    this.noWinnerYet = true;
    this.nextSymbol = 'x';
    this.matrix = [];
    this.rowIndexArry = [];
    this.playMode = 'multi';
  }

  ngOnInit(): void {
    // console.log('matrixSize');
    // console.log(this.matrixSize);

    this.startGame();
    // this.matrix = this.getEmptyMatrix(this.matrixSize);
    // console.log('this.matrix[1]');
    // console.log(this.matrix[1]);

    // console.log('\n\n');
    // console.log(this.matrix);
    // for (let i = 0; i < this.matrixSize; i++) {
    //   for (let j = 0; j < this.matrixSize; j++) {
    //     console.log(this.matrix[i][j].coordinates.row + ',' + this.matrix[i][j].coordinates.col);
    //   }
    // }
  }

  onSelectePlayMode(slectedPlayMode: string) {
    this.playMode = slectedPlayMode;
    this. startGame();
    console.log('play mode: ' + this.playMode);
  }


  getRowIndexArry(matrixSize: number): number[] {
    const rowIndexArry: number[] = [];
    for (let i = 0; i < matrixSize; i++) {
      rowIndexArry.push(i);
    }
    return rowIndexArry;
  }

  getEmptyMatrix(size: number): Cell[][] {
    const matrix: Cell[][] = [];
    for (let i = 0; i < size; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < size; j++) {
        row[j] = {
          coordinates: { row: i, col: j },
          symbol: undefined,
          isPartOfLineOfSameSymbol: false
        }
      }
      matrix[i] = row;
    }
    return matrix;
  }

  onCellClick(i: number, j: number) {
    console.log('\n\n\n');
    console.log('clicked cell: ' + i + ',' + j);
    if (this.noWinnerYet == true) {
      switch (this.playMode) {
        case 'multi':
          if ((this.matrix[i][j].symbol == undefined)) {
            this.matrix[i][j].symbol = this.nextSymbol;
            this.updateNextSymbol();
            this.doesClickedCellCompleteALineOfSameSymbol(i, j, this.matrixSize);
          }
          break;
        case 'single':
          if ((this.matrix[i][j].symbol == undefined)) {
            this.matrix[i][j].symbol = this.nextSymbol;
            this.updateNextSymbol();
            this.doesClickedCellCompleteALineOfSameSymbol(i, j, this.matrixSize);
  
            if (this.noWinnerYet) {
              let coordinatesOfCellsWithoutSymbol: Coordinates[] = [];
              for (let i = 0; i < this.matrixSize; i++) {
                for (let j = 0; j < this.matrixSize; j++) {
                  if (this.matrix[i][j].symbol == undefined) {
                    coordinatesOfCellsWithoutSymbol.push(this.matrix[i][j].coordinates);
                  }
                }
              }
              if (coordinatesOfCellsWithoutSymbol.length > 0) {
                coordinatesOfCellsWithoutSymbol = this.arrayService.shuffle(coordinatesOfCellsWithoutSymbol);
                const coordinatesOfRandomCell: Coordinates = coordinatesOfCellsWithoutSymbol[0];
                const x: number = coordinatesOfRandomCell.row;
                const y: number = coordinatesOfRandomCell.col;
                this.matrix[x][y].symbol = this.nextSymbol;
                this.updateNextSymbol();
                this.doesClickedCellCompleteALineOfSameSymbol(x, y, this.matrixSize);
              }
            }
          }
          break;
        default:
          console.error('unsupported play mode: ' + this.playMode);
      }
    }
  }

  startGame() {
    this.rowIndexArry = this.getRowIndexArry(this.matrixSize);
    this.matrix = this.getEmptyMatrix(this.matrixSize);
    this.resetNextSymbol();
    this.noWinnerYet = true;
  }

  updateNextSymbol() {
    if (this.nextSymbol == 'o') {
      this.nextSymbol = 'x';
    } else {
      this.nextSymbol = 'o';
    }
  }

  resetNextSymbol() {
    this.nextSymbol = 'x';
  }

  isPositionInsideOfMatrix(i: number, j: number, matrixSize: number): boolean {
    const validRowNbr: boolean = (i >= 0) && (i < matrixSize);
    const validColNbr: boolean = (j >= 0) && (j < matrixSize);
    console.log('coordinates to check: ' + i + ',' + j);
    if (validRowNbr) {
      console.log(i + ': valid row nbr');
    } else {
      console.log(i + ': invalid row nbr');
    }
    if (validColNbr) {
      console.log(j + ': valid col nbr');
    } else {
      console.log(j + ': invalid col nbr');
    }
    return validRowNbr && validColNbr;
  }

  arePositionsInsideOfMatrix(cellsCoordinates: Coordinates[], matrixSize: number): boolean {
    let i: number = 0;
    while ((i < cellsCoordinates.length) && (this.isPositionInsideOfMatrix(cellsCoordinates[i].row, cellsCoordinates[i].col, matrixSize) == true)) {
      i++;
    }
    return (i == cellsCoordinates.length);
  }

  getCoordinatesToCheckInAllScenarios(i: number, j: number): Coordinates[][] {
    return [
      // horizontal line scenarios

      // get coordiantes to check if clicked cell is at the left of a horizontal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i, col: j + 1 },
        { row: i, col: j + 2 }
      ],
      // get coordiantes to check if clicked cell is at the center of a horizontal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i, col: j - 1 },
        { row: i, col: j + 1 }
      ],
      // get coordiantes to check if clicked cell is at the right of a horizontal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i, col: j - 1 },
        { row: i, col: j - 2 }
      ],


      // vertical line scenarios

      // get coordiantes to check if clicked cell is at the top of a vertical line of cells with same symbol
      [
        { row: i, col: j },
        { row: i + 1, col: j },
        { row: i + 2, col: j }
      ],
      // get coordiantes to check if clicked cell is at the middle of a vertical line of cells with same symbol
      [
        { row: i, col: j },
        { row: i - 1, col: j },
        { row: i + 1, col: j }
      ],
      // get coordiantes to check if clicked cell is at the bottom of a vertical line of cells with same symbol
      [
        { row: i, col: j },
        { row: i - 1, col: j },
        { row: i - 2, col: j }
      ],


      // main diagonal line scenarios

      // get coordiantes to check if clicked cell is at the top-left of the main diagonal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i + 1, col: j + 1 },
        { row: i + 2, col: j + 2 }
      ],
      // get coordiantes to check if clicked cell is at the middle of the main diagonal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i - 1, col: j - 1 },
        { row: i + 1, col: j + 1 }
      ],
      // get coordiantes to check if clicked cell is at the bottom-right of the main diagonal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i - 1, col: j - 1 },
        { row: i - 2, col: j - 2 }
      ],


      // secondary diagonal line scenarios

      // get coordiantes to check if clicked cell is at the top-right of the secondary diagonal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i + 1, col: j - 1 },
        { row: i + 2, col: j - 2 }
      ],
      // get coordiantes to check if clicked cell is at the middle of the secondary diagonal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i - 1, col: j + 1 },
        { row: i + 1, col: j - 1 }
      ],
      // get coordiantes to check if clicked cell is at the bottom-left of the secondary diagonal line of cells with same symbol
      [
        { row: i, col: j },
        { row: i - 1, col: j + 1 },
        { row: i - 2, col: j + 2 }
      ]
    ];
  }


  doesClickedCellCompleteALineOfSameSymbol(i: number, j: number, matrixSize: number) {

    const coordinatesToCheckInAllScenarios: Coordinates[][] = this.getCoordinatesToCheckInAllScenarios(i, j);

    let k: number = 0;
    let weHaveAWinner: Boolean = false;
    let coordinatesOfCellsToCheck: Coordinates[];
    while ((weHaveAWinner == false) && (k < coordinatesToCheckInAllScenarios.length)) {

      coordinatesOfCellsToCheck = coordinatesToCheckInAllScenarios[k];
      k++;
      console.log('******** scenario = ' + k + '/' + coordinatesToCheckInAllScenarios.length + ' ********');

      if (!this.arePositionsInsideOfMatrix(coordinatesOfCellsToCheck, matrixSize)) {
        console.log('some coordinates are outside matrix');
        continue; // ignore current scenario and jump to next one (skip current iteration and jump to next one)
      }
      console.log('all coordinates are intside matrix');

      const coordinatesOfAlignedCellsWithSameSymbol: Coordinates[] = this.getCoordinatesOfAlignedCellsWithSameSymbol(i, j, coordinatesOfCellsToCheck);

      // check for winner
      if (coordinatesOfAlignedCellsWithSameSymbol.length == 3) {
        this.endGame(coordinatesOfAlignedCellsWithSameSymbol);
        console.log('_–_–_– WINNER –_–_–_');
        weHaveAWinner = true;
      } else {
        console.log('not winner');
      }
    }
  }

  getCoordinatesOfAlignedCellsWithSameSymbol(i: number, j: number, coordinatesOfCellsToCheck: Coordinates[]): Coordinates[] {
    if (this.matrix[i][j].symbol == undefined) return [];
    const sameSymbol: 'x' | 'o' | undefined = this.matrix[i][j].symbol;
    const coordinatesOfAlignedCellsWithSameSymbol: Coordinates[] = [];
    coordinatesOfCellsToCheck.forEach((coordinates: Coordinates) => {
      const x: number = coordinates.row;
      const y: number = coordinates.col;
      if (this.matrix[x][y].symbol == sameSymbol) {
        coordinatesOfAlignedCellsWithSameSymbol.push(coordinates);
        console.log('cell at ' + x + ',' + y + ' has same symbol');
      } else {
        console.log('cell at ' + x + ',' + y + ' doesn\'t have same symbol');
      }
    })
    return coordinatesOfAlignedCellsWithSameSymbol;
  }

  endGame(coordinatesOfAlignedCellsWithSameSymbol: Coordinates[]) {
    this.noWinnerYet = false;
    coordinatesOfAlignedCellsWithSameSymbol.forEach((coordinates: Coordinates) => {
      const x: number = coordinates.row;
      const y: number = coordinates.col;
      this.matrix[x][y].isPartOfLineOfSameSymbol = true;
    })
  }
}
