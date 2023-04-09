import { Component } from '@angular/core';

// svg source
// https://www.svgrepo.com/svg/408778/close-cross-remove-delete
// https://www.svgrepo.com/svg/509332/circle
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'tictactoe';
  matrixSize: number;

  constructor() {
    this.matrixSize = 3;
  }

  onSelected(selectedMatrixSize: string) {
    this.matrixSize = +selectedMatrixSize; // +: convert string to number
  }
}
