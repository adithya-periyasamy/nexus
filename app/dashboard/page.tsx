import AiAgentTab from "./_components/AiAgentTab";
import CreateAgentSection from "./_components/CreateAgentSection";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <div>
      <CreateAgentSection />
      <AiAgentTab />
    </div>
  );
};

export default Dashboard;
