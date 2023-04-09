import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrayService {

  constructor() { }
  
  
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  shuffle(array: any[]): any[] {
    let lastPosition = array.length;
    let randomPosition;
    while (lastPosition > 0) {
      randomPosition = Math.floor(Math.random() * lastPosition);
      this._swap(array, randomPosition, --lastPosition);
    }
    return array;
  }
  
  _swap(array: any[], i: number, j: number): any[] {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    return array;
  }
}
