import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@/components/userbutton";

type Props = {};

const AppHeader = (props: Props) => {
  return (
    <div className="flex items-center justify-between w-full p-4 shadow bg-sidebar">
      <SidebarTrigger />
      <UserButton />
    </div>
  );
};

export default AppHeader;
