let a = -1, b = -1;
let turn_tracker = 1; //turn_tracker==1 means it's A's turn, 2 means it's B's turn
let countofsix = 0;
let length = 15;

function inputsize() {
    let val = document.getElementById('inputsize').value;
    let num = parseInt(val);
    if (Number.isNaN(num) || num > 15 || num < 4) {
        alert("Please enter an integer within 4 to 15");
        return;
    }
    else {
        drawboard(num);
        length = num;
        document.getElementsByClassName('container')[0].style.display = 'flex';
        document.getElementById('ask-for-size').style.display = 'none';
    }
}

//returns a spiral array of dimension length*length
function spiralmaker(length) {
    let r = 0, c = 0, cursize = 0, maxsize = length * length;
    let num = 1;

    let a = new Array();
    for (let i = 0; i < length; i++) {
        a[i] = new Array();
    }
    let i = 0;
    while (cursize != maxsize) {
        for (i = c; i < length; i++) {
            a[r][i] = num;
            num++;
            cursize++;
            if (cursize >= maxsize)
                return a;
        }
        r++;
        for (i = r; i < length - 1; i++) {
            a[i][length - 1] = num;
            num++;
            cursize++;
            if (cursize >= maxsize)
                return a;
        }
        for (i = length - 1; i >= c; i--) {
            a[length - 1][i] = num;
            num++;
            cursize++;
            if (cursize >= maxsize)
                return a;
        }

        for (i = length - 2; i >= r; i--) {
            a[i][c] = num;
            num++;
            cursize++;
            if (cursize >= maxsize)
                return a;
        }
        c++;
        length--;
    }
    return a;
}

function drawboard(length) {
    let spiralarray = new Array();
    let temp = length;
    spiralarray = spiralmaker(length);
    for (let i = 1; i <= length; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.id = "r" + (i);
        document.getElementById('card-container').appendChild(row);
        for (let j = 1; j <= length; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = "c" + spiralarray[i - 1][j - 1];
            cell.classList.add("b" + spiralarray[length - i][length - j]);
            row.appendChild(cell);

        }
    }
    length = temp;
    document.getElementById('c' + 1).classList.add('A-start');
    document.getElementsByClassName('b' + 1)[0].classList.add('B-start');
    if (length % 2 == 1) {
        document.getElementById('c' + String(length * length)).classList.add('common-end');
    }
    else {
        document.getElementById('c' + String(length * length)).classList.add('A-end');
        document.getElementsByClassName("b" + String(length * length))[0].classList.add('B-end');
    }
}

function roll() {
    let x = Math.floor(Math.random() * 6) + 1;
    document.getElementById('itsa').style.display = 'block';
    move_token(x);
    document.getElementById('showturnvalue').innerText = String(x);
}

function move_token(turnvalue) {

    if (turnvalue == 6) {
        countofsix++;
    }
    else {
        if (countofsix) {
            while (countofsix != 0) {
                move_token_or_free_token(6);
                countofsix -= 1;
            }
        }
        if (a != -1 && turn_tracker == 1) {
            document.getElementById('c' + a).innerText = "";
            a = move_token_by_x(a, turnvalue);
        }
        else if (b != -1 && turn_tracker == 2) {
            (document.getElementsByClassName('b' + b))[0].innerText = "";
            b = move_token_by_x(b, turnvalue);
        }
        control_text_in_cards();
        if_anyone_won(a, b);
        change_turn();
    }
    if (countofsix == 3) {
        countofsix = 0;
        change_turn();
    }
}
function change_turn() {
    turn_tracker = 3 - turn_tracker;
    let turnname = document.getElementById('turn_name');
    if (turn_tracker == 1) turnname.innerHTML = "A";
    else if (turn_tracker == 2) turnname.innerHTML = "B";
}


function move_token_or_free_token(turnvalue) {
    if (a == -1 && turn_tracker == 1) {
        a = 1; //change here if you change the size of board
        document.getElementById('A-locker').style.display = 'none';
    }
    else if (b == -1 && turn_tracker == 2) {
        b = 1; //change here if you change the size of board
        document.getElementById('B-locker').style.display = 'none';
    }
    else if (turn_tracker == 1) {
        document.getElementById('c' + a).innerText = "";
        a = move_token_by_x(a, turnvalue);
    }
    else if (turn_tracker == 2) {
        document.getElementsByClassName('b' + b)[0].innerText = "";
        b = move_token_by_x(b, turnvalue);
    }
    control_text_in_cards();
    if_anyone_won(a, b);
}

function if_anyone_won(a, b) {
    if (a == length * length) {
        let largecard = document.getElementById('largecard');
        largecard.style.fontSize = "4rem";
        largecard.style.fontFamily = "fantasy";
        largecard.innerHTML = "A won!";
    }
    else if (b == length * length) {
        let largecard = document.getElementById('largecard');
        largecard.style.fontSize = "4rem";
        largecard.style.fontFamily = "fantasy";
        document.getElementById('largecard').innerHTML = "B won!";
    }
}


function move_token_by_x(a, turnvalue) {
    a = (a + turnvalue); //change here if you change the size of board
    if (a > length * length) a -= turnvalue;
    return a;
}

function control_text_in_cards() {
    if (turn_tracker == 1 && a != -1) {
        let currentcell = document.getElementById('c' + a);
        let text = currentcell.innerText;
        if (text == "") currentcell.innerText = "1A";
        else if (text[1] == 'A') {
            let num = Number(text[0]);
            num++;
            (currentcell.innerText)[0] = String(num);
        }
        else if (text[1] == 'B' || b!=1 || a!=length*length) {
            currentcell.innerText = "1A";
            b = -1;
            document.getElementById("comment").innerText = "B has been captured";
            document.getElementById('B-locker').style.display = 'block';
        }
    }
    else if (turn_tracker == 2 && b != -1) {
        let currentcell = (document.getElementsByClassName('b' + b))[0];
        let text = currentcell.innerText;
        if (text == "") currentcell.innerText = "1B";
        else if (text[1] == 'B') {
            let num = Number(text[0]);
            num++;
            (currentcell.innerText)[0] = String(num);
        }
        else if (text[1] == 'A' && a!=1 || b!=length*length) {
            currentcell.innerText = "1B";
            a = -1;
            document.getElementById("comment").innerText = "A has been captured";
            document.getElementById('A-locker').style.display = 'block';

        }
    }
}

//change here if you change the size of board
function overflow_checker(a, b) {
    if (a > length * length || b > length * length) return false;
    else return true;
}

function reset()
{
    a=-1;
    b=-1;
    for(let i=1;i<=length*length;i++)
    {
        document.getElementById("c"+i).innerText="";
    }
    document.getElementById('itsa').innerText="";
    document.getElementById('showturnvalue').innerText="";
    document.getElementById('comments').innerText="";
}