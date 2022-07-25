<script lang="ts">
  import LazyLoad from "@components/LazyLoad/LazyLoad.svelte";
  import { Route, Router } from "svelte-navigator";
  import RouteGuard from "./RouteGuard.svelte";

  interface IRoute {
    path: string;
    component: () => Promise<any>;
    guard?: () => Promise<boolean> | boolean;
    routeProps?: {
      [key: string]: any;
    };
    componentProps?: {
      [key: string]: any;
    };
  }



  const routes: IRoute[] = [
    {
      path: "/",
      component: () => import("./Root.svelte"),
    },
  ];
</script>

<Router>
  {#each routes as route}
    <Route
      let:params
      let:location
      let:navigate
      path={route.path}
      {...route.routeProps ?? {}}
    >
      <RouteGuard condition={route.guard}>
        <LazyLoad let:component loader={route.component}>
          <svelte:component
            this={component}
            {params}
            {location}
            {navigate}
            {...route.componentProps ?? {}}
          />
        </LazyLoad>
      </RouteGuard>
    </Route>
  {/each}
</Router>
