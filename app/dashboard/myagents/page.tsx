import { Tabs, TabsContent } from "@/components/ui/tabs";
import MyAgentsServer from "../_components/MyAgentsServer";

const page = () => {
  return (
    <>
      <div className="px-10 md:px-24 lg:px-32 mt-20">
        <Tabs defaultValue="myagent" className="w-full">
          <h1 className="w-full font-bold text-3xl">My Agents</h1>

          <TabsContent value="myagent">
            {/* <MyAgents /> */}
            <MyAgentsServer />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
