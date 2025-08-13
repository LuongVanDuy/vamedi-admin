"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Label from "@/components/Form/CustomLabel";
import { CustomInput } from "@/components/Form/CustomInput";
import InputError from "@/components/Form/InputError";
import CustomUpload from "@/components/Form/CustomUpload";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/core/api/user.api";

const schema = yup.object({
  avatar: yup.string().nullable().optional(),
  name: yup.string().required("Name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().optional(),
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
  companyName: yup.string().optional(),
});

type FormValues = yup.InferType<typeof schema>;

const Page = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      avatar: null,
      name: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      companyName: "",
    },
  });

  const { mutate: createMutation, isLoading: isCreating } = useMutation({
    mutationFn: (payload: any) => createUser(payload),
    onSuccess: () => {
      message.success("Success!");
      router.push("/user");
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message ?? "Failed!");
    },
  });

  const onSubmit = (data: FormValues) => {
    createMutation({
      avatar: data.avatar || "",
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      companyName: data.companyName,
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-24px)] px-4 md:px-6 bg-[#fbfbfb] flex flex-col gap-6 md:gap-8 mb-6">
      <div className="flex items-center justify-between pt-4 md:pt-0">
        <h1 className="text-[#212529] font-medium text-[24px]">Create new user</h1>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit(onSubmit)} className="btn-primary" disabled={isCreating}>
            {isCreating ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : "Create"}
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
                  className="border rounded-lg"
                  style={{ width: 200, height: 200 }}
                />
              )}
            />
            <p className="text-xs text-gray-400 mt-2">PNG/JPG, recommended square image</p>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <Label label="First name" required />
                  <CustomInput
                    className="suffix-icon h-11 !rounded"
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
                    className="suffix-icon h-11 !rounded"
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
                  <Label label="Email" required />
                  <CustomInput
                    className="suffix-icon h-11 !rounded"
                    placeholder="Enter email"
                    onChange={onChange}
                    value={value}
                    autoComplete="email"
                  />
                  <InputError error={errors.email?.message} />
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <Label label="Password" required />
                  <CustomInput
                    type="password"
                    className="suffix-icon h-11 !rounded"
                    placeholder="Enter password"
                    onChange={onChange}
                    value={value}
                    autoComplete="new-password"
                  />
                  <InputError error={errors.password?.message} />
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
                    className="suffix-icon h-11 !rounded"
                    placeholder="Enter phone"
                    onChange={onChange}
                    value={value}
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
                    className="suffix-icon h-11 !rounded"
                    placeholder="Enter company name"
                    onChange={onChange}
                    value={value}
                  />
                  <InputError error={errors.companyName?.message} />
                </div>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
