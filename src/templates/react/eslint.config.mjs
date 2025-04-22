import { defineConfig, globalIgnores } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsAndTsFile = '**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}';

export default defineConfig([
    globalIgnores(['node_modules/**/*', 'dist/**/*', '/.swico/**/*']),
    /** js推荐配置 */
    eslint.configs.recommended,
    /** ts推荐配置 */
    ...tsEslint.configs.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    {
        files: [jsAndTsFile],
        ...reactPlugin.configs.flat.recommended,
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin
        },

        languageOptions: {
            ...reactPlugin.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },

        settings: {
            react: {
                version: 'detect'
            }
        },

        rules: {
            semi: 1,
            'no-console': 0,
            'no-prototype-builtins': 0,
            'comma-dangle': [2, 'never'],
            'max-len': 0,
            'max-lines': 0,
            'max-params': 0,
            'max-statements': 0,
            'max-statements-per-line': 0,
            'space-before-function-paren': [0, 'always'],

            'no-unused-expressions': [
                0,
                {
                    allowShortCircuit: true,
                    allowTernary: true
                }
            ],

            'arrow-body-style': [0, 'never'],
            'func-names': 0,
            'prefer-const': 0,
            'no-extend-native': 2,
            'no-param-reassign': 0,
            'no-restricted-syntax': 0,
            'no-eval': 0,
            'no-continue': 0,
            'global-require': 1,
            camelcase: 0,
            'import/no-extraneous-dependencies': 0,
            'import/prefer-default-export': 0,
            'import/no-unresolved': 0,
            'import/extensions': 0,
            'react/jsx-first-prop-new-line': 0,
            'react/jsx-filename-extension': 0,
            'react/require-default-props': 0,
            'react/no-string-refs': 0,
            'react/no-find-dom-node': 0,
            'react/display-name': 0,

            'react/forbid-prop-types': [
                2,
                {
                    forbid: ['any']
                }
            ],

            'react/jsx-boolean-value': 2,
            'react/jsx-closing-bracket-location': 1,

            'react/jsx-curly-spacing': [
                2,
                {
                    when: 'never',
                    children: true
                }
            ],

            'react/jsx-key': 2,
            'react/jsx-no-bind': 0,
            'react/jsx-no-duplicate-props': 2,
            'react/jsx-no-literals': 0,
            'react/jsx-no-undef': 1,
            'react/jsx-pascal-case': 0,
            'react/jsx-sort-props': 0,
            'react/jsx-uses-react': 1,
            'react/jsx-uses-vars': 2,
            'react/no-danger': 0,
            'react/no-did-mount-set-state': 0,
            'react/no-did-update-set-state': 1,
            'react/no-direct-mutation-state': 2,
            'react/no-multi-comp': 0,
            'react/no-set-state': 0,
            'react/no-unknown-property': 2,
            'react/prefer-es6-class': 2,
            'react/prop-types': 0,
            'react/react-in-jsx-scope': 0,
            'react/self-closing-comp': 0,
            'react/sort-comp': 2,
            'react/no-array-index-key': 0,
            'react/no-deprecated': 1,
            'react/jsx-equals-spacing': 2,
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 0,
            'no-extra-boolean-cast': 0,
            'no-unreachable': 1,
            'no-mixed-spaces-and-tabs': 0,
            'prefer-arrow-callback': 0,
            'arrow-parens': 0,
            'arrow-spacing': 0,
            'jsx-a11y/href-no-hash': 0,
            'jsx-a11y/no-static-element-interactions': 0,
            quotes: [2, 'single'],
            'no-debugger': 2,
            'no-var': 2,
            'no-irregular-whitespace': 0,
            'no-trailing-spaces': 1,
            'eol-last': 0,
            'no-underscore-dangle': 0,
            'no-alert': 2,
            'no-lone-blocks': 0,
            'no-class-assign': 2,
            'no-cond-assign': 2,
            'no-const-assign': 2,
            'no-delete-var': 2,
            'no-dupe-keys': 2,
            'no-duplicate-case': 2,
            'no-dupe-args': 2,
            'no-empty': 2,
            'no-func-assign': 2,
            'no-invalid-this': 0,
            'no-redeclare': 2,
            'no-spaced-func': 0,
            'no-this-before-super': 0,
            'no-undef': 0,
            'no-use-before-define': 0,
            'jsx-quotes': [2, 'prefer-double'],
            '@typescript-eslint/no-unused-vars': 0,
            '@typescript-eslint/no-explicit-any': 0,
            '@typescript-eslint/no-empty-interface': 0,
            '@typescript-eslint/explicit-function-return-type': 0,

            '@typescript-eslint/camelcase': [
                'off',
                {
                    properties: 'always'
                }
            ],

            '@typescript-eslint/no-use-before-define': 0,
            '@typescript-eslint/explicit-module-boundary-types': 0,
            '@typescript-eslint/no-non-null-assertion': 0,
            '@typescript-eslint/ban-ts-comment': 0
        }
    }
]);
