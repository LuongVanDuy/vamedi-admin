"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { message, Spin, Skeleton } from "antd";
import Label from "@/components/Form/CustomLabel";
import { CustomInput } from "@/components/Form/CustomInput";
import { LoadingOutlined } from "@ant-design/icons";
import CustomUpload from "@/components/Form/CustomUpload";

import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/Form/InputError";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserDetail, updateUser } from "@/core/api/user.service";

const DetailUser = ({ id }: { id: any }) => {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["DETAIL_USER", id],
    queryFn: () => getUserDetail(id),
    enabled: !!id,
  });

  const detail = data?.data;

  const {
    getValues,
    setValue,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: detail?.name || "",
      lastName: detail?.lastName || "",
      email: detail?.email || "",
      phone: detail?.phone || "",
      avatar: detail?.avatar || "",
      companyName: detail?.companyName || "",
      companyURL: detail?.companyURL || "",
    },
  });

  useEffect(() => {
    if (detail) {
      reset({
        name: detail?.name,
        lastName: detail?.lastName,
        email: detail?.email,
        phone: detail?.phone,
        avatar: detail?.avatar,
        companyName: detail?.companyName,
        companyURL: detail?.companyURL,
      });
    }
  }, [detail, reset]);

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (payload: any) => updateUser(id, payload),
    onSuccess: () => {
      message.success("Success!");
      refetch();
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (formData: any) => {
    const payload = {
      avatar: formData.avatar || "",
      name: formData.name || "",
      lastName: formData.lastName || "",
      phone: formData.phone || "",
      companyName: formData.companyName || "",
      companyURL: formData.companyURL || "",
    };
    updateMutation(payload);
  };

  return (
    <>
      <div className="w-full h-[100vh] px-4 md:px-6 bg-[#fbfbfb] flex flex-col gap-6 md:gap-8 mb-6">
        {isLoading ? (
          <Skeleton active style={{ height: "400px" }} />
        ) : (
          <>
            <div className="flex justify-between items-center pt-4 md:pt-0">
              <h1 className="text-[#212529] font-medium text-[24px]">{detail?.name}</h1>

              <div className="flex gap-2">
                <button onClick={() => router.back()} className="btn-secondary" type="button">
                  Cancel
                </button>
                <button onClick={handleSubmit(onSubmit)} className="btn-primary" type="button" disabled={isUpdating}>
                  {isUpdating ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : "Save"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <Label label="Avatar:" />
                  <Controller
                    name="avatar"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomUpload
                        value={value || null}
                        onChange={onChange}
                        listType="picture-circle"
                        style={{ width: 200, height: 200 }}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-400 mt-2">PNG/JPG, square image recommended</p>
                </div>

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label label="First name" required />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Enter first name"
                          onChange={onChange}
                          value={value}
                          autoComplete="given-name"
                        />
                        <InputError error={errors.name?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label label="Last name" required />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Enter last name"
                          onChange={onChange}
                          value={value}
                          autoComplete="family-name"
                        />
                        <InputError error={errors.lastName?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label label="Email" />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Email"
                          onChange={onChange}
                          value={value ?? ""}
                          disabled
                        />
                        <InputError error={errors.email?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label label="Phone" />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Enter phone"
                          onChange={onChange}
                          value={value ?? ""}
                          autoComplete="tel"
                        />
                        <InputError error={errors.phone?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label label="Company Name" />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Enter company name"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.companyName?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="companyURL"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label label="Company URL" />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Enter company URL"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.companyURL?.message} />
                      </div>
                    )}
                  />
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default DetailUser;
