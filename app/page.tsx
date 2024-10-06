import BasicSideBar from "@/components/layouts/BasicSideBar";
import ContentArea from "@/components/structure/ContentArea";
import MainMenu from "@/components/structure/MainMenu";
import SideBarNavigation from "@/components/structure/SideBarNavigation";
import { serverActions } from "@/serverActions/serverActions";

export default function Home() {
  return (
    <div className="flex flex-col select-none p-2 bg-zinc-200">
      <div className="px-2">
        <MainMenu />
      </div>
      <BasicSideBar sidebar={<SideBarNavigation />} content={<ContentArea />} />
    </div>
  );
}
