'use strict';
const generic = require('fast-deep-equal-git/spec/tests.js');
// const es6 = require('fast-deep-equal-git/spec/es6tests.js');

const reactElementA = {
  '$$typeof': 'react.element',
  type: 'div',
  key: null,
  ref: null,
  props: { x: 1 },
  _owner: {},
  _store: {}
};
// in reality the _owner object is much more complex (and contains over dozen circular references)
reactElementA._owner.children = [reactElementA];

const reactElementA2 = {
  '$$typeof': 'react.element',
  type: 'div',
  key: null,
  ref: null,
  props: { x: 1 },
  _owner: {},
  _store: {}
};
reactElementA2._owner.children = [reactElementA2];

const reactElementB = {
  '$$typeof': 'react.element',
  type: 'div',
  key: null,
  ref: null,
  props: { x: 2 },
  _owner: {},
  _store: {}
};
reactElementB._owner.children = [reactElementB];


const react = [
  {
    description: 'React elements',
    reactSpecific: true,
    tests: [
      {
        description: 'an element compared with itself',
        value1: reactElementA,
        value2: reactElementA,
        equal: true
      },
      {
        description: 'two elements equal by value',
        value1: reactElementA,
        value2: reactElementA2,
        equal: true
      },
      {
        description: 'two elements unequal by value',
        value1: reactElementA,
        value2: reactElementB,
        equal: false
      }
    ]
  }
];

// Additional customized behavior.
const custom = [
  {
    description: 'Custom tests',
    tests: [
      {
        description: 'Object.create(null) equal',
        value1: Object.create(null),
        value2: Object.create(null),
        equal: true
      },
      {
        description: 'Object.create(null) unequal to empty object',
        value1: Object.create(null),
        value2: {},
        equal: false
      },
      {
        description: 'Object.create(null) unequal to non-empty object',
        value1: Object.create(null),
        value2: { a: 1 },
        equal: false
      },
      // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects
      {
        description: 'Object.create(null) equal to vanilla null prototype deep objects',
        value1: Object.assign(Object.create(null), { a: 1, b: { c: true } }),
        value2: { __proto__: null, a: 1, b: { c: true } },
        equal: true
      },
      // Object.create(null) has a different `constructor` than a vanilla, non-null object.
      {
        description: 'Object.create(null) unequal to vanilla deep objects',
        value1: Object.assign(Object.create(null), { a: 1, b: { c: true } }),
        value2: { a: 1, b: { c: true } },
        equal: false
      },
      {
        description: 'Object.create(null) equal for deep objects',
        value1: Object.assign(Object.create(null), { a: 1, b: { c: true } }),
        value2: Object.assign(Object.create(null), { b: { c: true }, a: 1 }),
        equal: true
      }
    ]
  }
];

const extraEs6 = [
  {
    description: 'Additional es6 tests',
    reactSpecific: true,
    tests: [
      {
        description: 'nested Maps with same values are equal',
        value1: new Map([['one', 1], ['map', new Map([['two', 2]])]]),
        value2: new Map([['one', 1], ['map', new Map([['two', 2]])]]),
        equal: true
      },
      {
        description: 'nested Maps with different values are not equal',
        value1: new Map([['one', 1], ['map', new Map([['two', 2]])]]),
        value2: new Map([['one', 1], ['map', new Map([['three', 3]])]]),
        equal: false
      },
      // Fails in `fast-deep-equal`
      {
        description: 'nested Sets with same values are equal',
        value1: new Set(['one', new Set(['two'])]),
        value2: new Set(['one', new Set(['two'])]),
        equal: true
      },
      {
        description: 'nested Sets with different values are not equal',
        value1: new Set(['one', new Set(['two'])]),
        value2: new Set(['one', new Set(['three'])]),
        equal: false
      },
      // Fails in `fast-deep-equal`
      {
        description: 'nested Maps + Sets with same values are equal',
        value1: new Map([['one', 1], ['set', new Set(['one', new Set(['two'])])]]),
        value2: new Map([['one', 1], ['set', new Set(['one', new Set(['two'])])]]),
        equal: true
      },
      {
        description: 'nested Maps + Sets with different values are not equal',
        value1: new Map([['one', 1], ['set', new Set(['one', new Set(['two'])])]]),
        value2: new Map([['one', 1], ['set', new Set(['one', new Set(['three'])])]]),
        equal: false
      }
    ]
  }
];

module.exports = {
  generic,
  // NOTE(kevinb): these test cases were used to compare the behavior of react-fast-compare
  // against fast-deep-equal to make sure the modules stay in sync.  Our vendored version of
  // react-fast-compare patches a bug with how `Set`s are handled, but we haven't bothered
  // port this fix upstream.
  // es6,
  extraEs6,
  react,
  custom,
  all: [].concat(generic, /* es6, */ extraEs6, react, custom),
};
