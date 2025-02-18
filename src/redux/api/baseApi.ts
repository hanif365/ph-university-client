import { BaseQueryApi, BaseQueryFn, createApi, DefinitionType, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setUser, logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, api) => {
    const token = (api.getState() as RootState).auth.token;
    // we can add Bearer if backend handle it
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<FetchArgs, BaseQueryApi, DefinitionType> = async (args, api, extraOptions): Promise<any> => {
  // console.log("args from baseQueryWithRefreshToken", args);
  // console.log("api from baseQueryWithRefreshToken", api);
  // console.log("extraOptions from baseQueryWithRefreshToken", extraOptions);
  let result = await baseQuery(args, api, extraOptions);
  // console.log("result from baseQueryWithRefreshToken", result);

  if (result.error?.status === 401) {
    console.log("Sending request for new access token using refresh token");
    const res = await fetch("http://localhost:5000/api/v1/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    console.log("res from baseQueryWithRefreshToken", data);

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;
      console.log("user from baseQueryWithRefreshToken", user);
      api.dispatch(setUser({ user, token: data.data.accessToken }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Logging out because refresh token is expired");
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
});
