import { Checkbox } from "antd";
import styled from "styled-components";

export const CheckboxStyled = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #FDC101 !important;
    border-color: #FDC101 !important;
  }

  .ant-checkbox-wrapper {
    margin-top: 5px !important;
  }
`;
