"use client";
import {
  Calendar,
  ChartBar,
  Coins,
  MousePointerClick,
  NotepadText,
  ScanBarcode,
  SearchCode,
} from "lucide-react";
import { title } from "process";
import React, { useState } from "react";
import RecentProfits from "../Sidebar/content/RecentProfits";
import Sidebar from "../Sidebar/Sidebar";

type Props = {};

const SideBarNavigation = (props: Props) => {
  const [selected, setSelected] = useState("");

  const menu = [
    {
      name: "recentProfits",
      title: "Recent Profits",
      icon: <Coins />,
      content: <RecentProfits />,
    },
    {
      name: "todayInteractions",
      title: "Today Interactions",
      icon: <MousePointerClick />,
    },
    {
      name: "accounts",
      title: "Accounts",
      icon: <ChartBar />,
    },
    {
      name: "monthOverview",
      title: "Month Overview",
      icon: <Calendar />,
    },
    {
      name: "quickSearch",
      title: "Quick Search",
      icon: <SearchCode />,
    },
    {
      name: "notes",
      title: "Notes",
      icon: <NotepadText />,
    },
    {
      name: "Scan history",
      title: "Scan history",
      icon: <ScanBarcode />,
    },
  ];

  const handleClick = (item: {
    name: string;
    title: string;
    icon: React.ReactNode;
  }) => {
    setSelected(item.name);
  };

  return (
    <div>
      <div>
        {menu.map((item) => {
          return (
            <Sidebar key={item.name} content={item.content} title={item.title}>
              <div
                key={item.name}
                onClick={() => handleClick(item)}
                className={`p-2 flex items-center gap-2 cursor-pointer hover:bg-interface-hover rounded w-full`}
              >
                <div>{item.icon}</div>
                <div>{item.title}</div>
              </div>
            </Sidebar>
          );
        })}
      </div>
    </div>
  );
};

export default SideBarNavigation;
