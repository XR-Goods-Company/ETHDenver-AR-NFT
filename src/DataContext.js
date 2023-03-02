import { createContext } from "react";



export const DataContext = createContext({
  loginResponse: undefined,
  setLoginResponse: function (value) {
    throw new Error("Function not implemented.");
  }
});