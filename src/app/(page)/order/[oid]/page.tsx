"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Label from "@/components/Form/CustomLabel";
import { LoadingOutlined } from "@ant-design/icons";
import { CustomInput } from "@/components/Form/CustomInput";
import { message, Skeleton, Spin } from "antd";
import { formatCurrency, formatTextDate, formatTime } from "@/core/helper/utility";
import CustomTag from "@/components/Form/CustomTag";

import { useMutation, useQuery } from "@tanstack/react-query";
import { updateOrder, getOrderDetail } from "@/core/api/order.api";
import { getFeedback } from "@/core/api/auth.api";

const color: any = {
  DONE: "success",
  AWAITING: "warning",
  READY: "processing",
  REWORK: "volcano",
};

const title: any = {
  DONE: "completed",
  AWAITING: "awaiting payment",
  READY: "ready",
  REWORK: "rework",
};

const DetailOrder = () => {
  const router = useRouter();
  const { oid } = useParams();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["ORDER", oid],
    queryFn: () => getOrderDetail(oid),
    enabled: !!oid,
  });
  const orderData = data?.data;

  useEffect(() => {
    if (orderData) {
      setImageUrl(orderData.photoCompleted);
    }
  }, [orderData]);

  const { data: feedback, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ["FEEDBACK", oid],
    queryFn: () => getFeedback(oid),
    enabled: !!oid,
  });

  const validateImageUrl = (url: string) => {
    const isValidUrl = /^https?:\/\/.+\..+/i.test(url);
    if (!url) {
      setError("Product image is required.");
    } else if (!isValidUrl) {
      setError("Invalid URL. Please provide a valid link.");
    } else {
      setError(null);
    }
  };

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateOrder(data, oid),
    onSuccess: () => {
      refetch();
      router.push("/order");
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message);
      console.error(err?.response?.data?.message);
    },
  });

  const handleUpdate = () => {
    const isValidUrl = /^https?:\/\/.+\..+/i.test(imageUrl);
    if (!imageUrl) {
      setError("Product image is required.");
      return;
    } else if (!isValidUrl) {
      setError("Invalid URL. Please provide a valid link.");
      return;
    } else {
      setError(null);
    }
    const submitData = {
      ...orderData,
      status: "DONE",
      photoCompleted: imageUrl,
    };

    updateMutation(submitData);
  };

  return (
    <>
      <div className="create-order w-full px-4 md:px-6 relative flex flex-col flex-grow">
        {isLoading ? (
          <Skeleton active style={{ height: "400px" }} />
        ) : (
          <>
            <div className="flex justify-between pt-4 md:pt-0 mb-[-20px] md:mb-0">
              <h1 className="text-[#212529] font-medium text-[24px]">Order: {orderData?.projectName}</h1>

              <div className="flex gap-2">
                <div onClick={() => router.back()} className="btn-secondary">
                  Cancel
                </div>

                <div
                  className={`${
                    orderData?.status === "DONE" || orderData?.status === "AWAITING"
                      ? "opacity-50 cursor-not-allowed disabled:"
                      : ""
                  }`}
                >
                  <div
                    onClick={orderData?.status === "DONE" || orderData?.status === "AWAITING" ? () => {} : handleUpdate}
                    className="btn-primary"
                  >
                    {isUpdating ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : "Completed"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 ">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Order Id</h1>
                  <h2 className="text-[#343A40]">{orderData?.id}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Customer uploaded Image</h1>
                  <h2 className="text-[#343A40]">{orderData?.uploadImage}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Service</h1>
                  <h2 className="text-[#343A40]">{orderData?.service}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Sub service</h1>
                  <h2 className="text-[#343A40]">{orderData?.subService}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Design style</h1>
                  <h2 className="text-[#343A40]">{orderData?.designStyle}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Additional Service</h1>
                  <h2 className="text-[#343A40]">{orderData?.additionalService}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Quantity</h1>
                  <h2 className="text-[#343A40]">{orderData?.quantity}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Photo Detail</h1>
                  <h2 className="text-[#343A40]">{orderData?.photoDetail}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Photo Detail</h1>
                  <h2 className="text-[#343A40]">{orderData?.styleDetail}</h2>
                </div>
                <div>
                  <h1 className="text-[#6C757D] text-[12px] uppercase">Placed on</h1>
                  <h2 className="text-[#343A40]">{formatTextDate(orderData?.createdTime)}</h2>
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Status</h1>
                  <CustomTag title={title[orderData?.status]} color={color[orderData?.status]} />
                </div>
                <div>
                  <h1 className="uppercase text-[#6C757D] text-[12px]">Add On Services</h1>
                  <ul className="text-[#343A40] list-disc pl-5">
                    {orderData?.addOnService &&
                      JSON.parse(orderData.addOnService).map((service: any, index: number) => (
                        <li key={index}>{service}</li>
                      ))}
                  </ul>
                </div>
              </div>

              <h1 className="text-primary font-medium text-[32px]">{formatCurrency(orderData?.orderTotal)}</h1>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label label="Product Image URL" required />
              <CustomInput
                className={`suffix-icon h-11 !rounded`}
                placeholder="Enter product image"
                onChange={(value) => {
                  setImageUrl(value);
                  validateImageUrl(value);
                }}
                value={imageUrl}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* <div className="flex flex-col gap-4 my-6">
              {isLoadingFeedback ? (
                <Skeleton active style={{ height: "400px" }} />
              ) : (
                feedback?.data?.list?.map((item: any, index: number) => (
                  <div key={index} className="rounded-xl bg-white p-4">
                    <div>
                      <h1 className="text-[#6C757D] text-[12px] uppercase">Placed on</h1>
                      <h2 className="text-[#343A40]">{formatTime(item.createdTime)}</h2>
                    </div>
                    <div>
                      <h1 className="uppercase text-[#6C757D] text-[12px]">Feedback content</h1>
                      <h2 className="text-[#343A40]">{item.content}</h2>
                    </div>
                  </div>
                ))
              )}
            </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default DetailOrder;
