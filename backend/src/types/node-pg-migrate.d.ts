// node-pg-migrate ships its types through the package "exports" map, which the
// project's "moduleResolution": "Node" setting does not read. tsx resolves the
// real module at runtime; this ambient re-export only points tsc at the types.
declare module "node-pg-migrate" {
    export * from "node-pg-migrate/dist/bundle/index";
}
