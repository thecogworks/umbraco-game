
describe("Does an FSM instantiate", function(){
  var fsm;
  
  it("Create new FSM", function(){
      fsm = new FiniteStateMachine();
      expect(fsm).toBeDefined();
  });
});


describe("Gives the fsm a new state", function(){
  var fsm;
  var as;
  
  it("Create new ActorState", function(){
      as = new ActorState();
      expect(as).toBeDefined();
  });
  
  it("Call the changeState method of fsm", function(){
      fsm = new FiniteStateMachine();
      spyOn(fsm, "changeState");
      fsm.changeState(as);
      expect(fsm.changeState).toHaveBeenCalled();
  });
  
  it("Check the new actorState", function(){
      fsm = new FiniteStateMachine();
      fsm.changeState(as);
      expect(fsm.currentState).toBe(as);
  });
});

describe("Check state changing functionality", function(){
   var fsm = new FiniteStateMachine();
   var as;
   var as2;
   
   it("Define a next state for the fsm", function(){
       as2 = new ActorState();
       fsm.setNextState(as2);
       expect(fsm.nextState).toBe(as2);
   });
   
   it("Switch to the next state when fsm.switchToNextState is called.", function(){
       as = new ActorState();
       as2 = new ActorState();
       fsm.changeState(as);
       fsm.setNextState(as2);
       fsm.switchToNextState();
       expect(fsm.currentState).toBe(as2);
   });
   
   it("Check previous state is set properly", function(){
       as = new ActorState();
       as2 = new ActorState();
       fsm.changeState(as);
       fsm.changeState(as2);
       expect(fsm.previousState).toBe(as);
   });
   
   it("Switch back to the previous state.", function(){
       as = new ActorState();
       as2 = new ActorState();
       fsm.changeState(as);
       fsm.changeState(as2);
       fsm.switchToPreviousState();
       expect(fsm.currentState).toBe(as);
   });
});

describe("Check fsm to actorstate functionality", function(){
    fsm = new FiniteStateMachine();
    as = new ActorState();
   
    
    it("Access the current state's update when the FSM updates", function(){
        spyOn(as, "update");
        fsm.changeState(as);
        fsm.update();
        expect(as.update).toHaveBeenCalled();
    })
    
    it("Access the ActorState's onEnter when a new state is given to the FSM", function(){
        spyOn(as, "onEnter");
        fsm.changeState(as);
        expect(as.onEnter).toHaveBeenCalled();
    })
    
    it("Access the current ActorState's onExit when a new state is given to the FSM", function(){
        spyOn(as, "onExit");
        fsm.changeState(as);
        var as2 = new ActorState();
        expect(as.onExit).toHaveBeenCalled();
    })
})