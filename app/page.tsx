import BasicSideBar from "@/components/layouts/BasicSideBar";
import SideBarNavigation from "@/components/structure/SideBarNavigation";

export default function Home() {
  return (
    <div className="flex flex-col select-none">
      <BasicSideBar sidebar={<SideBarNavigation />} />
    </div>
  );
}
