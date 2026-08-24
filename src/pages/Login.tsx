import { useState } from "react";

import Form from "../components/Form";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Form
        email={email}
        passWord={password}
        setEmail={setEmail}
        setPassWord={setPassword}
      ></Form>
    </>
  );
}
