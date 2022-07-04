import { ProjectConfigType } from '../utils/tools';
export default function ({ projectPath, entryPath, templatePath, cliConfig }: ProjectConfigType): {
    entry: string;
    output: {
        path: string;
        filename: string;
        assetModuleFilename: string;
        publicPath: string;
    };
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
    plugins: any[];
};
