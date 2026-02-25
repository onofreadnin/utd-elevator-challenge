require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert;
const Person = require('../person').default;

describe('Person', function() {
  it('stores name, current floor, and drop-off floor', function() {
    const person = new Person('Alex', 2, 8);

    assert.equal(person.name, 'Alex');
    assert.equal(person.currentFloor, 2);
    assert.equal(person.dropOffFloor, 8);
  });
});
