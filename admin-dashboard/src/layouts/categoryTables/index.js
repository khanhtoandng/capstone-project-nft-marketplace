/* eslint-disable react/jsx-filename-extension */
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Modal, Image, Upload, Button } from "antd";
import MDInput from "components/MDInput";
// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { UploadOutlined } from "@ant-design/icons";
// example components
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";

// Data
import HandleApi from "config/HanldeAPI";
import { useEffect, useState } from "react";
import { Icon } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import ReactS3Client from "react-aws-s3-typescript";

const S3_BUCKET = "uninft";
const REGION = "ap-southeast-1";
const ACCESS_KEY = process.env.ACCESS_KEY || "AKIA6N6UCW73QISNQJWT";
const SECRET_ACCESS_KEY = process.env.ACCESS_KEY || "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";
import { toast } from "react-toastify";

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

function CategoryTables() {
  // const { rows: pRows } = projectsTableData();
  const [isUpdated, setIsUpdated] = useState(Math.floor(Math.random() * (10000 - 1 + 1) + 1));
  const [image, setImage] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [id, setId] = useState("");

  // create
  const [isShowCreate, setIsShowCreate] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");

  // delete
  const [isShowDelete, setIsShowDelete] = useState(false);

  const [rows, setRows] = useState([]);
  const columns = [
    { Header: "category", accessor: "category", width: "30%", align: "left" },
    { Header: "no. product", accessor: "product", align: "left" },
    { Header: "created Date", accessor: "createdAt", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  useEffect(() => {
    getCategories(isUpdated);
  }, [isUpdated]);

  const getCategories = async (isUpdated) => {
    console.log(isUpdated);
    const categories = await HandleApi.APIGet(`category`);
    const rows = categories?.map((category) => {
      return {
        category: <Project image={category.icon} name={category.name} />,
        product: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            {category.products?.length || 0}
          </MDTypography>
        ),
        createdAt: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {new Date(category.createdAt).toString().substring(0, 24)}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text" style={{ display: "flex", gap: 10 }}>
            {/* <Icon>more_vert</Icon> */}
            <MDButton
              variant="gradient"
              color="warning"
              size="small"
              onClick={() => {
                setImage(category?.icon);
                setCurrentImage(category?.icon);
                setCurrentName(category?.name);
                setNewCategoryIcon(category?.icon);
                setId(category?.id);
              }}
            >
              Update
            </MDButton>
            <MDButton
              variant="gradient"
              color="error"
              size="small"
              onClick={() => {
                setIsShowDelete(true);
                setId(category?.id);
              }}
            >
              Delete
            </MDButton>
          </MDTypography>
        ),
      };
    });
    setRows(rows);
  };

  const updateCategory = async () => {
    const s3 = new ReactS3Client(config);
    try {
      let res;
      let newAvaCategory;

      console.log("🚀 ~ newCategoryIcon", newCategoryIcon);
      if (newCategoryIcon && typeof newCategoryIcon === "object") {
        res = await s3.uploadFile(newCategoryIcon);
      } else if (!newCategoryIcon) {
        throw new Error("Invalid Icon");
      }

      if (res) {
        newAvaCategory = res.location;
      }

      if (currentName?.trim().length <= 0) {
        throw new Error("Invalid Name");
      }

      await HandleApi.APIPut(`category/update/${id}`, {
        name: currentName,
        banner: newAvaCategory,
        description: "Category",
        icon: newAvaCategory,
      });

      toast.success("Update Category Successfully");
      setImage("");
      setIsUpdated(Math.floor(Math.random() * (10000 - 1 + 1) + 1));
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Update Category Error");
    }
  };

  const createCategory = async () => {
    const s3 = new ReactS3Client(config);
    try {
      let res;
      let newAvaCategory;

      if (newCategoryIcon) {
        res = await s3.uploadFile(newCategoryIcon);
      } else {
        throw new Error("Invalid Icon");
      }

      if (res) {
        newAvaCategory = res.location;
      }

      if (newCategoryName?.trim().length <= 0) {
        throw new Error("Invalid Name");
      }

      await HandleApi.APIPost(`category`, {
        name: newCategoryName,
        banner: newAvaCategory,
        description: "Category",
        icon: newAvaCategory,
      });

      setIsShowCreate(false);
      toast.success("Create Category Successfully");
      setIsUpdated(Math.floor(Math.random() * (10000 - 1 + 1) + 1));
    } catch (err) {
      console.log(err);
      setIsShowCreate(false);
      toast.error(err.message || "Create Category Error");
    }
  };

  const deleteCategory = async () => {
    try {
      await HandleApi.APIPost(`category/delete/${id}`);
      setIsShowDelete(false);
      toast.success("Delete Category Successfully");
      setIsUpdated(Math.floor(Math.random() * (10000 - 1 + 1) + 1));
    } catch (err) {
      console.log(err);
      setIsShowDelete(false);
      toast.error(err.message || "Delete Category Error");
    }
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
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                  <MDTypography variant="h6" color="white">
                    Categories
                  </MDTypography>

                  <MDButton
                    variant="gradient"
                    color="light"
                    size="small"
                    onClick={() => setIsShowCreate(true)}
                  >
                    Create
                  </MDButton>
                </div>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  noEndBorder
                  showTotalEntries
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      <Modal
        title="Update Category"
        visible={image}
        onOk={updateCategory}
        width={590}
        onCancel={() => setImage("")}
      >
        <MDBox
          p={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Image src={currentImage} height={300} width={300} />
          <Upload
            showUploadList={false}
            customRequest={(options) => {
              const { file } = options;
              const url = URL.createObjectURL(file);
              console.log({ url });
              setCurrentImage(url);
              setNewCategoryIcon(file);
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          <MDInput
            type="text"
            label="Name"
            value={currentName || ""}
            style={{ width: 500 }}
            onChange={(e) => setCurrentName(e.target.value)}
          />
        </MDBox>
      </Modal>

      {/* Create */}
      <Modal
        title="Create Category"
        visible={isShowCreate}
        onOk={createCategory}
        width={590}
        onCancel={() => {
          setIsShowCreate(false);
          setCurrentImage("");
          setNewCategoryName("");
          setNewCategoryIcon("");
        }}
      >
        <MDBox
          p={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Image src={currentImage} height={300} width={300} />
          <Upload
            showUploadList={false}
            customRequest={(options) => {
              const { file } = options;
              const url = URL.createObjectURL(file);
              console.log({ url });
              setCurrentImage(url);
              setNewCategoryIcon(file);
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          <MDInput
            type="text"
            label="Name"
            value={newCategoryName || ""}
            style={{ width: 500 }}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </MDBox>
      </Modal>

      {/* delete */}
      <Modal
        title="Delete Category"
        visible={isShowDelete}
        onOk={deleteCategory}
        width={590}
        onCancel={() => setIsShowDelete(false)}
      >
        Do you want to delete this category?
      </Modal>
    </DashboardLayout>
  );
}

export default CategoryTables;
