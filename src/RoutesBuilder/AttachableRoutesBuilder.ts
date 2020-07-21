import { RoutesBuilder } from ".";
import { RoutesDefinitionToRouteRecords } from "../RouteRecord";
import { RouteResolver } from "../RouteResolver";
import { RouteDefinition } from "./RoutesDefinitionObject";

export interface AttachableRoutesBuilder<
  ActionResult,
  Defs extends Record<string, RouteDefinition<ActionResult, Wildcard>>,
  Wildcard
> {
  getRawBuilder(): RoutesBuilder<ActionResult, Defs, Wildcard>;
  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs>
  >;
}