const path = require("path");

const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// 判断生产环境还是开发环境 由cross-env插件定义
const isProdution = process.env.NODE_ENV === "production"

// 返回处理样式的loader函数
const getStyleLoader = (pre) => {
    return [
        isProdution ? MiniCssExtractPlugin.loader : "style-loader",
        "css-loader",
        {
            // 处理css兼容性问题 
            // 配合package.json中的browerslist指定兼容性
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env"
                    ]
                }
            }
        },
        pre && {
            loader: pre,
            options: pre === "less-loader" ? {
                // antd 主题色配置
                // 其他主题色：https://ant.design/docs/react/customize-theme-cn
                lessOptions: {
                    modifyVars: { "@primary-color": "#1DA57A" },
                    javascriptEnabled: true,
                }
            } : {}
        }
    ].filter(Boolean) // filter(Boolean) 过滤掉undefined值 

}

module.exports = {
    entry: "./src/main.js",
    output: {
        path: isProdution ? path.resolve(__dirname, "../dist") : undefined,
        filename: isProdution ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
        chunkFilename: isProdution ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",
        assetModuleFilename: "static/images/[name].[hash:10].[ext]",
        clean: true,
    },
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,
                use: getStyleLoader()
            },
            {
                test: /\.less$/,
                use: getStyleLoader("less-loader")
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoader("sass-loader")
            },
            {
                test: /\.styl$/,
                use: getStyleLoader("stylus-loader")
            },
            // 处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    }
                }
            },
            // 处理其他资源
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource"
            },
            // 处理js
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        // 开启模块热更新
                        !isProdution && "react-refresh/babel"
                    ].filter(Boolean),
                }
            }
        ]
    },
    // 处理HTML
    plugins: [
        new ESLintWebpackPlugin(
            {
                context: path.resolve(__dirname, "../src"),
                cache: true,
                cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache")
            }
        ),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
        isProdution && new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css"
        }),
        isProdution && new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    toType: "dir",
                    noErrorOnMissing: true, // 不生成错误
                    globOptions: {
                        // 忽略文件
                        ignore: ["**/index.html"],
                    },
                    info: {
                        // 跳过terser压缩js
                        minimized: true,
                    },
                },
            ],
        }),
        !isProdution && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    mode: isProdution ? "production" : "development",
    devtool: isProdution ? "source-map" : "cheap-module-source-map",
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                // react react-dom react-router-dom 一起打包成一个js文件
                // antd 单独打包
                // 剩下的node_modules单独打包
                react: {
                    test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
                    name: "chunk-react",
                    priority: 40,
                },
                // antd单独打包
                antd: {
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    name: "chunk-antd",
                    priority: 30,
                },
                // 剩下的node_modules单独打包
                libs: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "chunk-lib",
                    priority: 20,
                }
            }
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        },
        // 是否需要进行压缩
        minimize: isProdution,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ]
    },
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".jsx", ".js", ".json"],
        alias: {
            "@": path.resolve(__dirname, "../src"),
        }
    },
    devServer: {
        host: "172.16.100.95",
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true, // 解决react-router刷新
    },
    performance: false // 关闭性能分析 提升打包速度
}