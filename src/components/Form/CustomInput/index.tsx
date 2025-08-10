"use client";
import { Input } from "antd";
import type { InputProps, TextAreaProps } from "antd/es/input";
import cx from "classnames";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState, forwardRef } from "react";

import { InputStyled } from "./styled";

export const CustomInput = forwardRef<
  any,
  InputProps & {
    className?: string;
    bordered?: boolean;
    placeholder?: string;
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
    wrapClassName?: string;
    onChange: (value: any) => void;
    onClick?: () => void;
    type?: "text" | "password" | "number";
    blurAfterClick?: boolean;
    hideArrow?: boolean;
    value?: any;
    defaultValue?: any;
    forceValue?: any;
    hasPlus?: boolean;
    hasMinus?: boolean;
    onMinus?: (value: any) => void;
    onPlus?: (value: any) => void;
    allowDecimal?: boolean;
  }
>(
  (
    {
      className,
      bordered = true,
      placeholder,
      prefixIcon,
      wrapClassName,
      suffixIcon,
      type = "text",
      blurAfterClick = false,
      onChange,
      onClick,
      hideArrow = false,
      value,
      defaultValue,
      forceValue,
      hasPlus = false,
      hasMinus = false,
      onMinus,
      onPlus,
      allowDecimal = false,
      ...rest
    },
    ref,
  ) => {
    const [label, setLabel] = useState<string>();

    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (type === "number") {
        let regex = /^[1-9]\d*$/;

        if (allowDecimal) {
          regex = /^[1-9]\d*\.?\d{1,3}$/;
        }

        const formatValue = value.replace(/,/g, "");

        if (regex.test(formatValue)) {
          onChange(Number(formatValue));
          setLabel(Number(formatValue).toLocaleString("en-US"));
        } else {
          onChange(0);

          setLabel("");
        }
      } else {
        onChange(value);
        setLabel(value);
      }
    };

    useEffect(() => {
      const inputValue = defaultValue || value;

      if (type === "number") {
        if (label === undefined) {
          setLabel(inputValue?.toLocaleString("en-US"));
          return;
        }

        const formatValue = label?.replace(/,/g, "");

        if (Number(formatValue) !== inputValue) {
          setLabel(inputValue?.toLocaleString("en-US"));
        }
      } else if (inputValue !== label) {
        setLabel(inputValue);
      }
    }, [value, defaultValue]);

    const onClickInput = () => {
      if (blurAfterClick && ref && typeof ref === "object" && ref.current) {
        ref.current.blur();
      }

      if (onClick) {
        onClick();
      }
    };

    return (
      <InputStyled className={`${wrapClassName} flex items-center gap-x-2`}>
        <Input
          className={cx("text-[#666666]  leading-normal focus:shadow-none focus-within:shadow-none", className, {
            "border-b border-t-0 border-l-0 border-r-0 border-[#B2B2B2] rounded-none ": !bordered,
            "hide-arrow": hideArrow,
          })}
          type={type === "number" ? "text" : type}
          placeholder={placeholder}
          prefix={prefixIcon}
          suffix={suffixIcon}
          onChange={onChangeValue}
          onClick={onClickInput}
          ref={ref}
          value={forceValue ?? label}
          {...rest}
        />
      </InputStyled>
    );
  },
);

CustomInput.displayName = "CustomInput";

const { TextArea } = Input;

export function CustomTextarea(props: TextAreaProps & { rows?: number }) {
  const { className, rows = 3, ...rest } = props;

  return (
    <TextArea
      className={cx("rounded-md px-4 py-2 border-[#DEE2E6] placeholder-[#ADB5BD]", className)}
      rows={rows}
      {...rest}
    />
  );
}
