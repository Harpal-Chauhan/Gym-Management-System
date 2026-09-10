import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InviteUser from "./pages/InviteUser";
import InviteList from "./pages/InviteList";
import Members from "./pages/members/Members";
import AddMember from "./pages/members/AddMember";
import EditMember from "./pages/members/EditMember";
import SignUpForm from "./pages/SignUpForm";
import Products from "./pages/Products";
import Payment from "./pages/Payment";

import ProtectedRout from "./components/ProtectedRout";
import RoleRoute from "./components/RoleRoute";
import Navbar from "./components/Navbar";
import CheckIn from "./pages/CheckIn";
import Calender from "./pages/Calender";
import Billing from "./pages/Billing";
import Analytics from "./pages/Analytics";
import Setting from "./pages/Setting";
import Landing from "./pages/Landing";

const AppLayout = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/"

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element = {<Landing />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRout>
              <Dashboard />
            </ProtectedRout>
          }
        />

        <Route
          path="/invite-user"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin"]}>
                <InviteUser />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route
          path="/invite-list"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin"]}>
                <InviteList />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <Members />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route
          path="/add-member"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <AddMember />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route
          path="/members/edit/:id"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <EditMember />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route
          path="/signup-form"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["member"]}>
                <SignUpForm />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <Products />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <Payment />
              </RoleRoute>
            </ProtectedRout>
          }
        />

        <Route 
          path="/check-in"
          element = {
            <ProtectedRout>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <CheckIn />
              </RoleRoute>
            </ProtectedRout>
          }
        />

          <Route 
            path="/calendar"
            element = {
              <ProtectedRout>
                <Calender />
              </ProtectedRout>
            }
          />

          <Route 
            path="/billing"
            element = {
              <ProtectedRout>
                <RoleRoute allowedRoles={["member"]}>
                  <Billing />
                </RoleRoute>
              </ProtectedRout>
            }
          />

          <Route 
            path="/analytics"
            element = {
              <ProtectedRout>
                <RoleRoute allowedRoles={["admin"]}>
                  <Analytics />
                </RoleRoute>
              </ProtectedRout>
            }
          />

          <Route 
            path="/settings"
            element = {
              <ProtectedRout>
                <Setting />
              </ProtectedRout>
            }
          />

      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
