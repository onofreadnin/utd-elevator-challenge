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

function runTwoPersonScenario(personA, personB) {
  const elevator = new Elevator({ clock: createClockWithHour(15) });

  elevator.requestRide(personA);
  elevator.requestRide(personB);
  elevator.processAllRequests();

  return elevator;
}

describe('Elevator two-person scenario matrix', function() {
  it('A up, B up', function() {
    const personA = new Person('Person A', 3, 6);
    const personB = new Person('Person B', 1, 5);
    const elevator = runTwoPersonScenario(personA, personB);

    assert.equal(elevator.totalStopsMade, 4);
    assert.equal(elevator.totalFloorsTraversed, 15);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
  });

  it('A up, B down', function() {
    const personA = new Person('Person A', 3, 6);
    const personB = new Person('Person B', 5, 1);
    const elevator = runTwoPersonScenario(personA, personB);

    assert.equal(elevator.totalStopsMade, 4);
    assert.equal(elevator.totalFloorsTraversed, 11);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
  });

  it('A down, B up', function() {
    const personA = new Person('Person A', 7, 1);
    const personB = new Person('Person B', 2, 8);
    const elevator = runTwoPersonScenario(personA, personB);

    assert.equal(elevator.totalStopsMade, 4);
    assert.equal(elevator.totalFloorsTraversed, 20);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
  });

  it('A down, B down', function() {
    const personA = new Person('Person A', 8, 2);
    const personB = new Person('Person B', 5, 0);
    const elevator = runTwoPersonScenario(personA, personB);

    assert.equal(elevator.totalStopsMade, 4);
    assert.equal(elevator.totalFloorsTraversed, 22);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
  });
});
