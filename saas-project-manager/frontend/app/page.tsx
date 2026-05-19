"use client";

import { useEffect } from "react";
import { api } from "@/src/services/api";
import { AxiosError, AxiosResponse } from "axios";

export default function Home() {
  useEffect(() => {
    api
      .get("/users")
      .then((response: AxiosResponse) => {
        console.log(response.data);
      })
      .catch((error: AxiosError | unknown) => {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      });
  }, []);

  return (
    <main>
      <h1>SaaS Project Manager</h1>
    </main>
  );
}