let mainGame = {
    
    gameOn: undefined,

    rules : document.querySelector('.theRules'),

    //main control buttons stored in an obj
    controlButtons : {
        begin: document.querySelector('.beginButton'),
        rules: document.querySelector('.ruleButton'),
        close: document.querySelector('.closeButton')
    },

    //gameBoard goal Zones
    goals : {
        p1Goal:document.querySelector('.p1Goal'),
        p2Goal:document.querySelector('.p2Goal'),
    },

    turnIndicators : {
        p1 : document.querySelector('.turn-indicator .p1'),
        p2: document.querySelector('.turn-indicator .p2'),
    },

    // all gameBoardSlots 
    allSlots : document.querySelectorAll('.piece'),
    
    // gameBoard slots
    //player 1  
    p1Slots: document.querySelectorAll('.p1Slot'),
    p1GamePces:[],

    // gameBoard slots
    //player 2 
    p2Slots:document.querySelectorAll('.p2Slot'),
    p2GamePces:[],

    //setting a val for total num of game pieces, should not exceed (48)
    totalGamePce : 0,

    //after a slot is clicked, the selected spot will be assigned
    selectedSlot: undefined,

    //nextSpot
    nextSpot : undefined,

    //setting turn counter to 0, will either fluctuate between 0/1
    turnCount : 0,

    //end spot
    endSpot : undefined,
    
    //opposite spot
    oppositeSpot:undefined,

    //function to act as a cleanup function to gather the last bead 
    getlastPlayer:undefined,


    // empty arrays to assign flow of moves
    gameFlowArr: [],
    p1GameFlow: [],
    p2GameFlow: [],

    getOppositeSpot(){
        let arr = [];

        this.allSlots.forEach(s=>{
            arr.push(s);
        })
        switch(this.endSpot){
            case arr[0]:
                this.oppositeSpot=arr[6];
                break;
            case arr[1]:
                this.oppositeSpot=arr[7];
                break;
            case arr[2]:
                this.oppositeSpot=arr[8];
                break;
            case arr[3]:
                this.oppositeSpot=arr[9];
                break;
            case arr[4]:
                this.oppositeSpot=arr[10];
                break;
            case arr[5]:
                this.oppositeSpot=arr[11];
                break;
            case arr[6]:
                this.oppositeSpot=arr[0];
                break;
            case arr[7]:
                this.oppositeSpot=arr[1];
                break;
            case arr[8]:
                this.oppositeSpot=arr[2];
                break;
            case arr[9]:
                this.oppositeSpot=arr[3];
                break;
            case arr[10]:
                this.oppositeSpot=arr[4];
                break;
            case arr[11]:
                this.oppositeSpot=arr[5];
                break;
        }
        arr=[];
        

    },

    //iff last mancala piece is in own goal, you get to take a turn again
    goAgain(){
        let spotInd= this.gameFlowArr.indexOf(this.nextSpot);
        let newSpotInd = spotInd-1;

        if(this.nextSpot===this.gameFlowArr[0]){
            newSpotInd=13;
        }

        if(newSpotInd === 6 || newSpotInd === 13){
            this.initiateTurn(this.gameFlowArr[newSpotInd]);
        } 
    },

    setGameFlows(){
        this.gameFlowArr.unshift(this.goals.p1Goal);
        this.p1GameFlow.unshift(this.goals.p1Goal);

        
        this.p1Slots.forEach(slot=>{
            this.gameFlowArr.unshift(slot);
            this.p1GameFlow.unshift(slot);
            this.p2GameFlow.unshift(slot);

        });
        this.p2Slots.forEach(slot=>{
            this.gameFlowArr.push(slot);
            this.p1GameFlow.push(slot);
            this.p2GameFlow.push(slot);


        }) 
        this.gameFlowArr.push(this.goals.p2Goal);
        this.p2GameFlow.push(this.goals.p2Goal);

    },

    //method to select spot, will be used in conjunction with eventListener
    selectSpot(spot){
        // assigning selected spot based off of parameter
        this.selectedSlot = spot;
    },

    assignNextSpot(currentSpot,turn){
        if(turn === 1){
            let currentIndex = this.p1GameFlow.indexOf(currentSpot);
            if(currentIndex !== 12){
                this.nextSpot = this.p1GameFlow[currentIndex+1];
            } else {
                this.nextSpot = this.p1GameFlow[0];
            }
        } else {
            let currentIndex = this.p2GameFlow.indexOf(currentSpot);
            if(currentIndex !== 12){
                this.nextSpot = this.p2GameFlow[currentIndex+1];
            } else {
                this.nextSpot = this.p2GameFlow[0];
            }
        }

    },

    showEndLocation(spot,turn){
        if(turn===0){
            let numOfMoves = spot.childElementCount;
            if(numOfMoves>0){
                let currentInd = this.p1GameFlow.indexOf(spot);
                let endInd = currentInd + numOfMoves;
                if(endInd>12){
                    endInd = endInd-this.p1GameFlow.length;
                }
                this.endSpot=this.p1GameFlow[endInd];
                this.endSpot.style='box-shadow: inset 0 0 2rem lime';
                
            } else {
                return;
            }
        } else {
            let numOfMoves = spot.childElementCount;
            if(numOfMoves>0){
                let currentInd = this.p2GameFlow.indexOf(spot);
                let endInd = currentInd + numOfMoves;
                if(endInd>12){
                    endInd = endInd-this.p2GameFlow.length;
                }
                this.endSpot=this.p2GameFlow[endInd];
                this.endSpot.style='box-shadow: inset 0 0 2rem lime';
            } else {
                return;
            }

        }


    },

    showEndLocationClear(spot){
        let numOfMoves = spot.childElementCount;
        if(numOfMoves===0){
            return;
        } else {
            this.endSpot.style='box-shadow: inset 0 1rem 1rem';
        }

    },

    displayTurn(num){
        if(num===0){
            this.turnIndicators.p1.style = 'color:green';
            this.turnIndicators.p2.style = 'color:tan';

        } else {
            this.turnIndicators.p2.style = 'color:green';
            this.turnIndicators.p1.style = 'color:tan';

        }
    },

    //function that either displays/removes displayed rules takes 1 arguement
    displayRules(action){
        // switch statement that takes the function arguement for next action
        switch(action){
            // if open is the case, then the rules will be displayed, 
            case "open":
                this.rules.style = 'display: flex; height: 95%;';
                break;
            // if anything else they will not be displayed 
            default:
                this.rules.style = 'display: none; height: 0;';
        }
    },

    createGamePiece(element){
        let colorArr = ['red','lightgreen','lightblue','silver','white','orange','salmon']
        let gamePiece = document.createElement('div');
        gamePiece.classList.add('gamePiece');
        gamePiece.style.background = colorArr[Math.floor(Math.random()* colorArr.length)];
        element.appendChild(gamePiece);
        this.totalGamePce++;
    },

    startGame(){
        //using a while loop, (4) game pieces will be added to each play slot
        while(this.totalGamePce< 48){
            //will loop through p1slots to add gamePieces
            this.p1Slots.forEach(slot=>{
                this.createGamePiece(slot);
                this.createGamePiece(slot);
                this.createGamePiece(slot);
                this.createGamePiece(slot);
            })
            //will loop through p1slots to add gamePieces
            this.p2Slots.forEach(slot=>{
                this.createGamePiece(slot);
                this.createGamePiece(slot);
                this.createGamePiece(slot);
                this.createGamePiece(slot);
            })
        }
        //begin button will not be displayed after the above code is exceuted
        mainGame.controlButtons.begin.style = 'display: none';
    },

    movePiece(selectedSlot){
        this.gameFlowArr.forEach(slot=>{
            // inserted here to prevent bug that was leaving slot colored green on mouseout
            this.showEndLocationClear(slot);


            if (slot === this.goals.p1Goal|| slot ===this.goals.p2Goal){
                return;            
            } else {
                if(selectedSlot===slot){

                    let slotGamePcs = selectedSlot.children;
                    let numOfMoves = selectedSlot.childElementCount;
                    // let color = slotGamePcs[0].style.background;
                    while(numOfMoves>0){
                        slot.removeChild( slotGamePcs[0]); 
                        this.createGamePiece(this.nextSpot);
                        this.assignNextSpot(this.nextSpot,this.turnCount);
                        numOfMoves--;
                    }
                    //running a function which will choose if player gets another turn
                    this.goAgain();

                }
            }
        });        
        
    },

    //will either change the turncount up/back to zero dependant on moves
    initiateTurn(element){
        if(element.childElementCount === 0){
            return;
        } else {
            this.turnCount++;
            if(this.turnCount>1){
                this.turnCount = 0;
            }
        }
    },

    getP2Beads(spot,turn){
        if(turn===0){
            let numOfMoves = spot.childElementCount;
            if(numOfMoves>0){
                let currentInd = this.p1GameFlow.indexOf(spot);
                let endInd = currentInd + numOfMoves;
                if(endInd>12){
                    endInd = endInd-this.p1GameFlow.length;
                }
                this.endSpot=this.p1GameFlow[endInd];
                let endSpotCount = this.endSpot.childElementCount;
                //if statement to check if endspot is equal to p1 slots
                this.p1Slots.forEach(slot=>{
                    if(this.endSpot===slot && endSpotCount === 0 ){
                        let oppCount=this.oppositeSpot.childElementCount;
                        //shortcut to clear all inner nodes from parent 
                        this.oppositeSpot.innerHTML =''
                        while(oppCount>0){
                            this.createGamePiece(this.goals.p1Goal);
                            oppCount--;
                            console.log(endSpotCount);
                        }
                        this.getlastPlayer=true;
                        

                    }
                });
            } else {

                return;
            }
        } else {
            let numOfMoves = spot.childElementCount;
            if(numOfMoves>0){
                let currentInd = this.p2GameFlow.indexOf(spot);
                let endInd = currentInd + numOfMoves;
                if(endInd>12){
                    endInd = endInd-this.p2GameFlow.length;
                }
                this.endSpot=this.p2GameFlow[endInd];
                let endSpotCount = this.endSpot.childElementCount;
                //if statement to check if endspot is equal to p1 slots
                this.p2Slots.forEach(slot=>{
                    if(this.endSpot===slot && endSpotCount === 0 ){
                        let oppCount=this.oppositeSpot.childElementCount;
                        //shortcut to clear all inner nodes from parent 
                        this.oppositeSpot.innerHTML =''
                        while(oppCount>0){
                            this.createGamePiece(this.goals.p2Goal);
                            oppCount--;
                            console.log(endSpotCount);
                        }
                        this.getlastPlayer=true;

                    }
                });
                
                
            } else {
                return;
            }

        }
    },

    //cleanup function
    getP1Beads(turn){
        if(this.getlastPlayer===true){
            if(turn===0){
                let lastSCount=this.endSpot.childElementCount;
                while(lastSCount>0){
                    this.createGamePiece(this.goals.p2Goal);
                    lastSCount--;
                }
            } else {
                let lastSCount=this.endSpot.childElementCount;
                while(lastSCount>0){
                    this.createGamePiece(this.goals.p1Goal);
                    lastSCount--;
                }
    

            }
            this.endSpot.innerHTML='';
            this.getlastPlayer=undefined;


        }

    },

    noBeadsLeft(){

        let totalBeadsP1 =0;
        let totalBeadsP2 =0;

        this.p1Slots.forEach(s=>{
            totalBeadsP1 = totalBeadsP1 + s.childElementCount;
        })
        this.p2Slots.forEach(s=>{
            totalBeadsP2 = totalBeadsP2 + s.childElementCount;
        })

        if(totalBeadsP1 ===0 ){
            alert('game over');
            while(totalBeadsP2>0){
                this.createGamePiece(this.goals.p2Goal);
                totalBeadsP2--;
            }
            this.p2Slots.forEach(s=>{
                s.innerHTML='';

            })
        } else if (totalBeadsP2 ===0){
            alert('game over');
            while(totalBeadsP1>0){
                this.createGamePiece(this.goals.p1Goal);
                totalBeadsP1--;

            }
            this.p1Slots.forEach(s=>{
                s.innerHTML='';

            })


        }
    }




}

////////end of object

mainGame.setGameFlows();

mainGame.gameFlowArr.forEach(s=>{
    s.addEventListener('mouseover',()=>{
        //if statement to prevent mouseover event triggering on p1/p2 goals
        if(s===mainGame.goals.p1Goal||s===mainGame.goals.p2Goal){
            return
        } else {
            //all othere slots aside from goals will trigger function
            mainGame.showEndLocation(s,mainGame.turnCount);
        }
    })

    s.addEventListener('mouseout',()=>{
        mainGame.showEndLocationClear(s);
    })

    s.addEventListener('click',()=>{
        mainGame.getOppositeSpot();
        mainGame.getP2Beads(s,mainGame.turnCount);

        if(mainGame.turnCount===0){
            mainGame.p1Slots.forEach(p1slot=>{
                if(s !== p1slot){
                    return;
                } else {
                    mainGame.initiateTurn(s)
                    mainGame.selectSpot(s);
                    mainGame.assignNextSpot(mainGame.selectedSlot,mainGame.turnCount)
                    mainGame.movePiece(mainGame.selectedSlot,mainGame.turnCount);
                    mainGame.displayTurn(mainGame.turnCount);        
                   
                }        
            })
        } else {
            mainGame.p2Slots.forEach(p2slot=>{
                if(s !== p2slot){
                    return;
                } else {
                    mainGame.initiateTurn(s)
                    mainGame.selectSpot(s);
                    mainGame.assignNextSpot(mainGame.selectedSlot,mainGame.turnCount)
                    mainGame.movePiece(mainGame.selectedSlot,mainGame.turnCount);
                    mainGame.displayTurn(mainGame.turnCount);

                }        
            })
        }

        mainGame.getP1Beads(mainGame.turnCount);
        mainGame.noBeadsLeft();

    })

})

mainGame.controlButtons.close.addEventListener('click',()=>{
    mainGame.displayRules();
})

mainGame.controlButtons.rules.addEventListener('click',()=>{
    mainGame.displayRules('open');
})

mainGame.controlButtons.begin.addEventListener('click',()=>{
    mainGame.gameOn = true;
    mainGame.displayTurn(mainGame.turnCount);
    mainGame.startGame();
})



