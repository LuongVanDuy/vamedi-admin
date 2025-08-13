"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { message, Switch, Table, Input } from "antd";
import CustomPagination from "@/components/Form/CustomPagination";
import DeleteModal from "@/components/Form/CustomModal/DeleteModal";

import editIcon from "@/assets/editBlue.svg";
import deleteIcon from "@/assets/deleteRed.svg";
import search from "@/assets/Search.svg";
import addIcon from "@/assets/plus.svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserList, deleteUser, enableUser, disableUser } from "@/core/api/user.api";

const User = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    itemsPerPage: 20,
    search: "",
    status: null,
    sortBy: "createdTime",
    sortDesc: null,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["USER", formFilter],
    queryFn: () => getUserList(formFilter),
  });

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: (id: any) => deleteUser(id),
    onSuccess: () => {
      message.success("Success!");
      setItem(null);
      refetch();
      setOpen(false);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message);
    },
  });

  const onDelete = () => {
    deleteMutation(item?.id);
  };

  const handleDelete = (record: any) => {
    setItem(record);
    setOpen(true);
  };

  const { mutate: enableMutation } = useMutation({
    mutationFn: (id: any) => enableUser(id),
    onSuccess: () => {
      message.success("Success!");
      setItem(null);
      refetch();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message);
    },
  });

  const { mutate: disableMutation } = useMutation({
    mutationFn: (id: any) => disableUser(id),
    onSuccess: () => {
      message.success("Success!");
      setItem(null);
      refetch();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message);
    },
  });

  const handleSwitchChange = (id: any, isActive: boolean) => {
    if (isActive) {
      enableMutation(id);
    } else {
      disableMutation(id);
    }
  };

  const columns: any = [
    {
      title: "Index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: any) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: any, record: any) => {
        const isSuperAdmin = record.isSuperAdmin === 1;

        return (
          !isSuperAdmin && (
            <Switch checked={value === 1} onChange={(checked: boolean) => handleSwitchChange(record.id, checked)} />
          )
        );
      },
    },
    {
      title: "Role",
      dataIndex: "isSuperAdmin",
      key: "role",
      align: "center",
      render: (value: any) => (value === 1 ? "Admin" : "User"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => {
        const isSuperAdmin = record.isSuperAdmin === 1;

        return (
          <div className="flex gap-3 justify-center">
            <div className=" cursor-pointer" onClick={() => router.push(`/user/${record.id}`)}>
              <Image src={editIcon} alt="icon" />
            </div>
            {!isSuperAdmin && (
              <div className="cursor-pointer" onClick={() => handleDelete(record)}>
                <Image src={deleteIcon} alt="icon" />
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className=" min-h-[calc(100vh-24px)] w-full px-4 md:px-6 bg-[#fbfbfb] flex flex-col gap-9 md:gap-12 mb-6">
        <div className="pt-4 md:pt-0 mb-[-20px] md:mb-0 flex justify-between items-center">
          <h1 className="text-[#212529] font-medium text-[24px]">User Management</h1>
          <div onClick={() => router.push("/user/create-user")} className="btn-primary gap-2">
            <Image src={addIcon} alt="icon" /> New User
          </div>
        </div>

        <div className="card">
          <Input
            placeholder="Search"
            onChange={(e: any) => setFormFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="!h-10 mb-4"
            prefix={<Image src={search} alt="icon" height={20} width={20} className="mr-2" />}
          />

          <Table
            columns={columns}
            loading={isLoading}
            dataSource={data?.data?.list}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1000 }}
          />

          <CustomPagination
            page={formFilter.page}
            pageSize={formFilter.itemsPerPage}
            total={data?.data?.count}
            setPage={(value) => setFormFilter({ ...formFilter, page: value })}
            setPerPage={(value) => setFormFilter({ ...formFilter, itemsPerPage: value })}
          />
        </div>
      </div>

      <DeleteModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onSubmit={onDelete}
        content={item?.name}
        isLoading={isDeleting}
      />
    </>
  );
};

export default User;
