import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required!"),
});

export default schema;
