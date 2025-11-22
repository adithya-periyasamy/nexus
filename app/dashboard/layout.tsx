import DashboardProvider from "./Provider";

type Props = {};

const DashboardLayout = ({ children }: any) => {
  return (
    <div>
      <DashboardProvider>{children}</DashboardProvider>
    </div>
  );
};

export default DashboardLayout;
