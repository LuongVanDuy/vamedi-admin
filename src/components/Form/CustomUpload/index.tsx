"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Upload, UploadFile, message } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import type { RcFile, UploadRequestOption } from "rc-upload/lib/interface";
import { uploadFile } from "@/core/api/upload.service";
import { buildImageUrl } from "@/core/helper/utility";

export type CustomUploadProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  buttonText?: string;
  disabled?: boolean;
  sizeLimitMB?: number;
  getUrlFromResponse?: (response: any) => string;
  className?: string;
  style?: React.CSSProperties;
  listType?: "text" | "picture" | "picture-card" | "picture-circle";
};

export default function CustomUpload({
  value,
  onChange,
  buttonText = "Upload",
  disabled = false,
  sizeLimitMB = 5,
  getUrlFromResponse,
  className,
  style,
  listType = "picture-card",
}: CustomUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setCurrentImageUrl(value || null);
  }, [value]);

  const extractUrl = useCallback(
    (res: any) => {
      if (getUrlFromResponse) return getUrlFromResponse(res);
      if (!res) return "";
      if (typeof res === "string") return res;
      if (typeof res?.data === "string") return res.data;
      return res?.url ?? res?.data?.url ?? res?.data?.data?.url ?? "";
    },
    [getUrlFromResponse],
  );

  const beforeUpload = useCallback(
    (file: RcFile) => {
      const isWithinSize = file.size / 1024 / 1024 <= sizeLimitMB;
      if (!isWithinSize) {
        message.error(`File must be smaller than ${sizeLimitMB}MB`);
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    [sizeLimitMB],
  );

  const customRequest = useCallback(
    async (options: UploadRequestOption) => {
      const { file, onError, onSuccess } = options;

      try {
        setIsUploading(true);
        const response = await uploadFile(file as File);
        const uploadedUrl = extractUrl(response);

        if (!uploadedUrl) {
          throw new Error("Cannot extract uploaded URL from server response");
        }

        setCurrentImageUrl(uploadedUrl);
        onChange?.(uploadedUrl);
        onSuccess?.(response, new XMLHttpRequest());
      } catch (err: any) {
        message.error("Upload failed");
        onError?.(err);
      } finally {
        setIsUploading(false);
      }
    },
    [extractUrl, onChange],
  );

  const handleRemove = useCallback(
    (file: UploadFile) => {
      setCurrentImageUrl(null);
      onChange?.("");
      return true;
    },
    [onChange],
  );

  const handlePreview = useCallback(() => {
    if (currentImageUrl) {
      const src = buildImageUrl(currentImageUrl);
      if (src) window.open(src, "_blank", "noopener,noreferrer");
    }
  }, [currentImageUrl]);

  const fileList: UploadFile[] = currentImageUrl
    ? [
        {
          uid: "current-image",
          name: currentImageUrl.split("/").pop() || "image",
          status: "done" as const,
          url: currentImageUrl,
          thumbUrl: buildImageUrl(currentImageUrl),
        },
      ]
    : [];

  const uploadButton = (
    <div className="flex flex-col items-center justify-center text-gray-600 gap-1 h-full">
      {isUploading ? <LoadingOutlined /> : <UploadOutlined />}
      <span className="text-[11px] text-gray-400">{isUploading ? "Uploading..." : buttonText}</span>
    </div>
  );

  return (
    <div style={style}>
      <Upload
        listType={listType}
        accept="image/*"
        maxCount={1}
        disabled={disabled || isUploading}
        fileList={fileList}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onRemove={handleRemove}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: !isUploading,
        }}
        className="w-full h-full [&_.ant-upload]:!w-full [&_.ant-upload]:!h-full [&_.ant-upload-select]:!w-full [&_.ant-upload-select]:!h-full"
      >
        {!currentImageUrl ? uploadButton : null}
      </Upload>
    </div>
  );
}
