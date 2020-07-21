import { RouteResolver } from ".";
import { PathLocationComposer } from "../LocationComposer/PathLocationComposer";
import { RouteRecord } from "../RouteRecord";
import { RoutesBuilder } from "../RoutesBuilder";

const composer = new PathLocationComposer();

const b1 = RoutesBuilder.init<string>({
  composer,
}).routes({
  foo: {
    action: () => "foo!",
  },
  bar: {
    action: () => "bar",
  },
  baz: {
    action: () => "baz.",
  },
});

const b2 = b1.wildcard("id", {
  action: ({ id }) => `id is ${id}`,
});

const routes = b1.getRoutes();
const wildcardRoutes = b2.getRoutes();

routes.foo.attach(
  RoutesBuilder.init<string>({ composer }).routes({
    hoge: {
      action: () => "hoge",
    },
  })
);

routes.bar.attach(
  RoutesBuilder.init<string>({ composer }).routes({
    fuga: {
      action: () => "fuga",
    },
  })
);

const resolver = new RouteResolver<string, typeof routes>(routes, composer);
const wildcardResolver = new RouteResolver<string, typeof wildcardRoutes>(
  wildcardRoutes,
  composer
);

describe("RouteResolver", () => {
  describe("resolves shallow location", () => {
    it("1", () => {
      const resolved = resolver.resolve({
        pathname: "/foo",
        state: {
          sta: "te",
        },
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, location: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action({})).toBe("foo!");
      expect(next).toEqual({
        pathname: "/",
        state: {
          sta: "te",
        },
      });
    });
    it("2", () => {
      const resolved = resolver.resolve({
        pathname: "/bar",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, location: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action({})).toBe("bar");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("3", () => {
      const resolved = resolver.resolve({
        pathname: "/baz",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, location: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action({})).toBe("baz.");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("4", () => {
      const resolved = wildcardResolver.resolve({
        pathname: "/foo",
        state: {
          sta: "te",
        },
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, location: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action({})).toBe("foo!");
      expect(next).toEqual({
        pathname: "/",
        state: {
          sta: "te",
        },
      });
    });
  });
  describe("resolves deep location", () => {
    it("1", () => {
      const resolved = resolver.resolve({
        pathname: "/foo/hoge",
        state: {
          sta: "te",
        },
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, location: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action({})).toBe("hoge");
      expect(next).toEqual({
        pathname: "/",
        state: {
          sta: "te",
        },
      });
    });
    it("2", () => {
      const resolved = resolver.resolve({
        pathname: "/bar/fuga",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, location: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action({})).toBe("fuga");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("3", () => {
      const resolved = wildcardResolver.resolve({
        pathname: "/bar/fuga",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, location: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action({})).toBe("fuga");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
  });
  describe("wrong location returns an empty array", () => {
    it("shallow nonexistent location", () => {
      const resolved = resolver.resolve({
        pathname: "/nonexistent",
        state: null,
      });
      expect(resolved).toEqual([]);
    });
    it("deep nonexistent location", () => {
      const resolved = resolver.resolve({
        pathname: "/foo/nonexistent",
        state: null,
      });
      expect(resolved).toEqual([]);
    });
    it("illegal location", () => {
      const resolved = resolver.resolve({
        pathname: "foo/bar",
        state: null,
      });
      expect(resolved).toEqual([]);
    });
  });

  describe("resolves wildcard location", () => {
    it("shallow", () => {
      const resolved = wildcardResolver.resolve({
        pathname: "/nonexistent",
        state: null,
      });
      expect(resolved).toEqual([
        {
          location: {
            pathname: "/",
            state: null,
          },
          match: {
            id: "nonexistent",
          },
          route: {
            action: expect.any(Function),
            matchKey: "id",
          },
        },
      ]);
    });
  });
});
