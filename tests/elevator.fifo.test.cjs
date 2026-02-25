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

describe('Elevator FIFO multi-rider behavior', function() {
  it('handles requests in received order and completes each rider before next pickup', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const bob = new Person('Bob', 3, 9);
    const sue = new Person('Sue', 6, 2);

    elevator.requestRide(bob);
    elevator.requestRide(sue);
    elevator.processAllRequests();

    assert.equal(elevator.totalStopsMade, 4);
    assert.equal(elevator.totalFloorsTraversed, 16);
    assert.equal(elevator.currentFloor, 2);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
  });
});
