import antfu from '@antfu/eslint-config';

export default antfu(
  {
    stylistic: {
      indent: 2,
      semi: true,
    },
    rules: {
      'no-console': ['warn', { allow: ['info', 'error'] }],
      'node/prefer-global/process': 'off',
    },
  },
);
