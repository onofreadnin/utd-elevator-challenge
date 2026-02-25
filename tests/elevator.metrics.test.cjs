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

describe('Elevator efficiency metrics', function() {
  it('tracks floors traversed using absolute floor movement', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });

    elevator.moveToFloor(4);
    elevator.moveToFloor(4);
    elevator.moveToFloor(1);

    assert.equal(elevator.totalFloorsTraversed, 7);
  });

  it('tracks stops for pickup and dropoff events', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const person = new Person('Metric Rider', 2, 6);

    elevator.requestRide(person);
    elevator.processAllRequests();

    assert.equal(elevator.totalStopsMade, 2);
    assert.equal(elevator.totalFloorsTraversed, 6);
  });
});
