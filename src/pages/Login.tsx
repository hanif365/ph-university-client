import { Button } from "antd";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useForm, FieldValues } from "react-hook-form";
import { useAppDispatch } from "../redux/hooks";
import { setUser, TUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const defaultUserInfo = {
  id: "A-0002",
  password: "admin12345",
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: defaultUserInfo,
  });
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    // console.log("data", data);
    const toastId = toast.loading("Logging in...");

    try {
      const userInfo = {
        id: data.id,
        password: data.password,
      };
      console.log("userInfo", userInfo);

      const result = await login(userInfo).unwrap();
      console.log("result", result);
      const user = verifyToken(result?.data?.accessToken) as TUser;
      console.log("user", user);
      dispatch(setUser({ user, token: result?.data?.accessToken }));
      toast.success("Logged in successfully", { id: toastId, duration: 2000 });
      navigate(`/${user?.role}/dashboard`);
    } catch (err) {
      console.log("err when login", err);
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
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
