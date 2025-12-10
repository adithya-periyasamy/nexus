import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import AgentsSkeleton from "./AgentsSkeleton";
import MyAgentsServer from "./MyAgentsServer";

const AiAgentTab = () => {
  return (
    <>
      <div className="px-10 md:px-24 lg:px-32 mt-20">
        <Tabs defaultValue="myagent" className="w-full">
          <TabsList>
            <TabsTrigger value="myagent">My Agents</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
          </TabsList>
          <TabsContent value="myagent">
            <Suspense fallback={<AgentsSkeleton />}>
              <MyAgentsServer />
            </Suspense>
          </TabsContent>
          <TabsContent value="template">Coming soon...</TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AiAgentTab;
