// @mui material components
import Grid from "@mui/material/Grid";

// components
import MDBox from "components/MDBox";

// example components
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Dashboard components
import HandleApi from "config/HanldeAPI";
import Projects from "layouts/dashboard/components/Projects";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/authentication/sign-in" />;
  }

  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactionValue, setTransactionValue] = useState(0);
  const [monthlyTransaction, setMonthlyTransaction] = useState(0);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const productCount = await HandleApi.APIGet(`product/count`);
    setProductCount(productCount);
    const userCount = await HandleApi.APIGet(`user/count`);
    setUserCount(userCount);
    const transactionCount = await HandleApi.APIGet(`transaction/count`);
    setTransactionCount(transactionCount);
    const value = await HandleApi.APIGet(`transaction/sum`);
    setTransactionValue(value);
    const rawDashboard = await HandleApi.APIGet(`transaction/monthlyTransaction`);
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyTransactionData = {
      labels,
      datasets: {
        label: "Transacton",
        data: labels?.map((label) => {
          for (let i = 0; i < rawDashboard?.length; i++) {
            if (label == rawDashboard[i].month) {
              return +rawDashboard[i].count;
            }
          }

          return 0;
        }),
      },
    };

    setMonthlyTransaction(monthlyTransactionData);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="shopping_bag"
                title="Product"
                count={productCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="person_filled" title="Users" count={userCount} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="receipt_long"
                title="Transaction"
                count={transactionCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="paid"
                title="Value"
                count={`${transactionValue.toFixed(6)}`}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Monthly transaction"
                  description={<>Transaction is created every month</>}
                  date="updated 4 min ago"
                  chart={monthlyTransaction}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Projects />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
