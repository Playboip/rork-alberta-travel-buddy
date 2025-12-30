import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import restaurantRecommendations from "./routes/restaurants/recommendations";
import restaurantList from "./routes/restaurants/list";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  restaurants: createTRPCRouter({
    recommendations: restaurantRecommendations,
    list: restaurantList,
  }),
});

export type AppRouter = typeof appRouter;