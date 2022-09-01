//

import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import HandleApi from "config/HanldeAPI";

function PlatformSettings() {
  const [user, setUser] = useState();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const id = JSON.parse(localStorage.getItem("user"))?.user.id;
    // console.log(typeof localStorage.getItem("user"));
    const user = id && (await HandleApi.APIGet(`admin/${id}`));

    setUser(user);
  };

  const updateProfile = async () => {
    const id = JSON.parse(localStorage.getItem("user"))?.user.id;
    await HandleApi.APIPut(`admin/update/${id}`, { ...user });
  };

  return (
    <Card sx={{ boxShadow: "none" }} alignItems="center">
      <MDBox>
        <MDTypography
          variant="h6"
          fontWeight="medium"
          textTransform="capitalize"
          style={{ marginLeft: 20 }}
        >
          Profile settings
        </MDTypography>
      </MDBox>
      <div style={{ display: "flex", marginTop: 40, width: 1000 }}>
        <div>
          <MDBox p={2}>
            <MDInput
              type="text"
              label="Name"
              value={user?.name || ""}
              style={{ width: 500 }}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </MDBox>
          <MDBox p={2}>
            <MDInput
              type="text"
              label="Email"
              value={user?.email || ""}
              style={{ width: 500 }}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </MDBox>

          {/* <MDBox p={2}>
            <MDInput
              type="text"
              label="Role"
              value={user?.role || " "}
              style={{ width: 500 }}
              disabled
            />
          </MDBox> */}
          <MDBox p={2}>
            <MDInput
              type="text"
              label="Phone Number"
              value={user?.phone || ""}
              style={{ width: 500 }}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </MDBox>
        </div>

        <div>
          <MDBox p={2}>
            <MDInput
              type="text"
              label="Date of birth"
              value={user?.dob || ""}
              style={{ width: 500 }}
              onChange={(e) => setUser({ ...user, dob: e.target.value })}
            />
          </MDBox>
          <MDBox p={2}>
            <MDInput
              type="text"
              label="Gender"
              value={user?.gender || ""}
              style={{ width: 500 }}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            />
          </MDBox>
        </div>
      </div>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}></MDBox>
        <MDBox>
          <MDButton variant="gradient" color="info" style={{ width: 500 }} onClick={updateProfile}>
            Update
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
