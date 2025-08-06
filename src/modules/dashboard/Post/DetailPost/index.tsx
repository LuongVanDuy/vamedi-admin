"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { message, Spin, Skeleton } from "antd";
import Label from "@/components/Form/CustomLabel";
import { CustomInput } from "@/components/Form/CustomInput";
import { LoadingOutlined } from "@ant-design/icons";

import schema from "../schema";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/Form/InputError";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getBlogById, updateBlog } from "@/core/api/blog.service";
import { getTagsList } from "@/core/api/tag.service";
import { CustomSelect } from "@/components/Form/CustomSelect";

const Detail = ({ id }: { id: any }) => {
  const router = useRouter();
  const [formFilter, setFormFilter] = useState({
    page: 1,
    itemsPerPage: 9999,
  });

  const { data, isLoading, refetch } = useQuery(["DETAIL_BLOG"], () => getBlogById(id), {
    enabled: !!id,
  });

  const { data: tagData } = useQuery(["TAG", formFilter], () => getTagsList(formFilter), {
    refetchOnWindowFocus: true,
  });

  const detail = data?.data;

  const {
    getValues,
    setValue,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (detail) {
      reset({
        title: detail?.title,
        slug: detail?.slug,
        content: detail?.content,
        thumbnail: detail?.thumbnail,
        shortDesc: detail?.shortDesc,
        tags: detail?.tags[0].id,
      });
    }
  }, [detail, reset]);

  const title = watch("title");

  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setValue("slug", generatedSlug);
    }
  }, [title, setValue]);

  const { mutate: updateMutation, isLoading: isUpdating } = useMutation((data: any) => updateBlog(id, data), {
    onSuccess: () => {
      message.success("Success!");
      refetch();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message);
    },
  });

  const onSubmit = () => {
    const data = getValues();

    const submitedData = {
      ...data,
      tags: data.tags ? [parseInt(data.tags, 10)] : [],
    };

    updateMutation(submitedData);
  };

  const handleChangeDescription = (value: string) => {
    setValue("content", value, { shouldValidate: true });
  };

  return (
    <>
      <div className="create-order w-full px-4 md:px-6 bg-[#fbfbfb] flex flex-col gap-9 md:gap-12 mb-6">
        {isLoading ? (
          <Skeleton active style={{ height: "400px" }} />
        ) : (
          <>
            <div className="flex justify-between pt-4 md:pt-0 mb-[-20px] md:mb-0">
              <h1 className="text-[#212529] font-medium text-[24px]">{detail?.title}</h1>

              <div className="flex gap-2">
                <div onClick={() => router.back()} className="btn-secondary">
                  Cancel
                </div>

                <div onClick={handleSubmit(onSubmit)} className="btn-primary">
                  {isUpdating ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : "Save"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <Controller
                  name="title"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-1 md:col-span-2">
                      <Label label="Title" required />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Enter title post"
                        onChange={onChange}
                        value={value}
                      />
                      <InputError error={errors.title?.message} />
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="slug"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-1 md:col-span-2">
                      <Label label="Slug" required />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Enter slug post"
                        onChange={onChange}
                        value={value}
                      />
                      <InputError error={errors.slug?.message} />
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="shortDesc"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-1 md:col-span-2">
                      <Label label="Short description" required />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Enter short description"
                        onChange={onChange}
                        value={value}
                      />
                      <InputError error={errors.shortDesc?.message} />
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-1 md:col-span-2">
                      <Label label="Thumbnail" />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Enter thumbnail post"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.thumbnail?.message} />
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-1 md:col-span-2">
                      <Label label="Tag" />
                      <CustomSelect
                        placeholder="Select post tag"
                        className={`suffix-icon h-11 !rounded`}
                        onChange={onChange}
                        value={value}
                        options={tagData?.data?.list?.map((item: any) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                      />
                      <InputError error={errors.tags?.message} />
                    </div>
                  )}
                />
              </div>

              <div>
                <Label label="Content" required />

                <ReactQuill
                  value={getValues("content")}
                  onChange={handleChangeDescription}
                  modules={{ toolbar: true }}
                  placeholder="Enter blog content"
                  className="bg-white "
                />
                <InputError error={errors.content?.message} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Detail;
