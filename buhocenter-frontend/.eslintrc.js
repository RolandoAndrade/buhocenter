module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        //Estas reglas deben ser evaluadas para determinar cuales dejar y cuales corregir.
        'no-useless-escape': 'off', //Esta se debe dejar para el uso de una expresión regular en rules.ts.
        '@typescript-eslint/camelcase': 'off', //Muchos errores y probablemente conflictos con el backend.
        '@typescript-eslint/ban-ts-ignore': 'off', //Se puede quitar después de eliminar los ts-ignore.
        '@typescript-eslint/no-explicit-any': 'off', //Tomar en consideración su uso ya que se usa en muchas partes del software.
        '@typescript-eslint/class-name-casing': 'off', //Se puede revisar después del tipado.
        '@typescript-eslint/explicit-module-boundary-types': 'warn', //Eliminar después de tipar.
        '@typescript-eslint/ban-ts-comment': 'off', //Se puede quitar después de eliminar los ts-ignore.
        '@typescript-eslint/no-inferrable-types': 'off',
    },
};
