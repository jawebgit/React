'use strict';

if (process.env.NODE_ENV === 'production') {
  throw Error('test renderer is not available in production mode.');
} else {
  module.exports = require('./cjs/react-test-renderer-stack.development');
}
