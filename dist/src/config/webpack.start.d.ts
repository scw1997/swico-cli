import { ProjectConfigType } from '../utils/tools';
export default function (options: ProjectConfigType, open?: boolean): Promise<{
    output: {
        publicPath: string;
        path: string;
        filename: string;
        assetModuleFilename: string;
    };
    mode: string;
    devtool: string;
    devServer: {
        historyApiFallback: boolean;
        port: number;
        client: {
            progress: boolean;
            overlay: {
                errors: boolean;
                warnings: boolean;
            };
        };
        compress: boolean;
        hot: boolean;
        open: boolean;
        static: {
            directory: string;
        };
    };
    plugins: any[];
    entry: string;
    target: string[];
    cache: {
        type: string;
    };
    module: {
        rules: ({
            test: RegExp;
            exclude: RegExp;
            use: (string | {
                loader: string;
                options: {
                    presets: string[];
                    plugins: string[];
                };
            })[];
            oneOf?: undefined;
        } | {
            oneOf: ({
                test: RegExp;
                use: (string | {
                    loader: string;
                    options: {
                        modules: {
                            localIdentName: string;
                        };
                        postcssOptions?: undefined;
                    };
                } | {
                    loader: string;
                    options: {
                        postcssOptions: {
                            plugins: string[][];
                        };
                        modules?: undefined;
                    };
                })[];
                type?: undefined;
                generator?: undefined;
                loader?: undefined;
            } | {
                test: RegExp;
                type: string;
                generator: {
                    filename: string;
                };
                use?: undefined;
                loader?: undefined;
            } | {
                test: RegExp;
                type: string;
                use?: undefined;
                generator?: undefined;
                loader?: undefined;
            } | {
                test: RegExp;
                loader: string;
                use?: undefined;
                type?: undefined;
                generator?: undefined;
            })[];
            test?: undefined;
            exclude?: undefined;
            use?: undefined;
        })[];
    };
    resolve: {
        extensions: string[];
        alias: {
            '@': string;
        };
    };
}>;
