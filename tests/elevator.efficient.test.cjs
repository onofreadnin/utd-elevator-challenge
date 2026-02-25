require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert;
const Elevator = require('../elevator').default;
const Person = require('../person').default;

function createClockWithHour(hour) {
  return {
    now: () => new Date(2026, 0, 1, hour, 0, 0)
  };
}

function runScenario(personA, personB, processingStrategy) {
  const elevator = new Elevator({
    clock: createClockWithHour(15),
    processingStrategy
  });

  elevator.requestRide(personA);
  elevator.requestRide(personB);
  elevator.processAllRequests();

  return elevator;
}

describe('Elevator efficient strategy', function() {
  it('A up, B up uses fewer floors than FIFO', function() {
    const personA = new Person('Person A', 3, 6);
    const personB = new Person('Person B', 1, 5);

    const fifoElevator = runScenario(personA, personB, 'fifo');
    const efficientElevator = runScenario(personA, personB, 'efficient');

    assert.isBelow(efficientElevator.totalFloorsTraversed, fifoElevator.totalFloorsTraversed);
    assert.equal(efficientElevator.totalFloorsTraversed, 6);
  });

  it('A up, B down matches FIFO floor minimum in this edge case', function() {
    const personA = new Person('Person A', 3, 6);
    const personB = new Person('Person B', 5, 1);

    const fifoElevator = runScenario(personA, personB, 'fifo');
    const efficientElevator = runScenario(personA, personB, 'efficient');

    assert.equal(fifoElevator.totalFloorsTraversed, 11);
    assert.equal(efficientElevator.totalFloorsTraversed, 11);
  });

  it('A down, B up uses fewer floors than FIFO', function() {
    const personA = new Person('Person A', 7, 1);
    const personB = new Person('Person B', 2, 8);

    const fifoElevator = runScenario(personA, personB, 'fifo');
    const efficientElevator = runScenario(personA, personB, 'efficient');

    assert.isBelow(efficientElevator.totalFloorsTraversed, fifoElevator.totalFloorsTraversed);
    assert.equal(efficientElevator.totalFloorsTraversed, 15);
  });

  it('A down, B down uses fewer floors than FIFO', function() {
    const personA = new Person('Person A', 8, 2);
    const personB = new Person('Person B', 5, 0);

    const fifoElevator = runScenario(personA, personB, 'fifo');
    const efficientElevator = runScenario(personA, personB, 'efficient');

    assert.isBelow(efficientElevator.totalFloorsTraversed, fifoElevator.totalFloorsTraversed);
    assert.equal(efficientElevator.totalFloorsTraversed, 16);
  });
});
