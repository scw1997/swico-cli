import {FC} from "react";

declare type Page = ()=>Promise<{default:FC}>

declare interface Route {
    path:string,
    component:Page,
}