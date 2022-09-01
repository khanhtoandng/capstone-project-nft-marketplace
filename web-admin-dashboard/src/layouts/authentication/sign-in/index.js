import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// @mui icons

// components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import HandleApi from "config/HanldeAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Images

function Basic() {
  localStorage.removeItem("user");
  let navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const login = async () => {
    const user = await HandleApi.APIPost(`admin/login`, { email, password });

    if (user.success == true) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
      // return <Navigate to="/dashboard" />;
      navigate("/dashboard");
    } else {
      toast.error("Invalid account");
    }
  };

  return (
    <BasicLayout
      image={
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSJwhCcGZH9vZ5a3MrpY9PXjk0dF74f90dcQ&usqp=CAU"
      }
    >
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Login to Togethr
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                label="Email"
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                label="Password"
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton onClick={login} variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
