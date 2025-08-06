"use client";
import React, { useState } from "react";
import Image from "next/image";

import { useRecoilValue } from "recoil";
import { profileState } from "@/core/recoil/state";

import card from "@/assets/cardIcon.svg";
import flag from "@/assets/flagIcon.svg";
import done from "@/assets/doneIcon.svg";
import rework from "@/assets/reworkIcon.svg";

import { useQuery } from "@tanstack/react-query";
import { getOrderList, getOrderStatus } from "@/core/api/order.service";
import { useRouter } from "next/navigation";

const getStatusColor = (status: string) => {
  switch (status) {
    case "AWAITING":
      return "#FFC107";
    case "READY":
      return "#0DCAF0";
    case "DONE":
      return "#198754";
    case "REWORK":
      return "#FD7E14";
    default:
      return "#FFC107";
  }
};

const Dashboard = () => {
  const profile = useRecoilValue(profileState);
  const router = useRouter();
  const [formFilter, setFormFilter] = useState({
    page: 1,
    itemsPerPage: 4,
    status: "",
    sortBy: "createdTime",
    sortDesc: true,
  });

  const { data } = useQuery(["ORDER", formFilter], () => getOrderList(formFilter), {
    refetchOnWindowFocus: true,
  });

  const { data: responseData } = useQuery(["ORDER_COUNT"], () => getOrderStatus(), {
    refetchOnWindowFocus: true,
  });

  const countData: any = responseData || [];

  const statusData = [
    { status: "AWAITING", label: "Awaiting payment", icon: card },
    { status: "READY", label: "Getting ready", icon: flag },
    { status: "DONE", label: "Order delivered", icon: done },
    { status: "REWORK", label: "Rework requested", icon: rework },
  ];

  return (
    <div
      style={{ minHeight: "calc(100vh - 24px)" }}
      className="w-full px-4 md:px-6 bg-[#fbfbfb] flex flex-col gap-9 md:gap-12"
    >
      <div className="pt-4 md:pt-0 mb-[-20px] md:mb-0">
        <h1 className="text-[#212529] font-medium text-[24px]">
          {profile?.data ? `Welcome, ${profile?.data?.name}` : "Welcome, Guest"}
        </h1>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <div className="card hidden md:grid grid-cols-4">
          {statusData.map((item) => {
            const count = countData?.find((data: any) => data.status === item.status)?.count || 0;

            return (
              <div key={item.status} className="p-6 flex flex-col gap-4 border-l-[1px] border-[#FBFBFB]">
                <div className="flex items-center text-[#343A40] text-[14px]">
                  <Image src={item.icon} alt="icon" className="mr-2" />
                  {item.label}
                </div>
                <h1 className="ml-12 text-[36px] font-medium text-[#212529]">{count}</h1>
              </div>
            );
          })}
        </div>

        <div className="card grid md:hidden grid-cols-2">
          {statusData.map((item) => {
            const count = countData?.find((data: any) => data.status === item.status)?.count || 0;

            return (
              <div
                key={item.status}
                className={`p-4 flex flex-col gap-2 border-[1px] ${
                  item.status === "AWAITING" || item.status === "READY" ? "border-t-0" : ""
                } ${
                  item.status === "READY" || item.status === "REWORK" ? "border-r-0" : "border-l-0"
                } border-[#FBFBFB]`}
              >
                <div className="flex items-center">
                  <Image src={item.icon} alt="icon" className="mr-2" />
                  <h1 className="text-[36px] font-medium text-[#212529]">{count}</h1>
                </div>
                <h1 className="text-[#343A40] text-[14px]">{item.label}</h1>
              </div>
            );
          })}
        </div>

        <div className="card gap-4 md:gap-6 flex flex-col">
          <h1 className="text-[#212529] text-[14px]">Recent activity</h1>
          {data?.data?.list.map((item: any) => {
            const statusColor = getStatusColor(item.status);

            return (
              <div
                key={item.id}
                onClick={() => router.push(`order/${item.id}`)}
                className="card-2 flex flex-wrap justify-between gap-6 cursor-pointer"
              >
                <div className="flex gap-4 md:gap-8 lg:gap-12 flex-wrap">
                  <div>
                    <h1 className="uppercase text-[#6C757D] text-[12px]">Project name</h1>
                    <h2 className="text-[#212529] font-medium">{item.projectName}</h2>
                  </div>
                  <div>
                    <h1 className="uppercase text-[#6C757D] text-[12px]">Service</h1>
                    <h2 className="text-[#212529]">{item.service}</h2>
                  </div>
                  <div className="hidden md:block">
                    <h1 className="uppercase text-[#6C757D] text-[12px]">Order ID</h1>
                    <h2 className="text-[#212529]">{item.id}</h2>
                  </div>
                  <div>
                    <h1 className="uppercase text-[12px]">Status</h1>
                    <h2 className="font-medium" style={{ color: statusColor }}>
                      {item.status}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
