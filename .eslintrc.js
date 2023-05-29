module.exports = {
    extends: ["react-app"], // 继承 react 官方规则
    parserOptions: {
        babelOptions: {
            presets: [
                // 解决页面报错问题
                ["babel-preset-react-app", false],
                "babel-preset-react-app/prod",
            ],
        },
    },
    rules: {
        // 自定义规则
        "no-unused-vars": "off",
        "no-undef": "off",
        "no-restricted-globals": "off",
        "no-useless-escape": "off",
        "no-sequences": "off",
        "no-debugger": "off",
        "no-console": "off",
        "no-empty": "off",
    },
};