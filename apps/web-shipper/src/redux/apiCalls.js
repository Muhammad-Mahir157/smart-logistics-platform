import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest } from "../requestMethods";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    console.log("This is res from apicalls file try block ", res.data);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    console.log("This is res from apicalls file", err);
    dispatch(loginFailure());
  }
};
