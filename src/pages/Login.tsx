import { useState } from "react";

import Form from "../components/Form";

export function Login() {
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
