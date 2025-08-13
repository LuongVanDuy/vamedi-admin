"use client";
import React, { useState } from "react";

import { CustomSelect } from "@/components/Form/CustomSelect";
import CustomTabs from "@/components/Form/CustomTabs";
import CustomPagination from "@/components/Form/CustomPagination";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrderList } from "@/core/api/order.api";
import { deleteOrder } from "@/core/api/order.api";
import Image from "next/image";
import CustomTag from "@/components/Form/CustomTag";
import { formatCurrency, formatTextDate } from "@/core/helper/utility";
import trash from "@/assets/trash.svg";
import { useRouter } from "next/navigation";
import { message } from "antd";

const tabs = [
  { key: "", label: "All order" },
  { key: "awaiting", label: "Awaiting" },
  { key: "ready", label: "Getting ready" },
  { key: "done", label: "Order delivered" },
  { key: "rework", label: "Rework requested" },
];

const options = [
  { value: true, label: "Newest First" },
  { value: false, label: "Oldest First" },
];

const color: any = {
  DONE: "success",
  AWAITING: "warning",
  READY: "processing",
  REWORK: "volcano",
};

const title: any = {
  DONE: "completed",
  AWAITING: "awaiting",
  READY: "ready",
  REWORK: "rework",
};

const Card = ({
  name,
  categories,
  status,
  price,
  style,
  quantity = 1,
  id,
  date,
  refetch,
  mail,
}: {
  name: string;
  categories: string;
  status: string;
  price?: number;
  style: string;
  quantity: number;
  id: string;
  date: any;
  refetch: any;
  mail?: string;
}) => {
  const router = useRouter();
  const isDone = status === "DONE" || status === "READY";

  const { mutate: deleteMutation, isLoading: isLoading } = useMutation({
    mutationFn: (id: any) => deleteOrder(id, true),
    onSuccess: () => {
      message.success("Success!");
      refetch();
    },
    onError: (err: any) => {
      message.error(err?.message || "Failed!");
    },
  });

  const handleDelete = () => {
    deleteMutation(id);
  };

  return (
    <>
      <div
        onClick={() => router.push(`order/${id}`)}
        className="rounded-lg bg-[#fbfbfb] hidden md:block cursor-pointer"
      >
        <div className="flex justify-between py-4 px-6 border-b-[1px] border-[#f4f4f4] items-center">
          <div className="flex gap-12">
            <h1 className="text-[#212529] font-medium">{name}</h1>
            <h1 className="text-[#343a40]">{categories}</h1>
            <h1 className="text-blue-500">{mail}</h1>
          </div>
          <div className="flex items-center gap-1">
            <h1 className="uppercase text-[#6C757D] text-[12px]">Status</h1>
            <CustomTag title={title[status] || "awaiting"} color={color[status] || "warning"} />
          </div>
        </div>

        <div className="p-6 flex justify-between gap-12 flex-wrap">
          <div className="flex gap-6 flex-wrap">
            <div>
              <h1 className="text-[#6C757D] text-[12px] uppercase">Style</h1>
              <h2 className="text-[#212529]">{style}</h2>
            </div>
            <div>
              <h1 className="text-[#6C757D] text-[12px] uppercase">Quantity</h1>
              <h2 className="text-[#212529]">
                {quantity ? `${quantity} ${categories === "Property Videos" ? "videos" : "images"}` : "----"}
              </h2>
            </div>
            <div>
              <h1 className="text-[#6C757D] text-[12px] uppercase">Order ID</h1>
              <h2 className="text-[#212529]">{id}</h2>
            </div>
            <div>
              <h1 className="text-[#6C757D] text-[12px] uppercase">Placed on</h1>
              <h2 className="text-[#212529]">{formatTextDate(date)}</h2>
            </div>
            <div>
              <h1 className="text-[#6C757D] text-[12px] uppercase">Total</h1>
              <h2 className="text-[#212529]">{price ? formatCurrency(price) : "----"}</h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="delete"
              disabled={isDone || isLoading}
              className={`rounded-lg h-[48px] w-[48px] flex items-center justify-center border-[1px] border-[#dc3545]  ${
                isDone ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
              }`}
              onClick={handleDelete}
            >
              <Image src={trash} alt="icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-[#fbfbfb] block md:hidden mb-6">
        <div className="flex justify-between py-3 px-4 border-b-[1px] border-[#f4f4f4] items-center">
          <h1 className="text-[#212529] font-medium">{name}</h1>
          <CustomTag title={title[status] || "awaiting"} color={color[status] || "warning"} />
        </div>
        <div className="p-6 gap-6 flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex">
              <h1 className="text-[#6C757D] text-[12px] uppercase w-2/5">Style</h1>
              <h2 className="text-[#212529] w-3/5">{style}</h2>
            </div>
            <div className="flex">
              <h1 className="text-[#6C757D] text-[12px] uppercase w-2/5">Place on</h1>
              <h2 className="text-[#212529] w-3/5">{date}</h2>
            </div>
            <div className="flex">
              <h1 className="text-[#6C757D] text-[12px] uppercase w-2/5">Service</h1>
              <h2 className="text-[#212529] w-3/5">{categories}</h2>
            </div>
            <div className="flex">
              <h1 className="text-[#6C757D] text-[12px] uppercase w-2/5">quantity</h1>
              <h2 className="text-[#212529] w-3/5">{quantity ? `${quantity} images` : "----"}</h2>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-primary ">{price ? formatCurrency(price) : "----"}</div>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="delete"
                disabled={isDone || isLoading}
                className={`rounded-lg h-[36px] w-[36px] flex items-center justify-center border-[1px] border-[#dc3545]  ${
                  isDone ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
                }`}
                onClick={handleDelete}
              >
                <Image src={trash} alt="icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Order = () => {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    itemsPerPage: 10,
    status: "",
    sortBy: "createdTime",
    sortDesc: true,
  });

  const currentTab = tabs.find((tab) => tab.key === formFilter.status) || { label: "All order" };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ORDER", formFilter],
    queryFn: () => getOrderList(formFilter),
    refetchOnWindowFocus: true,
  });

  const handleTabChange = (key: string) => {
    setFormFilter((prev) => ({
      ...prev,
      status: key,
    }));
  };

  return (
    <>
      <div className="min-h-[calc(100vh-24px)] w-full px-4 md:px-6 bg-[#fbfbfb] flex flex-col gap-9 md:gap-12">
        <div className="pt-4 md:pt-0 mb-[-20px] md:mb-0">
          <h1 className="text-[#212529] font-medium text-[24px]">All orders</h1>
        </div>

        <div className="flex flex-col gap-6 mb-6">
          <CustomTabs tabs={tabs} onChange={handleTabChange} activeKey={formFilter.status} />

          <div className="card flex flex-col gap-4 md:gap-6">
            <div className="flex justify-between items-center">
              <h1>{currentTab.label}</h1>
              <div className="flex gap-4 items-center text-[#6C757D] whitespace-nowrap">
                <h1>Sort by</h1>
                <CustomSelect
                  options={options}
                  onChange={(selectedValue) => {
                    setFormFilter((prev) => ({
                      ...prev,
                      sortDesc: selectedValue,
                    }));
                  }}
                  value={formFilter.sortDesc}
                />
              </div>
            </div>

            {data?.data?.list.map((item: any, index: number) => (
              <Card
                key={index}
                name={item.projectName}
                categories={item.service}
                status={item.status}
                price={item.orderTotal}
                style={item.designStyle}
                quantity={item.quantity}
                id={item.id}
                date={item.createdTime}
                refetch={refetch}
              />
            ))}

            <CustomPagination
              page={formFilter.page}
              pageSize={formFilter.itemsPerPage}
              total={data?.data?.count}
              setPage={(value) => setFormFilter({ ...formFilter, page: value })}
              setPerPage={(value) => setFormFilter({ ...formFilter, itemsPerPage: value })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
