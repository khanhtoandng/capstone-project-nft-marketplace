//

import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// examples
import DataTable from "examples/Tables/DataTable";

// Data
import MDAvatar from "components/MDAvatar";
import HandleApi from "config/HanldeAPI";

function Projects() {
  const [menu, setMenu] = useState(null);
  const [rows, setRows] = useState([]);
  const columns = [
    { Header: "name", accessor: "name", width: "45%", align: "left" },
    { Header: "owner", accessor: "owner", width: "10%", align: "left" },
    { Header: "price", accessor: "price", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
  ];
  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const products = await HandleApi.APIGet(`product`);
    const rows = products?.map((product) => {
      return {
        name: <Company image={product.uri} name={product.name} />,
        owner: (
          <MDBox display="flex" py={1}>
            {product.user.name}
          </MDBox>
        ),
        price: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {`${product.price} ETH`}
          </MDTypography>
        ),
        status: (
          <MDBox width="8rem" textAlign="center">
            {product.isSale == false ? "In Sale" : "Sale"}
          </MDBox>
        ),
      };
    });
    setRows(rows);
  };

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Products
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

export default Projects;
