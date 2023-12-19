export default class Sudoku {
    constructor(n, k) {
        this.n = n;
        this.k = k;
        this.srn = Math.sqrt(n);
        // this.mat = Array.from({length: n}, () => Array.from({length: n}, () => 0));
        this.mat = Array.from(Array(n), _ => Array(n).fill(0));
        this.ansMat = Array.from(Array(n), _ => Array(n).fill(0));
        this.oriMat = Array.from(Array(n), _ => Array(n).fill(true));
        this.sameArr = [[],[]];
    }
    
    fillValues(){
        this.fillDiagonal();
        this.fillRemaining(0, this.srn);
        this.copyMat();
        this.removeKDigits();
    }

    fillDiagonal(){
        for(let i = 0; i < this.n; i += this.srn){
            this.fillBox(i, i);
        }
    }

    fillBox(row, col) {
        let num = null;
        for(let i = 0; i < this.srn; i++){
            for(let j = 0; j < this.srn; j++){
                while(true) {
                    num = this.randomGenerator(this.n);
                    if (this.unUsedInBox(row, col, num)) {
                        break;
                    }
                }
                this.mat[row + i][col + j] = num;
            }
        }
    }

    randomGenerator(num) {
        return Math.floor(Math.random() * num + 1);
    }

    unUsedInBox(row, col, num) {
        for(let i = 0; i < this.srn; i++) {
            for (let j = 0; j < this.srn; j++) {
                if(this.mat[row + i][col + j] == num){
                    return false;
                }
            }
        }
        return true;
    }

    fillRemaining(i, j) {
        if (i == this.n - 1 && j == this.n) {
            return true;
        }

        if (j == this.n) {
            i++;
            j=0;
        }

        if (this.mat[i][j] != 0) {
            return this.fillRemaining(i, j + 1);
        }

        for(let num = 1; num <= this.n; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.mat[i][j] = num;
                if (this.fillRemaining(i, j + 1)) {
                    return true;
                }
                this.mat[i][j] = 0;
            }
        }
        return false;
    }

    checkIfSafe(i, j, num) {
        return (
            this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - (i % this.srn), j - (j % this.srn), num)
        );
    }

    unUsedInRow(i, num) {
        for (let j = 0; j < this.n; j++){
            if (this.mat[i][j] == num){
                return false
            }
        }
        return true;
    }

    unUsedInCol(j, num) {
        for (let i = 0; i < this.n; i++){
            if (this.mat[i][j] == num){
                return false;
            }
        }
        return true;
    }

    copyMat() {
        for(let i = 0; i < this.n; i++) {
            for(let j = 0; j < this.n; j++) {
                this.ansMat[i][j] = this.mat[i][j];
            }
        }
    }
    
    removeKDigits() {
        // this.ansMat = this.mat;
        let count = this.k;
        while(count != 0) {
            let i = Math.floor(Math.random() * this.n);
            let j = Math.floor(Math.random() * this.n);
            if (this.mat[i][j] !== 0){
                count--;
                this.mat[i][j] = 0;
                this.oriMat[i][j] = false;
            }
        }
        return;
    }
    
    checkSudoku(){
        for(let i = 0; i < this.n; i++) {
            for(let j = 0; j < this.n; j++) {
                if(this.ansMat[i][j] != this.mat[i][j]){
                    return false;
                }
            }
        }
        return true;
    }
    
    costumPush(i, j){
        this.sameArr[0].push(i);
        this.sameArr[1].push(j);
    }
    
    findTwin(num){
        this.sameArr = [[], []];
        for(let i = 0; i < this.n; i++) {
            for(let j = 0; j < this.n; j++) {
                if(num == this.mat[i][j]){
                    this.costumPush(i, j);
                }
            }
        }
    }

    help(){
        console.log("to generate puzzle this.fillvalues()");
        console.log("the generated puzzle this.mat");
        console.log("the generated ans puzzle this.ansMat");
        console.log("the filled position of original puzzle this.oriMat");
        console.log("to find positions of same number this.findTwin(num)");
        console.log("to same number are in this.sameArr")
        console.log("Check the puzzle this.checkSudoku()")
        console.log(this.ansMat)
    }
}
