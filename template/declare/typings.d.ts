declare module '*.svg';
declare module '*.png'
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.webp'
declare module '*.less'

declare type Page = ()=>Promise<{default:React.FC}>

declare interface Route {
    path:string,
    component:Page,
}