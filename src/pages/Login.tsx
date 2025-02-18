import { Button } from "antd";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";

const defaultUserInfo = {
  id: "A-0002",
  password: "admin12345",
};

const Login = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: defaultUserInfo,
  });
  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async (data) => {
    // console.log("data", data);
    const userInfo = {
      id: data.id,
      password: data.password,
    };
    console.log("userInfo", userInfo);

    const result = await login(userInfo).unwrap();
    console.log("result", result);
    const user = verifyToken(result?.data?.accessToken);
    console.log("user", user);
    dispatch(setUser({ user, token: result?.data?.accessToken }));
  };
  // console.log(data, error);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="id">ID</label>
        <input type="id" id="id" {...register("id")} />
      </div>
      <div>
        <label htmlFor="id">Password</label>
        <input type="text" id="id" {...register("password")} />
      </div>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Login
      </Button>
    </form>
  );
};

export default Login;
