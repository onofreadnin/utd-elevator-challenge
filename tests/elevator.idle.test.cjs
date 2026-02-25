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

describe('Elevator Level 6 idle behavior', function() {
  it('returns to lobby before noon when idle', function() {
    const elevator = new Elevator({ clock: createClockWithHour(9) });
    elevator.currentFloor = 5;

    elevator.handleIdleState();

    assert.equal(elevator.currentFloor, 0);
    assert.equal(elevator.totalFloorsTraversed, 5);
    assert.equal(elevator.totalStopsMade, 1);
  });

  it('stays on last drop-off floor after noon when idle', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    elevator.currentFloor = 5;

    elevator.handleIdleState();

    assert.equal(elevator.currentFloor, 5);
    assert.equal(elevator.totalFloorsTraversed, 0);
    assert.equal(elevator.totalStopsMade, 0);
  });

  it('processAllRequests applies idle rule after completing all requests', function() {
    const beforeNoonElevator = new Elevator({ clock: createClockWithHour(9) });
    const afterNoonElevator = new Elevator({ clock: createClockWithHour(15) });
    const riderBeforeNoon = new Person('Before Noon Rider', 2, 4);
    const riderAfterNoon = new Person('After Noon Rider', 2, 4);

    beforeNoonElevator.requestRide(riderBeforeNoon);
    beforeNoonElevator.processAllRequests();

    afterNoonElevator.requestRide(riderAfterNoon);
    afterNoonElevator.processAllRequests();

    assert.equal(beforeNoonElevator.currentFloor, 0);
    assert.equal(beforeNoonElevator.totalFloorsTraversed, 8);
    assert.equal(beforeNoonElevator.totalStopsMade, 3);

    assert.equal(afterNoonElevator.currentFloor, 4);
    assert.equal(afterNoonElevator.totalFloorsTraversed, 4);
    assert.equal(afterNoonElevator.totalStopsMade, 2);
  });
});
