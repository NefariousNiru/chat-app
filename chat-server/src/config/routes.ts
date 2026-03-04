export const Routes = {
  HEALTH: "/health",

  USER: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },

  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
} as const;
