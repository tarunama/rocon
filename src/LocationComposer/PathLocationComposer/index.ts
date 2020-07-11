import { LocationComposer } from "..";
import { Location } from "../Location";
import { composePath } from "./composePath";

export class PathLocationComposer implements LocationComposer<string> {
  getRoot(): Location<null> {
    return {
      pathname: "/",
      state: null,
    };
  }
  compose<S>(base: Location<S>, segment: string): Location<S> {
    return {
      ...base,
      pathname: composePath(base.pathname, segment),
    };
  }
}