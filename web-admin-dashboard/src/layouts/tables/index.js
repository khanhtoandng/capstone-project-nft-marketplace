//

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// example components
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import MDBadge from "components/MDBadge";
import HandleApi from "config/HanldeAPI";
import { useEffect, useState } from "react";
import MDAvatar from "components/MDAvatar";

function Tables() {
  // const { rows } = authorsTableData();
  const [rows, setRows] = useState([]);
  const columns = [
    { Header: "author", accessor: "author", width: "45%", align: "left" },
    // { Header: "email", accessor: "email", align: "left" },
    { Header: "address wallet", accessor: "address", align: "center" },
    { Header: "joined Date", accessor: "joined", align: "center" },
  ];

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const users = await HandleApi.APIGet(`user`);
    const rows = users?.map((user) => {
      return {
        author: <Author image={user.avatar} name={user.name} email={user.email} />,
        address: <MDBox ml={-1}>{user.address}</MDBox>,
        joined: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {new Date(user.joinedDate).toString().substring(0, 24)}
          </MDTypography>
        ),
      };
    });
    setRows(rows);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Users
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
