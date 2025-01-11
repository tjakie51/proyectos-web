// eslint.config.js
export default [
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
      camelcase: ["error", { properties: "always" }], // Agregar la regla de camelcase
      "no-trailing-spaces": "error", // No dejar espacios al final de las líneas
      "no-var": "error", // Evitar el uso de 'var', usar 'let' o 'const'
      "prefer-const": "error", // Preferir 'const' cuando una variable no cambia
      "no-unused-vars": ["warn"], // Advertencia si hay variables no usadas
    },
  },
];
