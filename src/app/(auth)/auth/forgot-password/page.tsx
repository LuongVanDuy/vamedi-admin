"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Label from "@/components/Form/CustomLabel";
import { CustomInput } from "@/components/Form/CustomInput";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import gg from "@/assets/google.svg";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/Form/InputError";
import { forgetPassword } from "@/core/api/auth.api";
import Link from "next/link";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required!"),
});

const ForgotPassword = () => {
  const router = useRouter();

  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { mutate: forgotMutation, isPending: isLoading } = useMutation({
    mutationFn: (data: any) => forgetPassword(data),
    onSuccess() {
      message.success("Thành công!");
      router.push("/auth/login");
    },
    onError(err: any) {
      message.error(err.response?.data?.message);
    },
  });

  const onSubmit = () => {
    const data = getValues();
    forgotMutation(data);
  };

  return (
    <>
      <div className="mx-auto flex flex-col gap-8 sm:w-auto 2xs:w-[390px] pb-12 pt-12 md:pt-[64px] px-4">
        <div className="text-center">
          <h1 className="text-[#212529] font-medium sm:text-[24px] md:text-[36px] mb-6">Forgot password</h1>
          <h2 className="text-[#6c757d] ">Forgot your password to login</h2>
        </div>

        <div className="flex flex-col gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div>
                <Label label="Email" />
                <CustomInput
                  className="!h-12 w-[390px] bg-[#FBFBFB]"
                  placeholder="Enter your email"
                  onChange={onChange}
                  value={value}
                />
                <InputError error={errors.email?.message} />
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="btn-primary h-12 flex items-center justify-center !font-medium"
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? <Spin indicator={<LoadingOutlined spin style={{ color: "white" }} />} /> : <>Submit</>}
          </div>

          <div className="relative mx-auto w-full">
            <h6 className="text-[#6C757D] text-[14px] text-center relative">
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 md:w-[160px] w-[150px] h-[1px] bg-[#DEE2E6]"></span>
              Or
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 md:w-[160px] w-[150px] h-[1px] bg-[#DEE2E6]"></span>
            </h6>
          </div>

          <div className="h-12 border-[1px] border-[#dee2e6] flex justify-center items-center rounded-lg font-medium text-[#495057]">
            <div>
              <Image src={gg} alt="icon" className="mr-2" />
            </div>{" "}
            Sign in with Google
          </div>
        </div>

        <div className="text-center text-[#495057] text-[14px]">
          Already registered?{" "}
          <Link href="/auth/login" className="text-primary font-medium text-[14px]">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
