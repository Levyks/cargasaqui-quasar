/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  _RouteRecordBase,
  RouteComponent,
  RouteLocationNormalized,
  RouteRecordRedirectOption,
} from 'vue-router';
import { Lazy } from './misc';

type RawRouteComponent = RouteComponent | Lazy<RouteComponent>;
type _RouteRecordProps =
  | boolean
  | Record<string, any>
  | ((to: RouteLocationNormalized) => Record<string, any>);

interface RouteRecordRedirect extends _RouteRecordBase {
  redirect: RouteRecordRedirectOption;
  component?: never;
  components?: never;
}

export interface CustomRouteRecordSingleView extends _RouteRecordBase {
  component: RawRouteComponent;
  components?: never;
  props?: _RouteRecordProps;
  getPath?: (...args: any[]) => string;
}

export type CustomRouteRecord =
  | CustomRouteRecordSingleView
  | RouteRecordRedirect;

export type CustomRouteRecordDict = {
  [key: string]: CustomRouteRecord;
};
