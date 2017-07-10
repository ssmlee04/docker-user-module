module.exports = function (wallaby) {
  return {
    files: ['server/models/*.js'],
    tests: ['server/tests/*.js'],
    env: {
      type: 'node',
      runner: 'node',
    },
    compilers: {
      '**/*.js': wallaby.compilers.babel(),
    },
  };
};
