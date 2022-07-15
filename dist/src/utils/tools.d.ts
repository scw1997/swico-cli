interface CliConfigFields {
    plugins?: any[];
    publicPath?: string;
    title?: string;
    console?: boolean;
}
export interface ProjectConfigType {
    projectPath: string;
    entryPath: string;
    templatePath: string;
    cliConfig: {
        common: CliConfigFields;
        dev: CliConfigFields;
        prd: CliConfigFields;
    };
}
export declare const downloadTemp: (targetPath: string) => Promise<unknown>;
export declare const getProjectConfig: () => Promise<ProjectConfigType>;
export declare const getPort: () => Promise<number>;
export declare const initFields: CliConfigFields;
export {};
