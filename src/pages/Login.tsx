import { Button, Row } from "antd";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { FieldValues } from "react-hook-form";
import { useAppDispatch } from "../redux/hooks";
import { setUser, TUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PHForm from "../components/form/PHForm";
import PHInput from "../components/form/PHInput";

const defaultUserInfo = {
  id: "A-0002",
  password: "admin12345",
};    

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { register, handleSubmit } = useForm({
  //   defaultValues: defaultUserInfo,
  // });
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    console.log("form data", data);
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
    } catch (err: any) {
      console.log("err when login", err);
      toast.error(`${err?.data?.message || "Something went wrong"}`, {
        id: toastId,
        duration: 2000,
      });
    }
  };
  // console.log(data, error);

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <PHForm onSubmit={onSubmit} defaultValues={defaultUserInfo}>
        <PHInput name="id" type="text" label="ID" />

        <PHInput name="password" type="password" label="Password" />

        <Button type="primary" htmlType="submit" loading={isLoading}>
          Login
        </Button>
      </PHForm>
    </Row>
  );
};

export default Login;
