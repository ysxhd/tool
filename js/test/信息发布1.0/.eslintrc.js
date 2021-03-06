module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "parser": "babel-eslint",
    "rules": {
        "eqeqeq": "off",
        "no-unneeded-ternary": "off",
        "arrow-spacing": "off",
        "no-console": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-extra-semi": "off",
        "no-empty":"off",
        "indent": [
            "off",
            "tab"
        ],
        "linebreak-style": [
            "off",
            "windows"
        ],
        "quotes": [
            "off",
            "double"
        ],
        "semi": [
            "off",
            "always"
        ]
    }
};