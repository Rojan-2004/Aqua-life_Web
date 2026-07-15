export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        WHOAMI: "/api/v1/auth/whoami",
        UPDATE: "/api/v1/auth/update",
        PROFILE_UPDATE: "/api/v1/auth/profile",
        PASSWORD_UPDATE: "/api/v1/auth/password",
        UPLOAD_PICTURE: "/api/v1/auth/upload-profile-picture",
        REQUEST_PASSWORD_RESET: "/api/v1/auth/request-password-reset",
        RESET_PASSWORD: (token: string): string => `/api/v1/auth/reset-password/${token}`,
    },
    ADMIN: {
        BLOG: {
            GET: "/api/v1/admin/blogs",
            GET_ONE: (id: string) => `/api/v1/admin/blogs/${id}`,
            CREATE: "/api/v1/admin/blogs",
            UPDATE: (id: string): string => `/api/v1/admin/blogs/${id}`,
            DELETE: (id: string): string => `/api/v1/admin/blogs/${id}`,
        },
        USERS: {
            GET_ALL: "/api/v1/admin/users",
            GET_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
            CREATE: "/api/v1/admin/users",
            UPDATE: (id: string) => `/api/v1/admin/users/${id}`,
            DELETE: (id: string) => `/api/v1/admin/users/${id}`,
        },
        PRODUCTS: {
            GET_ALL: "/api/v1/admin/products",
            GET_BY_ID: (id: string) => `/api/v1/admin/products/${id}`,
            CREATE: "/api/v1/admin/products",
            UPDATE: (id: string): string => `/api/v1/admin/products/${id}`,
            DELETE: (id: string): string => `/api/v1/admin/products/${id}`,
        },
        ORDERS: {
            GET_ALL: "/api/v1/admin/orders",
            GET_BY_ID: (id: string) => `/api/v1/admin/orders/${id}`,
            UPDATE_STATUS: (id: string) => `/api/v1/admin/orders/${id}/status`,
        }
    },
    DASHBOARD: {
        ADMIN_STATS: "/api/v1/admin/stats",
        ADMIN_RECENT_ORDERS: "/api/v1/admin/orders/recent",
        USER_DASHBOARD: "/api/v1/user/dashboard",
    },
    PRODUCT: {
        GET_ALL: "/api/v1/products",
        GET_BY_ID: (id: string) => `/api/v1/products/${id}`,
    },
    WISHLIST: {
        TOGGLE: "/api/v1/wishlist",
        GET_ALL: "/api/v1/wishlist",
    },
    CART: {
        GET_ALL: "/api/v1/cart",
        ADD: "/api/v1/cart",
        REMOVE: "/api/v1/cart",
    },
    ORDERS: {
        PLACE: "/api/v1/orders",
    },
    ADMIN_NOTIFICATIONS: {
        GET_ALL: "/api/v1/admin/notifications",
        MARK_READ: "/api/v1/admin/notifications",
    }
}